# Ser Galgos

A greyhound adoption website built with Next.js, dedicated to helping rescue greyhounds find loving forever homes.

## About

Ser Galgos is a non-profit organization focused on rescuing and rehoming greyhounds. Our mission is to find loving homes for these gentle giants, ensuring they live happy and fulfilling lives.

## Features

- **Adoption Application**: Complete adoption form with file upload capabilities
- **Product Shop**: Browse and purchase greyhound-related products
- **Responsive Design**: Optimized for mobile and desktop experiences
- **Interactive UI**: Modern interface with image carousels and dropzone uploads
- **Google Sheets Integration**: Seamless data collection and management

## Tech Stack

- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **File Handling**: React Dropzone
- **Data Processing**: Google Spreadsheet API, Papa Parse
- **Email**: Nodemailer
- **PDF Generation**: jsPDF

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sebasusnik/sergalgos.git
cd sergalgos
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the required environment variables.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
src/
├── app/
│   ├── adoptar/          # Adoption form page
│   ├── shop/             # Products shop page
│   ├── api/              # API routes
│   │   ├── adoptar/      # Adoption form handler
│   │   └── products/     # Products API
│   ├── components/       # Shared components
│   ├── contexts/         # React contexts
│   └── ui/               # UI components and utilities
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Contributing

This project aims to help greyhounds find homes. Contributions are welcome to improve the adoption process and user experience.

## License

This project is private and maintained for the Ser Galgos organization.
