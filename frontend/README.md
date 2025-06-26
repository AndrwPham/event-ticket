# Event Ticket Platform Frontend

## 🚀 Overview

This is an enterprise-grade ticketing platform frontend, architected to rival industry leaders like Ticketmaster. Built with modern web technologies, it delivers a seamless, secure, and scalable experience for event discovery, ticket purchase, and event management.

---

## 🛠️ Technology Stack

- **React 19**: Modern, component-based UI
- **TypeScript**: Type safety across the codebase
- **Vite**: Lightning-fast build tool and dev server
- **React Router v6**: Advanced client-side routing
- **Tailwind CSS**: Utility-first, responsive design
- **Syncfusion UI Suite**: Enterprise-grade UI components (rich text editor, dropdowns, etc.)
- **Swiper.js**: Touch-enabled carousels
- **Lucide React & React Icons**: Modern iconography
- **PayOS**: Embedded payment gateway integration
- **ESLint + Prettier**: Automated code quality and formatting

---

## 🏗️ Architecture & Best Practices

### Modular, Feature-Based Structure

- **Pages**: Each feature (home, search, event, payment, profile) is a self-contained module
- **Components**: Reusable, atomic UI components (Navbar, Tooltip, EventCard, etc.)
- **Context**: Global state management for authentication and user session
- **Hooks**: Custom hooks for file preview, API integration, etc.
- **Types**: Centralized, type-safe data models

### Context-Driven State Management

- **AuthContext**: Handles authentication, session restoration, and user state
- **Automatic session validation** on app load
- **Type-safe context** for robust state management

### Advanced Routing

- **RESTful, parameterized routes** for events, tickets, payments, and profiles
- **Nested resource navigation** for a clean, scalable URL structure

### API Integration

- **Type-safe API calls** with error handling
- **Cookie-based authentication** for secure sessions
- **Role-based access control**

---

## 🎨 UI/UX Excellence

### Design System

- **Professional color palette** for brand consistency
- **Responsive grid layouts** for mobile-first design
- **Accessible components** (ARIA, keyboard navigation)
- **Interactive states** (hover, loading, error)

### Component Highlights

- **Navbar**: Dynamic links based on authentication state
- **Tooltip**: Custom, positionable tooltips for enhanced UX
- **EventCard & TicketCard**: Consistent, visually appealing event/ticket displays
- **FilterPanel**: Multi-dimensional filtering for event discovery
- **OrderReceipt**: Professional, printable order summary

---

## 🎯 Core Features

### 1. Event Discovery & Search

- **Home page**: Special events carousel, upcoming events, trusted brands
- **Search page**: Real-time search, multi-dimensional filtering (category, location, price, date)
- **Event details**: Rich event info, images, organizer, and ticket classes

### 2. Ticket Purchase Flow

- **Visual seat selection**: Interactive venue map, real-time seat status
- **Multi-seat selection**: Add/remove seats, price calculation
- **Buyer info form**: Collects attendee details
- **Order summary**: Real-time updates, clear breakdown

### 3. Payment Integration

- **Embedded PayOS checkout**: No redirects, seamless experience
- **QR code fallback**: For digital ticket validation
- **Real-time payment status polling**: Automatic confirmation and error handling
- **Order receipt**: Downloadable, printable, and email-ready

### 4. Event Creation & Management

- **Multi-step wizard**: Event info, time/tickets, payment
- **Rich text editor**: Syncfusion for event descriptions
- **Image upload with preview**: Posters, covers, organizer logos
- **Draft saving**: Local storage for incomplete events
- **Form validation**: Real-time, step-based validation

### 5. User Profile & Order Management

- **Profile page**: View/update personal info
- **Order history**: Track past purchases
- **Role-based navigation**: Attendee/Organizer/Admin

---

## 💎 Brilliant Design Decisions

- **Embedded payment flow**: Seamless, secure, and user-friendly
- **Visual seat selection**: Interactive, real-time, and intuitive
- **Multi-step wizards**: Simplifies complex forms
- **Real-time polling**: Ensures up-to-date payment/order status
- **Type-safe architecture**: Reduces bugs, improves maintainability
- **Mobile-first design**: Fully responsive and touch-friendly
- **Professional UI library**: Syncfusion for enterprise features
- **Context-based state**: Clean separation of concerns

---

## 🔐 Security & Industrial Standards

- **HTTP-only cookies** for authentication
- **Automatic token refresh**
- **CSRF protection**
- **Input validation and sanitization**
- **Role-based access control**
- **Comprehensive error handling**

---

## 🚀 Performance & Scalability

- **Vite**: Fast builds and HMR
- **Code splitting & lazy loading**
- **Optimized state updates with useMemo/useCallback**
- **Efficient API calls and error boundaries**
- **Modular, scalable folder structure**

---

## 🌏 Localization & Regionalization

- **Vietnamese payment gateway (PayOS)**
- **Local address system (city/district/ward)**
- **Currency formatting (VND)**
- **Date/time localization**

---

## 🏆 Competitive Advantages

- **Enterprise-level features**: Event lifecycle, payment, ticketing, and management
- **Professional UI/UX**: Modern, accessible, and responsive
- **Scalable architecture**: Ready for growth and new features
- **Security-first**: Meets industry standards for data protection
- **Developer experience**: TypeScript, ESLint, Prettier, and Vite

---

## 📁 Folder Structure (Key Highlights)

- `src/pages/` - Feature-based pages (home, search, event, payment, profile)
- `src/components/` - Reusable UI components
- `src/context/` - Global state (AuthContext)
- `src/types/` - Centralized type definitions
- `src/hooks/` - Custom React hooks
- `src/assets/` - Images and static assets
- `src/data/` - Mock data for development

---

## 📚 References

- See backend/README.md for API and backend architecture details
- See `src/types/` for all data models and API response types

---

## 📝 Conclusion

This frontend is a showcase of modern web development, best practices, and thoughtful design. It is ready for production, scalable, and delivers a user experience on par with the world's leading ticketing platforms.
