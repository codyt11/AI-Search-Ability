# AI Readiness Analyzer

A comprehensive web application for analyzing digital assets and evaluating their compatibility with Large Language Models (LLMs). Automatically analyze PDFs, web copy, emails, and training materials to optimize them for AI readiness.

## Features

### 🔍 **Comprehensive Analysis**

- **Structure & Clarity**: Evaluate heading hierarchy, paragraph organization, and readability scores
- **Token Analysis**: Count tokens, analyze efficiency, and identify optimization opportunities
- **Embedding Potential**: Assess semantic richness and vector embedding suitability
- **Prompt Coverage**: Evaluate how well content answers common questions and use cases

### 📊 **Advanced Analytics**

- **Content Gap Analysis**: Identify missing information based on prompt trends
- **LLM Compatibility Scoring**: Overall readiness assessment for AI processing
- **Interactive Dashboards**: Visualize trends, issues, and improvements over time
- **Actionable Recommendations**: Specific suggestions for optimization

### 📁 **Multi-Format Support**

- PDF documents and reports
- HTML emails and web content
- DOCX training materials
- Plain text files

### 🎯 **Key Capabilities**

- Automatic document processing and text extraction
- Real-time analysis with detailed breakdowns
- Trend tracking and performance metrics
- Export results and recommendations

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Frontend Setup

1. **Clone and navigate to the project**

   ```bash
   git clone <repository-url>
   cd ai-readiness
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to server directory**

   ```bash
   cd server
   ```

2. **Install server dependencies**

   ```bash
   npm install
   ```

3. **Create uploads directory**

   ```bash
   mkdir uploads
   ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   ```env
   PORT=3001
   NODE_ENV=development
   OPENAI_API_KEY=your_openai_api_key_here  # Optional
   MAX_FILE_SIZE=52428800
   UPLOAD_DIR=uploads
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:3001`

## Usage

### 1. Upload Digital Assets

- Navigate to the **Analyze** page
- Drag and drop or click to upload supported files
- Supported formats: PDF, HTML, DOCX, TXT (up to 50MB)

### 2. Review Analysis Results

- **Overall Score**: LLM compatibility percentage
- **Detailed Metrics**: Structure, clarity, tokens, embeddings, prompt coverage
- **Issues Identified**: Specific problems with severity levels
- **Recommendations**: Actionable improvement suggestions
- **Content Gaps**: Missing information based on common queries

### 3. Track Progress

- Visit the **Analytics** dashboard for insights
- Monitor improvement trends over time
- Identify common issues across assets
- View content gap patterns and priorities

### 4. Optimize Content

- Follow specific recommendations for each asset
- Focus on high-priority issues first
- Re-analyze after making improvements
- Track compatibility score improvements

## API Endpoints

### Analysis

- `POST /api/analyze` - Upload and analyze a file
- `GET /api/analyses/recent` - Get recent analysis results
- `GET /api/analyses/:id` - Get specific analysis details
- `DELETE /api/analyses/:id` - Delete an analysis

### Analytics

- `GET /api/analytics` - Get overall analytics data
- `GET /api/analytics/trends` - Get improvement trends
- `GET /api/analytics/issues` - Get common issues breakdown
- `GET /api/analytics/content-gaps` - Get content gap analysis

### Health

- `GET /api/health` - API health check

## Architecture

### Frontend (React + TypeScript)

- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Recharts** for data visualization
- **React Dropzone** for file uploads
- **Axios** for API communication

### Backend (Node.js + Express)

- **Express.js** API server with ES6 modules
- **Multer** for file upload handling
- **PDF-Parse** for PDF text extraction
- **Mammoth** for DOCX processing
- **Node-HTML-Parser** for HTML content extraction
- **Comprehensive analysis services** for content evaluation

### Analysis Engine

- **Structure Analyzer**: Headers, readability, clarity assessment
- **Token Analyzer**: Efficient token counting and distribution
- **Embedding Analyzer**: Semantic richness evaluation
- **Prompt Analyzer**: Question coverage assessment
- **Content Gap Analyzer**: Missing information identification

## Configuration

### Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# OpenAI (Optional)
OPENAI_API_KEY=your_key_here

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=uploads

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Customization

- **Analysis Depth**: Configure in settings (Basic, Standard, Comprehensive)
- **Custom Prompts**: Add domain-specific questions to test against
- **File Size Limits**: Adjust maximum upload size
- **Content Gap Priorities**: Customize gap detection patterns

## Development

### Project Structure

```
ai-readiness/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── services/          # API communication
│   └── main.tsx           # Application entry point
├── server/                # Backend API server
│   ├── routes/            # API route handlers
│   ├── services/          # Analysis services
│   └── index.js           # Server entry point
├── package.json           # Frontend dependencies
└── README.md             # This file
```

### Adding New Analysis Features

1. Create analyzer service in `server/services/`
2. Integrate with analysis route in `server/routes/analysis.js`
3. Update frontend components to display new metrics
4. Add visualizations if needed

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

**File Upload Fails**

- Check file size (max 50MB)
- Verify file format is supported
- Ensure uploads directory exists

**Analysis Errors**

- Check file content is readable
- Verify sufficient text content exists
- Check server logs for detailed errors

**Missing Dependencies**

- Run `npm install` in both root and server directories
- Check Node.js version (18+ required)

**Port Conflicts**

- Frontend: Change port in `vite.config.ts`
- Backend: Change PORT in `.env` file

## License

MIT License - feel free to use this project for commercial and non-commercial purposes.

## Support

For questions, issues, or feature requests:

1. Check the troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with detailed information
4. Include error logs and system information

---
