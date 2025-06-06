# Localization Management Frontend

A modern, feature-rich web application for managing translations and localization across multiple languages. Built with Next.js, TypeScript, and Tailwind CSS.

🌐 **Live Demo**: [http://translationmanagerfrontend.s3-website.us-east-2.amazonaws.com/](http://translationmanagerfrontend.s3-website.us-east-2.amazonaws.com/)

## Features

- 🌍 Multi-language support with real-time translation management
- 🔍 Advanced search and filtering capabilities
- 📊 Visual progress tracking for translation completion
- 🏷️ Category-based organization of translation keys
- 📱 Responsive design with dark mode support
- 🔐 User authentication and role-based access
- 📈 Real-time updates and collaboration features
- 🎨 Modern UI with intuitive user experience

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Integration**: React Query
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Heroicons
- **Deployment**: AWS S3 + CloudFront

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn (v1.22.0 or higher)
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/localization-management-frontend.git
   cd localization-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
localization-management-frontend/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand store
│   └── utils/            # Utility functions
├── public/               # Static assets
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

The application is deployed on AWS S3 and served through CloudFront. To deploy your own version:

1. Build the application:
   ```bash
   npm run build
   ```

2. Upload the contents of the `out` directory to your S3 bucket
3. Configure CloudFront distribution (optional but recommended)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ using Next.js and Tailwind CSS
