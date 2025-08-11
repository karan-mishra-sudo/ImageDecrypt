import { type DecryptionRequest, type InsertDecryptionRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createDecryptionRequest(request: InsertDecryptionRequest): Promise<DecryptionRequest>;
  getDecryptionRequest(id: string): Promise<DecryptionRequest | undefined>;
  updateDecryptionRequest(id: string, updates: Partial<DecryptionRequest>): Promise<DecryptionRequest | undefined>;
}

export class MemStorage implements IStorage {
  private requests: Map<string, DecryptionRequest>;

  constructor() {
    this.requests = new Map();
  }

  async createDecryptionRequest(insertRequest: InsertDecryptionRequest): Promise<DecryptionRequest> {
    const id = randomUUID();
    const request: DecryptionRequest = { ...insertRequest, id };
    this.requests.set(id, request);
    return request;
  }

  async getDecryptionRequest(id: string): Promise<DecryptionRequest | undefined> {
    return this.requests.get(id);
  }

  async updateDecryptionRequest(id: string, updates: Partial<DecryptionRequest>): Promise<DecryptionRequest | undefined> {
    const existing = this.requests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.requests.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
