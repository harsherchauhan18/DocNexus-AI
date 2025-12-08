# 📄 DocNexus-AI

<div align="center">

![DocNexus-AI Banner](https://img.shields.io/badge/DocNexus-AI%20Powered-yellow?style=for-the-badge&logo=openai)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

**AI-Powered Document Management & Analysis System**

*Transform your documents into actionable insights with cutting-edge AI technology*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-setup-instructions) • [API Docs](#-api-documentation) • [Team](#-team)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Error Handling](#-error-handling--reliability)
- [AI/ML Integration](#-aiml-integration)
- [Team](#-team)
- [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview

**DocNexus-AI** is an intelligent document management system that leverages advanced AI to automatically analyze, summarize, classify, and extract insights from various document types. Built with a modern tech stack, it provides seamless document processing with features like OCR, sensitive data masking, and AI-powered summarization.

### Key Highlights

- 🤖 **AI-Powered Analysis**: Automatic document summarization and classification using Groq LLM
- 🔍 **Smart OCR**: Extract text from images and scanned documents
- 🔒 **Data Privacy**: Automatic detection and masking of sensitive information (PII)
- 📊 **Intelligent Search**: Full-text search with MongoDB indexing
- 🎨 **Modern UI**: Power Rangers-themed interface with smooth animations
- ⚡ **Real-time Processing**: Live status updates and auto-refresh

---

## 🎓 Problem Statement

**YELLOW RANGER’S DOC-SAGE INTEL CONSOLE**

An AI-powered document processing system with summarization and semantic search:

1. **Automating document analysis** - Reducing manual review time by 90%
2. **Ensuring data privacy** - Automatically detecting and masking sensitive information
3. **Enabling quick insights** - Generating executive summaries and key points instantly
4. **Organizing intelligently** - Auto-classifying documents by type
5. **Facilitating discovery** - Powerful search across all document content

---

## ✨ Features

### Core Features

- **📤 Multi-Format Upload**
  - Support for PDF, DOCX, DOC, PNG, JPG, JPEG, TXT
  - Drag-and-drop interface
  - Real-time upload progress tracking
  - File type validation

- **🤖 AI-Powered Summarization**
  - Executive Summary generation
  - Full document summary
  - Key points extraction
  - Document analysis and insights

- **🏷️ Automatic Classification**
  - Intelligent document type detection
  - Confidence scoring
  - Support for multiple categories (Resume, Invoice, Contract, Report, etc.)

- **🔐 Sensitive Data Protection**
  - PII detection (emails, phone numbers, SSNs, credit cards)
  - Automatic masking
  - Sensitive data flagging

- **🔍 Advanced Search**
  - Full-text search across all documents
  - MongoDB text indexing
  - Real-time search results

- **📊 Document Management**
  - Document history sidebar
  - Page-level summary statistics
  - Document type distribution
  - Sensitive data tracking

- **👁️ Document Viewer**
  - Detailed document view
  - Summary sections (Executive, Full, Key Points, Analysis)
  - Metadata display
  - Download original files

### Additional Features

- **🔄 Real-time Updates**: Auto-refresh during document processing
- **⏳ Processing Status**: Live status indicators for ongoing operations
- **🗑️ Document Management**: Easy deletion with confirmation
- **📱 Responsive Design**: Works seamlessly on all devices
- **🎨 Modern UI/UX**: Power Rangers-themed with smooth animations

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### AI/ML & Processing
- **Groq LLM** - AI summarization and classification
- **LangChain** - LLM orchestration
- **pdfreader** - PDF text extraction
- **mammoth** - DOCX text extraction
- **OCR.space API** - Image OCR

### Cloud & Storage
- **Cloudinary** - File storage and CDN
- **MongoDB Atlas** - Cloud database

### Authentication & Security
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Cookie-parser** - Secure cookie handling

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  File Upload │  │    Search    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │     CORS     │  │     Auth     │      │
│  │   Router     │  │  Middleware  │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Document   │  │     User     │  │    Search    │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      PROCESSING LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Text Extract │  │  AI Summary  │  │ Classifica-  │      │
│  │ (PDF/DOCX/   │  │  (Groq LLM)  │  │ tion Service │      │
│  │  OCR)        │  └──────────────┘  └──────────────┘      │
│  └──────────────┘  ┌──────────────┐  ┌──────────────┐      │
│                    │  Sensitive   │  │  Cloudinary  │      │
│                    │ Data Masking │  │   Upload     │      │
│                    └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │  Cloudinary  │  │  Groq API    │      │
│  │   Atlas      │  │     CDN      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Upload**: User uploads document → Multer saves to temp → Cloudinary stores file
2. **Extract**: Text extracted from PDF/DOCX/Image using appropriate parser
3. **Process**: 
   - Sensitive data detected and masked
   - AI generates summaries (Executive, Full, Key Points, Analysis)
   - Document auto-classified by type
4. **Store**: Document metadata and summaries saved to MongoDB
5. **Retrieve**: User searches/views documents with instant results

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Groq API key
- OCR.space API key

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

**Backend `.env`:**
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services
GROQ_API_KEY=your_groq_api_key
OCR_SPACE_API_KEY=your_ocr_api_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harsherchauhan18/DocNexus-AI.git
   cd DocNexus-AI
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:8000`

5. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

6. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or login
   - Start uploading and analyzing documents!

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Logout User
```http
POST /users/logout
Authorization: Bearer <token>
```

### Document Endpoints

#### Upload Document
```http
POST /documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- document: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded and processed successfully",
  "data": {
    "_id": "doc_id",
    "filename": "document.pdf",
    "documentType": "Resume",
    "executiveSummary": "...",
    "keyPoints": ["...", "..."],
    "hasSensitiveData": true
  }
}
```

#### Get All Documents
```http
GET /documents?page=1&limit=10
Authorization: Bearer <token>
```

#### Search Documents
```http
GET /documents/search?q=query&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Document by ID
```http
GET /documents/:id
Authorization: Bearer <token>
```

#### Delete Document
```http
DELETE /documents/:id
Authorization: Bearer <token>
```

#### Get Document History
```http
GET /documents/history?limit=20
Authorization: Bearer <token>
```

---

## 📸 Screenshots

### Home Page
*Upload interface with drag-and-drop functionality*

### Document Grid
*Grid view showing all uploaded documents with summaries*

### Document Detail View
*Comprehensive view with executive summary, key points, and analysis*

### Search Interface
*Real-time search across all documents*

### Page Summary
*Statistics and insights about your document collection*

---

## 🛡️ Error Handling & Reliability

### Frontend Error Handling

- **Network Errors**: Axios interceptors catch and display user-friendly messages
- **Upload Failures**: Clear error messages with retry options
- **Validation**: Client-side validation for file types and sizes
- **Loading States**: Spinners and progress indicators for all async operations

### Backend Error Handling

- **Try-Catch Blocks**: All async operations wrapped in error handlers
- **Centralized Error Middleware**: Consistent error response format
- **Logging**: Detailed console logging for debugging
- **Graceful Degradation**: Fallback mechanisms for API failures

### Data Reliability

- **MongoDB Transactions**: Ensure data consistency
- **File Cleanup**: Temporary files deleted after processing
- **Retry Logic**: Automatic retries for transient failures
- **Data Validation**: Mongoose schemas enforce data integrity

### Processing Reliability

- **Status Tracking**: Documents have processing status (pending, processing, completed, failed)
- **Auto-refresh**: UI polls for updates during processing
- **Timeout Handling**: 5-minute timeout for long-running operations
- **Error Recovery**: Failed documents marked appropriately with error messages

---

## 🤖 AI/ML Integration

### Groq LLM Integration

**Purpose**: Document summarization and classification

**Features**:
- **Executive Summary**: Concise 2-3 sentence overview
- **Full Summary**: Comprehensive document summary
- **Key Points**: Bullet-point extraction of main ideas
- **Analysis**: Detailed document analysis
- **Classification**: Automatic document type detection with confidence scores

**Implementation**:
```javascript
// Using LangChain with Groq
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});

const prompt = ChatPromptTemplate.from Template(`
  Analyze this document and provide an executive summary...
`);

const chain = prompt.pipe(model).pipe(new StringOutputParser());
const summary = await chain.invoke({ text: documentText });
```

### OCR Integration

**Purpose**: Extract text from images and scanned documents

**Service**: OCR.space API

**Supported Formats**: PNG, JPG, JPEG

**Features**:
- High accuracy text extraction
- Multi-language support
- Table detection
- Handwriting recognition

### Sensitive Data Detection

**Purpose**: Identify and mask PII

**Patterns Detected**:
- Email addresses
- Phone numbers (US format)
- Social Security Numbers
- Credit card numbers
- IP addresses
- Dates of birth

**Implementation**: Regex-based pattern matching with automatic masking

---

## 👥 Team OnlyBasics

### Team Members

| Name | Role | Responsibilities |
|------|------|------------------|
| **Harshvardhan Singh Chauhan** | [Team Lead] | [OCR and Backend] |
| **Harsh Choudhary** | [Gen AI] | [Gen AI and Backend] |
| **Ayush Agarwal** | [Integrator] | [Integration and Frontend] |

---

## 🚀 Future Aspects & Enhancements

### AI/ML Enhancements

- [ ] **Multi-Model Support**: Integration with GPT-4, Claude, and Gemini for comparative analysis
- [ ] **Document Comparison**: AI-powered document diff and similarity detection
- [ ] **Question Answering**: RAG-based Q&A system for uploaded documents
- [ ] **Entity Recognition**: Advanced NER for extracting people, organizations, locations
- [ ] **Sentiment Analysis**: Analyze document tone and sentiment
- [ ] **Language Translation**: Multi-language support with automatic translation
- [ ] **Document Generation**: AI-powered document creation from templates
- [ ] **Smart Recommendations**: Suggest related documents based on content

### Technical Improvements

- [ ] **Caching Layer**: Redis caching for frequently accessed documents and search results
- [ ] **Message Queue**: Bull/BullMQ for asynchronous background job processing
- [ ] **Microservices Architecture**: Split into separate services (Auth, Document, AI, Storage)
- [ ] **GraphQL API**: Alternative to REST for flexible and efficient queries
- [ ] **WebSockets**: Real-time updates without polling for processing status
- [ ] **Docker Containerization**: Multi-container setup with Docker Compose
- [ ] **Kubernetes Deployment**: Orchestration for scalability and high availability
- [ ] **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- [ ] **Load Balancing**: Nginx/HAProxy for distributing traffic
- [ ] **Database Sharding**: Horizontal scaling for large document collections

### Features & Functionality

- [ ] **Batch Processing**: Upload and process multiple documents simultaneously
- [ ] **Document Versioning**: Track changes and maintain version history
- [ ] **Collaborative Features**: Share documents and annotations with team members
- [ ] **Advanced Filters**: Filter by date range, document type, sensitivity, size
- [ ] **Export Options**: Export summaries to PDF, Word, Excel formats
- [ ] **Email Integration**: Email documents directly to the system
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Browser Extension**: Quick document upload from any webpage
- [ ] **Voice Commands**: Voice-activated document search and management
- [ ] **Scheduled Reports**: Automated weekly/monthly document insights

### Security & Compliance

- [ ] **End-to-End Encryption**: Encrypt documents at rest and in transit
- [ ] **Two-Factor Authentication**: Enhanced security for user accounts
- [ ] **Role-Based Access Control**: Granular permissions for teams and organizations
- [ ] **Audit Logs**: Comprehensive logging of all document access and modifications
- [ ] **GDPR Compliance**: Data privacy and right to deletion features
- [ ] **SOC 2 Certification**: Enterprise-grade security compliance
- [ ] **Data Retention Policies**: Automated document archival and deletion
- [ ] **Watermarking**: Add watermarks to sensitive documents

### Performance & Scalability

- [ ] **CDN Integration**: CloudFront/Fastly for faster global content delivery
- [ ] **Database Indexing**: Optimized indexes for faster queries
- [ ] **Lazy Loading**: Improve initial page load times
- [ ] **Progressive Web App**: Offline support and app-like experience
- [ ] **Server-Side Rendering**: SSR for better SEO and initial load
- [ ] **Code Splitting**: Reduce bundle size with dynamic imports
- [ ] **Image Optimization**: Automatic image compression and format conversion

### Analytics & Insights

- [ ] **Usage Analytics**: Track document views, searches, and user behavior
- [ ] **Dashboard**: Visual analytics with charts and graphs
- [ ] **Document Trends**: Identify trending topics and document types
- [ ] **User Activity Reports**: Detailed reports on team productivity
- [ ] **Cost Analysis**: Track API usage and storage costs
- [ ] **Performance Metrics**: Monitor system health and response times

### Integration & Extensibility

- [ ] **Third-Party Integrations**: Slack, Microsoft Teams, Google Drive, Dropbox
- [ ] **Zapier Integration**: Connect with 5000+ apps
- [ ] **Webhook Support**: Real-time notifications for document events
- [ ] **REST API v2**: Enhanced API with better documentation
- [ ] **SDK Development**: Official SDKs for Python, JavaScript, Java
- [ ] **Plugin System**: Allow custom plugins and extensions
- [ ] **OAuth2 Support**: Social login with Google, GitHub, Microsoft

### User Experience

- [ ] **Dark Mode**: Full dark theme support
- [ ] **Customizable Themes**: User-defined color schemes
- [ ] **Keyboard Shortcuts**: Power user features for faster navigation
- [ ] **Drag-and-Drop Reorganization**: Reorder and organize documents visually
- [ ] **Advanced Search Filters**: Boolean operators, wildcards, regex support
- [ ] **Document Preview**: Quick preview without opening full view
- [ ] **Bulk Actions**: Select and perform actions on multiple documents
- [ ] **Favorites/Bookmarks**: Mark important documents for quick access
- [ ] **Recent Activity**: Timeline of recent document interactions
- [ ] **Accessibility**: WCAG 2.1 AA compliance for better accessibility

---

## 📄 License

This project is licensed under the MNNIT Allahabad.

---

## 🙏 Acknowledgments

- **Groq** for providing powerful LLM API
- **Cloudinary** for reliable file storage
- **MongoDB** for flexible database solution
- **OCR.space** for OCR capabilities
- **Dev_Or_Die** for the opportunity to build this project

---

<div align="center">

**Made with ❤️ by Team OnlyBasics**

[⬆ Back to Top](#-docnexus-ai)

</div>


