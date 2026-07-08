# Architecture Diagram

## System Overview

This document describes the architecture of the Mainframe File Data Processor application, a full-stack solution for extracting data from ID documents using AI-powered processing.

---

## Architecture Components

### **Presentation Layer (Frontend)**
- **React Frontend** (`/reactfrontend01`)
  - File upload interface
  - Real-time processing status indicators
  - Dynamic results table display
  - API communication via Fetch API

### **API Layer (Spring Boot Backend)**
- **FileController** (`/api`)
  - POST `/api/upload` - File upload endpoint
  - GET `/api/extract/{id}` - Data extraction endpoint
  - GET `/api/image/{id}` - Individual image retrieval
  - GET `/api/images` - All images listing

### **Service Layer**
- **FileService**
  - Image processing and storage
  - Database persistence
  - Image metadata management

- **IdDocumentService**
  - Claude AI API integration
  - Base64 image encoding
  - JSON field parsing
  - Multi-language document support

### **Data Layer**
- **Image Model** - Document storage entity
- **ImageRepository** - JPA data access layer
- **H2 Database** - Embedded relational database

### **External Integrations**
- **Anthropic Claude API**
  - AI-powered document field extraction
  - Multi-language OCR support
  - JSON response parsing

---

## Data Flow

1. **Upload Phase**
   - User selects file → React Frontend
   - POST to `/api/upload` → FileController
   - FileService processes & stores image
   - Response: Success message

2. **Extraction Phase**
   - Frontend calls GET `/api/extract/{id}`
   - FileController retrieves image via ID
   - IdDocumentService converts to Base64
   - Sends to Claude API with extraction prompt
   - Claude returns JSON fields
   - Response formatted & sent to Frontend
   - React displays extracted data in table

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router |
| Backend | Spring Boot 4.0.6, Java 26 |
| AI Integration | Anthropic Claude API |
| Database | H2 (Embedded) |
| ORM | Spring Data JPA |
| Serialization | Jackson ObjectMapper |
| Build | Maven |

---

## Key Features

✅ **Multi-language Support** - Handles documents in any language  
✅ **AI-Powered Extraction** - Uses Claude for intelligent field recognition  
✅ **Real-time Processing** - Status indicators during extraction  
✅ **MRZ Parsing** - Machine Readable Zone support  
✅ **CORS Enabled** - Cross-origin requests for frontend  
✅ **Error Handling** - Comprehensive exception management  
✅ **JSON-based Communication** - REST API with JSON payloads  

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Client Browser                      │
│  ┌───────────────────────────────────────────────┐   │
│  │  React Frontend (Port 5173)                    │   │
│  │  - File Upload UI                              │   │
│  │  - Results Display                             │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕ HTTP/CORS
┌─────────────────────────────────────────────────────┐
│         Spring Boot Backend (Port 8080)             │
│  ┌───────────────────────────────────────────────┐   │
│  │  FileController                                │   │
│  │  ├─ POST /api/upload                           │   │
│  │  ├─ GET /api/extract/{id}                      │   │
│  │  └─ GET /api/image/{id}                        │   │
│  └───────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────┐   │
│  │  Service Layer                                 │   │
│  │  ├─ FileService (Image processing)            │   │
│  │  └─ IdDocumentService (AI extraction)         │   │
│  └───────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────┐   │
│  │  Data Access Layer                            │   │
│  │  ├─ ImageRepository                           │   │
│  │  └─ H2 Database                               │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕ HTTPS
┌─────────────────────────────────────────────────────┐
│     Anthropic Claude API (Cloud Service)            │
│  - Document field extraction                        │
│  - Multi-language support                           │
│  - JSON response generation                         │
└─────────────────────────────────────────────────────┘
```

---

## Component Interactions

### **Upload Workflow**
```
React UI (File Selection)
    ↓
FileController.receiveImage()
    ↓
FileService.processImage()
    ↓
ImageRepository (Save to H2)
    ↓
Response: Success Message
```

### **Extraction Workflow**
```
React UI (Extract Button)
    ↓
FileController.extract(id)
    ↓
IdDocumentService.extractFields(id)
    ↓
FileService.sendImage(id) [Retrieve Image]
    ↓
Base64 Encoding
    ↓
Claude API Call (with prompt)
    ↓
JSON Parsing (Map<String,String>)
    ↓
IdExtractionResponse
    ↓
React UI (Display Table)
```

---

## Configuration

### Environment Variables (application.properties)
```properties
anthropic.api.model=claude-3-5-sonnet-20241022
anthropic.api.max-tokens=1024
anthropic.api.key=${ANTHROPIC_API_KEY}
```

### CORS Configuration
- Pattern: `http://localhost:[*]` (localhost on any port)
- Supports development across different frontend ports

---

## Error Handling

- **ExtractionException** - Custom exception for extraction failures
- **IOException** - File processing errors
- **JSON Parsing Exceptions** - Claude response parsing errors
- **HTTP Status Codes** - 400 (Bad Request), 500 (Internal Server Error)

---

Generated from code analysis of: `Komal9041/aditya`  
Date: 2026-07-08  
Architecture: 3-Tier with AI Integration
