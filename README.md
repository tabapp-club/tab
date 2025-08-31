# Business Dashboard

A modern, responsive business dashboard built with Next.js 15, TypeScript, and Tailwind CSS, designed from a Figma mockup.

## Features

- **📊 Real-time Analytics**: Display customer metrics including total, unique, retained, and inactive customers
- **🎯 Campaign Management**: Visual campaign cards for different business growth strategies
- **📱 Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, professional design with smooth animations and transitions
- **🔍 SEO Optimized**: Complete SEO metadata and Open Graph tags
- **♿ Accessible**: Proper focus states and keyboard navigation support
- **📊 Interactive Filters**: Time-based filtering (Today, Yesterday, 7D, 30D, 3M, 6M, 12M, Custom)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Font**: Manrope (Google Fonts)
- **Icons**: Custom SVG icons
- **State Management**: React hooks (useState, useEffect)

## Project Structure

```
my-figma-app/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard page
│   │   ├── globals.css           # Global styles and responsive design
│   │   ├── layout.tsx           # Root layout with Manrope font
│   │   └── page.tsx             # Home page (redirects to dashboard)
│   └── components/
│       ├── Sidebar.tsx          # Navigation sidebar component
│       ├── CampaignCards.tsx    # Campaign cards display
│       ├── AnalyticsCards.tsx   # Customer analytics cards
│       ├── TimeFilter.tsx       # Time period filter component
│       └── MobileMenuToggle.tsx # Mobile menu toggle button
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

## Components Overview

### Sidebar
- Fixed sidebar with navigation menu
- User profile section
- "New Campaign" button
- Responsive mobile menu with overlay
- Bottom action buttons (Help, Settings, Logout)

### CampaignCards
- Four campaign types: Feedback & Survey, Retention, Engagement, Advertise
- Gradient backgrounds with custom icons
- Hover effects and smooth transitions

### AnalyticsCards
- Customer metrics display with large numbers
- Trend indicators (up/down with colored backgrounds)
- Clean, card-based layout

### TimeFilter
- Button group for time period selection
- Active state styling
- Calendar icon for custom option

### MobileMenuToggle
- Hamburger menu for mobile devices
- Overlay background
- Smooth animations

## Responsive Design

The dashboard implements a mobile-first responsive design with specific breakpoints:

- **Desktop (1024px+)**: Full sidebar visible, horizontal card layout
- **Tablet (768px-1023px)**: Collapsible sidebar, maintained card layout
- **Mobile (480px-767px)**: Mobile menu, stacked card layout, optimized spacing
- **Small Mobile (<480px)**: Compact layout, reduced font sizes

## Key Features Implementation

### SEO & Metadata
- Complete Open Graph tags
- Twitter Card meta tags
- Structured data for search engines
- Responsive viewport meta tag

### Accessibility
- Proper focus states
- Keyboard navigation
- Screen reader friendly
- Semantic HTML structure

### Performance
- Optimized fonts with display: swap
- Efficient CSS with Tailwind
- Minimal JavaScript bundle
- Smooth animations with CSS transforms

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Colors
The dashboard uses a consistent color palette defined in the components:
- Primary: `#7856ff`
- Text: `#2a2a2f`
- Secondary text: `#626266`
- Background: `#ffffff`
- Sidebar: `#f6f6f6`
- Borders: `#e9e9e9`

### Fonts
The project uses Manrope font family with weights:
- Regular (400)
- Medium (500)
- Semi-bold (600)
- Bold (700)

### Icons
All icons are custom SVG components, making them easily customizable and ensuring consistent styling.

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test responsiveness on multiple devices
5. Submit a pull request

## License

This project is licensed under the MIT License.
