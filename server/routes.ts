import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDecryptionRequestSchema, decryptionConfigSchema } from "@shared/schema";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

function decryptAES(encryptedData: Buffer, key: string): Buffer {
  try {
    // Ensure key is 32 bytes for AES-256
    const keyBuffer = Buffer.from(key.padEnd(32, '\0').slice(0, 32), 'utf8');
    
    // Extract IV (first 16 bytes) and encrypted content
    const iv = encryptedData.slice(0, 16);
    const encrypted = encryptedData.slice(16);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: Invalid key or corrupted data');
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Upload and decrypt image
  app.post('/api/decrypt', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { imageKey, clientKeySuffix } = req.body;
      
      // Validate config
      const config = decryptionConfigSchema.parse({ imageKey, clientKeySuffix });
      
      // Create decryption request
      const request = await storage.createDecryptionRequest({
        fileName: req.file.originalname,
        fileSize: req.file.size,
        imageKey: config.imageKey,
        clientKeySuffix: config.clientKeySuffix,
        status: 'pending',
        decryptedImagePath: null,
        errorMessage: null,
        width: null,
        height: null,
        format: null,
      });

      try {
        // Read encrypted file
        const encryptedData = fs.readFileSync(req.file.path);
        
        // Create combined key (image key + client key suffix)
        const combinedKey = config.imageKey + config.clientKeySuffix;
        
        // Decrypt the data
        const decryptedData = decryptAES(encryptedData, combinedKey);
        
        // Save decrypted image
        const decryptedPath = path.join('uploads', `decrypted_${request.id}.jpg`);
        fs.writeFileSync(decryptedPath, decryptedData);
        
        // Get image metadata using Sharp
        const metadata = await sharp(decryptedData).metadata();
        
        // Update request with success
        await storage.updateDecryptionRequest(request.id, {
          status: 'success',
          decryptedImagePath: decryptedPath,
          width: metadata.width || null,
          height: metadata.height || null,
          format: metadata.format || null,
        });

        // Clean up original file
        fs.unlinkSync(req.file.path);

        res.json({ 
          id: request.id,
          status: 'success',
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: Math.round(decryptedData.length / 1024 / 1024 * 100) / 100 // Size in MB
          }
        });

      } catch (decryptionError) {
        // Update request with error
        await storage.updateDecryptionRequest(request.id, {
          status: 'failed',
          errorMessage: decryptionError instanceof Error ? decryptionError.message : 'Unknown decryption error',
        });

        // Clean up files
        fs.unlinkSync(req.file.path);

        res.status(400).json({ 
          error: decryptionError instanceof Error ? decryptionError.message : 'Decryption failed' 
        });
      }

    } catch (error) {
      // Clean up file if it exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Request validation failed' 
      });
    }
  });

  // Serve decrypted image
  app.get('/api/image/:id', async (req, res) => {
    try {
      const request = await storage.getDecryptionRequest(req.params.id);
      
      if (!request || !request.decryptedImagePath) {
        return res.status(404).json({ error: 'Image not found' });
      }

      if (!fs.existsSync(request.decryptedImagePath)) {
        return res.status(404).json({ error: 'Image file not found' });
      }

      res.sendFile(path.resolve(request.decryptedImagePath));
    } catch (error) {
      res.status(500).json({ error: 'Failed to serve image' });
    }
  });

  // Get decryption request status
  app.get('/api/decrypt/:id', async (req, res) => {
    try {
      const request = await storage.getDecryptionRequest(req.params.id);
      
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get request status' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
