# OttReleases

A modern web application that tracks and displays upcoming OTT (Over-The-Top) platform releases including movies, TV shows, and series. Built with Angular 20 and powered by Google Gemini AI for intelligent content discovery.

## Features

- 🎬 **Real-time OTT Releases**: Track upcoming releases across multiple platforms
- 🤖 **AI-Powered**: Uses Google Gemini AI to fetch and categorize content
- 🌙 **Dark Mode**: Built-in dark/light theme toggle
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🔍 **Advanced Filtering**: Filter by platform, genre, and timeframes
- 📊 **Analytics**: Visitor tracking and engagement metrics
- ⚡ **Modern Stack**: Angular 20 with signals, Tailwind CSS, and Node.js backend

## Tech Stack

### Frontend

- **Angular 20** with signals for reactive state management
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **RxJS** for reactive programming

### Backend

- **Node.js** with Express.js
- **Google Gemini AI** for content generation
- **CORS** enabled for cross-origin requests
- **Environment-based configuration**

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v20.3.4)
- Google Gemini API key

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ott-releases
```

- **Install frontend dependencies**

```bash
npm install
```

- **Install backend dependencies**

```bash
cd backend
npm install
cd ..
```

- **Set up environment variables**

```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit backend/.env and add your Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development

- **Start the backend server**

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

- **Start the frontend development server**

```bash
npm start
```

The application will be available at `http://localhost:4200`

### Building for Production

```bash
# Build the Angular application
ng build

# The build artifacts will be stored in the `dist/` directory
```

### Running Tests

```bash
# Run unit tests
ng test

# Run tests in watch mode
ng test --watch
```

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/ott/releases` - Fetch OTT releases
  - Query parameters:
    - `timeframe`: "week" or "month" (default: "week")
    - `limit`: Number of results (default: 20)
    - `offset`: Pagination offset (default: 0)
    - `sortBy`: Sort field - "release_date", "title", "platform" (default: "release_date")
    - `order`: Sort order - "asc" or "desc" (default: "asc")

## Project Structure

```tree
ott-releases/
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # Business logic and API services
│   │   └── models/        # TypeScript interfaces
│   └── environments/      # Environment configurations
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── controllers/   # API route handlers
│   │   ├── services/      # Business logic (Gemini AI integration)
│   │   ├── routes/        # Express routes
│   │   └── config/        # Configuration files
│   └── server.js          # Express server entry point
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Manthan Ankolekar** - [GitHub Profile](https://github.com/manthanankolekar)
