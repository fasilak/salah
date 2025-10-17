# Salah - React + TypeScript + Vite

A modern React application built with Vite and TypeScript, configured for deployment to GitHub Pages.

## 🚀 Features

- ⚡️ Vite for fast development and building
- ⚛️ React with TypeScript
- 🎨 Modern CSS and styling
- 🔧 ESLint for code quality
- 📦 Optimized for production builds
- 🌐 GitHub Pages deployment ready

## 🛠️ Development

### Prerequisites

- Node.js version 20.19+ or 22.12+
- npm or yarn package manager

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/salah.git
cd salah
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. Push your code to a GitHub repository
2. Go to your repository's Settings > Pages
3. Under "Source", select "GitHub Actions"
4. The deployment workflow will automatically run on every push to the main branch

The app will be available at: `https://yourusername.github.io/salah/`

### Manual Deployment

If you prefer to deploy manually:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to GitHub Pages or any static hosting service

## 🏗️ Project Structure

```
salah/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # React components
│   ├── assets/      # Images, styles, etc.
│   └── main.tsx     # Application entry point
├── .github/         # GitHub Actions workflows
└── dist/            # Production build output
```

## 🔧 Configuration

The project includes:

- **Vite Config**: Optimized for GitHub Pages with correct base path
- **TypeScript**: Full type safety
- **ESLint**: Code quality and consistency
- **GitHub Actions**: Automated deployment workflow

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
