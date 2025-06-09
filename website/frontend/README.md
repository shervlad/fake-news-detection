# Fake News Detector - Website Frontend

This is the frontend for the Fake News Detector website, built with React, Vite, and Tailwind CSS.

## Features

- Modern, responsive design with Tailwind CSS
- Component library using shadcn/ui
- Routing with React Router
- Form handling with React Hook Form
- Interactive UI components
- Submission form for reporting fake news
- Browse page for exploring flagged content
- Chrome extension showcase page

## Prerequisites

- Node.js 18+ and npm/pnpm

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/fake-news-detection.git
   cd fake-news-detection/website/frontend
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

### Development

Run the development server:
```
pnpm run dev
```

This will start the development server at `http://localhost:5173`.

To expose the development server to your local network (useful for testing on other devices):
```
pnpm run dev --host
```

### Building for Production

Build the project for production:
```
pnpm run build
```

The built files will be in the `dist` directory.

Preview the production build locally:
```
pnpm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/
│   │   ├── auth/        # Authentication components
│   │   ├── browse/      # Browse page components
│   │   ├── home/        # Home page components
│   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   ├── moderation/  # Moderation components
│   │   ├── submission/  # Submission form components
│   │   └── ui/          # UI components from shadcn/ui
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── App.css          # App-specific styles
│   ├── App.jsx          # Main App component with routing
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── components.json      # shadcn/ui configuration
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Technologies Used

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [React Router](https://reactrouter.com/) - Routing
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Lucide React](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## Integration with Backend

The frontend is designed to work with the Fake News Detector API. In development, it uses mock data, but in production, it will connect to the backend API.

To configure the API endpoint, update the `API_BASE_URL` constant in the relevant files.

## Deployment

The website can be deployed using various hosting services:

### Vercel

```
vercel
```

### Netlify

```
netlify deploy
```

### GitHub Pages

1. Update `vite.config.js` to include the base path:
   ```js
   export default defineConfig({
     base: '/fake-news-detection/',
     // other config
   })
   ```

2. Build and deploy:
   ```
   pnpm run build
   npx gh-pages -d dist
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

[MIT License](LICENSE)

