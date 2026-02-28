# RAG Chatbot Frontend

A modern React + Vite frontend for the RAG Chatbot system with a beautiful UI and full API integration.

## Features

- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 📄 **Document Management**: Upload, view, and delete PDF/CSV files
- 💬 **Chat Interface**: Real-time chat with document context
- 🔄 **Flow Builder**: Visual conversation flow builder
- 🗑️ **Reset Bot**: Comprehensive data reset options
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API communication
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **React Dropzone** - File uploads

## Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx          # Navigation sidebar
│   ├── pages/
│   │   ├── Documents.jsx        # Document management
│   │   ├── Chatbot.jsx          # Chat interface
│   │   ├── FlowBuilder.jsx      # Flow builder
│   │   └── ResetBot.jsx         # Reset functionality
│   ├── services/
│   │   └── api.js              # API integration
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── postcss.config.js          # PostCSS configuration
```

## API Integration

The frontend communicates with the backend API through the `/api` proxy configured in `vite.config.js`. All API calls are handled in `src/services/api.js`.

### Key API Endpoints

- **Documents**: Upload, list, and delete documents
- **Chat**: Send questions and get contextual responses
- **History**: Manage conversation history

## Components

### Sidebar Navigation
- **Documents**: File upload and management
- **Chatbot**: Interactive chat interface
- **Flow Builder**: Visual flow creation
- **Reset Bot**: Data reset options

### Document Management
- Drag & drop file upload
- File type validation (PDF/CSV)
- Document list with metadata
- Delete functionality

### Chat Interface
- Real-time messaging
- Message history sidebar
- Source attribution
- Clear history option

### Flow Builder
- Visual node-based editor
- Multiple node types
- Save/load functionality
- Drag & drop interface

### Reset Bot
- Selective data clearing
- Chat history reset
- Document deletion
- Complete system reset

## Styling

The application uses Tailwind CSS with custom components defined in `src/index.css`:

- `.btn` - Button styles
- `.card` - Card container
- `.input` - Form inputs

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Add navigation item in `src/components/Sidebar.jsx`

### API Integration

1. Add new API methods in `src/services/api.js`
2. Import and use in your components
3. Handle loading states and errors

### Styling

- Use Tailwind CSS classes
- Create custom components in `src/index.css`
- Follow the existing design patterns

## Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Environment Variables

The frontend uses Vite's proxy configuration to communicate with the backend. Make sure the backend is running on `http://localhost:3000` or update the proxy configuration in `vite.config.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for new components (optional)
3. Add proper error handling
4. Test on different screen sizes
5. Update documentation as needed
