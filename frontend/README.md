# WhatsApp Chat Analyzer - Frontend

React-based frontend application for analyzing WhatsApp chat exports with interactive visualizations.

## Features

- **File Upload**: Drag-and-drop or click to upload WhatsApp chat files
- **Interactive Charts**: Beautiful bar charts showing daily activity using Chart.js
- **User Insights**: Detailed analysis of user engagement and activity patterns
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, custom-designed interface without CSS frameworks

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Chart.js** - Data visualization
- **react-chartjs-2** - React wrapper for Chart.js
- **ES6+** - Modern JavaScript features

## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ActiveUsersList.jsx   # List of engaged users
│   │   ├── ChartDisplay.jsx      # Bar chart component
│   │   ├── ErrorMessage.jsx      # Error display component
│   │   ├── FileUpload.jsx        # File upload with drag-drop
│   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   └── Summary.jsx           # Summary statistics cards
│   ├── App.jsx                   # Main app component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # App entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Component Overview

### App.jsx
Main application component that manages state and orchestrates data flow between components.

### FileUpload
- Drag-and-drop file upload
- File validation
- Upload instructions

### ChartDisplay
- Bar chart visualization
- Dual-axis display (active users vs new users)
- Interactive tooltips
- Responsive design

### ActiveUsersList
- Displays users active 4+ days
- Activity badges
- Sortable by engagement

### Summary
- Key metrics cards
- Total new users
- Total active users
- Highly engaged users count

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`.

**Endpoint**: `POST /api/analyze`
- Uploads chat file
- Receives analysis results
- Displays visualizations

## Styling

Custom CSS without any frameworks:
- CSS Variables for theming
- Flexbox and Grid layouts
- Smooth transitions and animations
- Mobile-first responsive design
- Accessibility considerations

## Key Features

### Chart Visualization
- Blue bars: Users who sent messages each day
- Orange bars: New users who joined each day
- Interactive tooltips with detailed information
- Responsive scaling for different screen sizes

### User Analysis
- Identifies users active 4+ days in the last week
- Shows activity levels with badges (gold, silver, bronze)
- Displays user initials or phone number snippets

### Error Handling
- File type validation
- API error display
- User-friendly error messages
- Dismissible error alerts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized React rendering
- Lazy loading of chart components
- Efficient state management
- Minimal re-renders

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader friendly

## Future Enhancements

- Export analysis as PDF
- Compare multiple time periods
- User sentiment analysis
- Message frequency heatmap
- Custom date range selection
