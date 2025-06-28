# 🌐 Angular Social Media App (Zoneless)

A fully functional, cutting-edge zoneless Angular social media application that simulates core social network features — including complete timeline interactions, friend management, posts, stories, and authentication — all powered by local storage with optimized change detection for seamless performance.

---

## 🚀 Features

### ⏰ Advanced Timeline System
- **Dynamic Post Feed**:
  - New post indicators
  - Time-ordered content
- **Rich Post Interactions**:
  - Create posts
  - Image posts (4 max) with preview gallery
  - Feeling/activity tags
  - Privacy controls (Public/Friends/Only Me)
- **Engagement Features**:
  - Like/Unlike posts with persistent counts
  - Comment with nested replies (2 levels deep)
- **Content Types**:
  - Text-only posts
  - Image posts
  - Mixed content posts
- **Real-time Simulation**:
  - Local storage updates reflect instantly
  - UI indicators for new activity

### 🔐 Authentication System
- Complete auth flow with router
- Sign Up / Sign In forms with validation
- Forgot Password flow
- Email confirmation simulation
- Password change functionality

### 📱 Core Functionality
- **Post System**:
  - Create/edit posts with images (preview supported)
  - Like posts and track interactions
  - Comment with threaded replies
  - All data persisted in local storage

- **Story System**:
  - Three story types: text, image, and text+image
  - Story viewer with progress bars
  - Navigation between stories (next/previous)
  - Pause/resume story playback

### 👤 Profile Management
- Profile view with router outlet tabs
- Timeline with user posts
- Friends list and management
- Responsive design for all viewports

### 🛠️ Technical Architecture
- **Centralized Modal Service**:
  - Dynamic modal creation
  - Data passing to modals
  - Clean closing mechanism
- **Router-Based Features**:
  - Nested routes for profile tabs
  - Lazy-loaded feature
  - Clean route organization

### 🎨 UI/UX Features
- Image preview system throughout app
- Responsive layout adapting to all screens
- Clean, modern interface
- Interactive notifications for friend requests

---

## 🏗️ Project Structure
src/
├── app/
│ ├── features/
│ │ ├── auth/ # All authentication components
│ │ ├── layout/ # Main app layout container
│ │ ├── timeline/ # Post and feed functionality
│ │ ├── profile/ # User profile components
│ │ ├── settings/ # User settings
│ ├── shared/ # Shared components, modals and models 
│ ├── core/
│ │ ├── guards/ # Route guards
│ │ ├── interceptors/ # (Not Added Yet)
│ │ └── services/ # Core services
│ └── app.routes.ts # Main application routing


---

## 👥 Friend Management Flow

1. **Receive Request** → Accept/Reject options
2. **Accepted** → Added to friends list
3. **Removal** → Remove from friends
4. **Blocking** → Block user (removes from friends if connected)

---

## 🛠️ Technologies Used

- **Angular** (v17+)
- **TypeScript**
- **RxJS** for state management
- **Local Storage** for data persistence
- **CSS3** (Flexbox, Grid, Animations)
- **Standalone Components** (Angular's modern approach)

---

## 🔧 Setup & Development

1. **Install dependencies**:
   ```bash
   npm install

2. **Run development server**:
   ng serve

3. **Build for production**:
   ng build

📌 Key Implementation Notes
All user data persists in local storage (no backend)

Clean component architecture with separation of concerns

Reusable services for common functionality (modals, storage)

Comprehensive routing with lazy loading

Responsive design that works on all devices

🚀 Future Enhancements
Implement proper backend integration

Add real-time features with WebSockets

Enhance accessibility

Add unit and e2e tests

🙌 Acknowledgments
Built with guidance from ChatGPT and DeepSeek AI assistants for architecture planning and problem solving.

📬 Contact
Connect with me on LinkedIn(https://www.linkedin.com/in/AbdullahGomaa)

