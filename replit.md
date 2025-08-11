# Image Decryption Tool

## Overview

A full-stack web application designed to decrypt and preview AES-encrypted image files. The application provides a secure interface for users to upload encrypted image files, configure decryption parameters, and view the decrypted images with download capabilities. Built with a React frontend and Express backend, the tool supports various image formats and provides real-time feedback during the decryption process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript and follows a component-based architecture:

- **UI Framework**: Implements shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: Uses React hooks for local state management and TanStack Query for server state management
- **Routing**: Utilizes Wouter for lightweight client-side routing
- **Build System**: Vite-powered development and build pipeline with hot module replacement
- **Component Structure**: Modular component design with separate components for upload zones, configuration cards, processing indicators, image previews, and error handling

### Backend Architecture
The server-side application follows an Express.js REST API pattern:

- **Framework**: Express.js with TypeScript for type safety
- **File Handling**: Multer middleware for multipart file uploads with size limits (10MB)
- **Encryption**: Native Node.js crypto module implementing AES-256-CBC decryption
- **Image Processing**: Sharp library for image metadata extraction and processing
- **Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints with proper error handling and response formatting

### Data Storage Solutions
Currently implements an in-memory storage system with a clear interface for future database integration:

- **Schema Design**: Drizzle ORM with PostgreSQL schema definitions for decryption requests
- **Data Models**: Structured tracking of file uploads, decryption status, metadata, and error handling
- **Storage Interface**: Abstracted storage layer allowing easy migration from memory to persistent database storage

### Authentication and Authorization
The application currently operates without authentication mechanisms, designed for local or trusted environment usage. The architecture supports future integration of authentication systems through middleware patterns.

### Security Considerations
- **File Upload Security**: Implements file size limits and basic file validation
- **Encryption Standards**: Uses industry-standard AES-256-CBC encryption with proper IV handling
- **Error Handling**: Secure error messages that don't expose sensitive cryptographic details
- **Input Validation**: Zod schema validation for all user inputs and configuration parameters

### Development and Deployment
- **Development Environment**: Hot reload with Vite development server and Express backend
- **Build Process**: Separate build processes for client (Vite) and server (esbuild) with optimized output
- **TypeScript Configuration**: Shared types between client and server through a common shared directory
- **Code Organization**: Clear separation of concerns with dedicated directories for client, server, and shared code