# WhatsApp Chat Analyzer - Backend

Backend API server for analyzing WhatsApp chat exports built with Node.js and Express.

## Features

- Parse WhatsApp chat export files
- Extract user join events and message activity
- Analyze last 7 days of activity
- RESTful API with proper error handling
- CORS enabled for frontend integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **ES6 Modules** - Modern JavaScript syntax

## Installation

```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Analyze Chat
```
POST /api/analyze
Content-Type: multipart/form-data
```

**Request:**
- `chatFile`: WhatsApp chat export text file

**Response:**
```json
{
  "success": true,
  "data": {
    "chartData": {
      "labels": ["Mar 30", "Mar 31", ...],
      "newUsers": [2, 5, 3, ...],
      "activeUsers": [10, 15, 12, ...]
    },
    "activeUsers4Plus": [
      {
        "user": "+911691994",
        "activeDays": 7,
        "dates": ["2021-03-30", "2021-03-31", ...]
      }
    ],
    "summary": {
      "totalNewUsersLast7Days": 25,
      "totalActiveUsersLast7Days": 45,
      "usersActive4PlusDays": 12
    }
  }
}
```

## Error Handling

- File size limit: 10MB
- Only text files (.txt) accepted
- Proper HTTP status codes
- Descriptive error messages

## Project Structure

```
backend/
├── server.js              # Main server file
├── utils/
│   ├── chatParser.js      # WhatsApp chat parsing logic
│   └── chatAnalyzer.js    # Chat analysis logic
├── package.json
└── README.md
```

## Development Notes

- Uses ES6 module syntax (`import`/`export`)
- All dates are parsed from WhatsApp's format
- Handles multi-line messages
- Detects various join event formats
- Normalizes phone numbers for consistency
