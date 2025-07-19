# Ser Galgos - Greyhound Adoption Website

A beautiful, responsive website for Ser Galgos, an organization dedicated to rescuing and rehoming greyhounds.

## Features

- 🎨 Modern, responsive design built with Tailwind CSS
- 📱 Mobile-first approach with mobile navigation
- 🏃‍♂️ Smooth scrolling and section navigation
- 💚 Dedicated to greyhound adoption and rescue

## Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Intersection Observer API for navigation
- **Vite** - Modern build tool and dev server
- **Google Fonts** - IBM Plex Serif and Plus Jakarta Sans

## Getting Started

### Prerequisites

- Node.js (version 20.19.0 or higher recommended)
- npm

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
sergalgos/
├── public/                 # Static assets
│   ├── galgo-hero.png     # Hero image
│   └── *.svg              # Icon assets
├── index.html             # Main HTML file
├── vite.config.js         # Vite configuration
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## Design

The website features:
- Clean, modern design with orange accent color (#F97316)
- Responsive grid layouts
- Smooth navigation with active section highlighting
- Mobile bottom navigation for better UX on small screens
- Testimonials and adoption process sections

## Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## License

MIT License - feel free to use this project as a template for other animal rescue organizations.
