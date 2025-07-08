# SocialU - Modern Social Media Platform

![image](https://github.com/user-attachments/assets/c11308cb-18c5-4920-922d-68e3bf528a23)


## 📱 Project Overview

SocialU is a full-featured, responsive social media platform designed to connect university communities. It provides a modern UI/UX with real-time interactions, personalized content feeds, and robust user authentication.

### 🌟 Live Demo: [SocialU Platform](https://socialu.vercel.app)
![image](https://github.com/user-attachments/assets/b2f011b6-d683-4d79-a533-0b38e123215c)


## 🚀 Key Features

- **Interactive Feed System** - Dynamic content rendering with infinite scroll
- **Real-time Interactions** - Comments, reactions, and notifications powered by Convex
- **User Authentication** - Secure multi-provider auth flow with NextAuth.js
- **Rich Media Support** - Image, video, and file upload capabilities
- **Responsive Design** - Optimized experience across all device sizes

## 🛠️ Technical Stack

### Frontend
- **Next.js 13+** with App Router for optimized server/client rendering
- **React 18** utilizing Hooks, Context API, and Server Components
- **TypeScript** for type-safe development
- **Tailwind CSS** for responsive, utility-first styling
- **Storybook** for component documentation and visual testing

### Backend & Data
- **Convex** for backend logic and real-time data synchronization
- **NextAuth.js** for authentication with multiple providers
- **Media Storage** for user-generated content

### Development Tools
- **ESLint/Prettier** for code quality and consistency
- **Jest/Testing Library** for unit and component testing
- **Trunk** for workflow optimization
- **Continuous Integration** with GitHub Actions

## 🏗️ Architecture

SocialU follows a modern, component-based architecture with a clear separation of concerns:

```
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable UI components
├── convex/             # Backend logic and data models
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── context/            # React context providers
├── styles/             # Global styles and Tailwind configuration
└── public/             # Static assets
```

### Key Architectural Decisions

- **Server Components** for improved performance and SEO
- **Client-Server Component Pattern** for optimal interactivity
- **Component-Driven Development** with Storybook
- **Real-Time Data Subscriptions** via Convex
- **Optimistic UI Updates** for improved user experience

## 💻 Development Approach

The development process follows modern best practices:

- **Component-First Design** - Building reusable UI elements before page layouts
- **Mobile-First Responsiveness** - Ensuring great experiences across all devices
- **Accessibility Focus** - Following WCAG guidelines for inclusive design
- **Performance Optimization** - Leveraging Next.js Image, code splitting, and bundle analysis
- **Test-Driven Development** - Unit and integration tests for critical functionality

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: All metrics in the "good" range
- **Time to Interactive**: < 3.5s on 3G connections
- **Bundle Size**: Optimized with code splitting and tree shaking

## 🧩 Code Examples

### Component Pattern Example

```tsx
// Showcasing component structure with TypeScript props
import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlighted';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  variant = 'default',
  onClick 
}) => {
  return (
    <div 
      className={`${styles.card} ${styles[variant]}`}
      onClick={onClick}
    >
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Arturo2R/SocialU.git

# Install dependencies
yarn install

# Start development server
yarn dev

# Run Storybook
yarn storybook

# Run tests
yarn test
```

## 📱 Contact & Connect

I'm currently looking for frontend development opportunities. If you're impressed by this project, I'd love to chat about how I can contribute to your team.

- **Email**: [arosenstielhl@uninorte.edu.co](mailto:arosenstielhl@uninorte.edu.co)
- **LinkedIn**: [linkedin.com/in/arturo2r](https://linkedin.com/in/arturo2r)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ by Arturo2R*
![image](https://github.com/user-attachments/assets/f9f2a384-fa30-4cfe-8424-4605ac96d1a6)
