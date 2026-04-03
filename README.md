# Project Management System (MERN + RBAC) (Note: The project is still developed by me (Pratham Patel))

A scalable **Project Management System** built using the **MERN Stack** with **Role-Based Access Control (RBAC)**, **Redux Toolkit**, and **permission-based UI rendering**.

This system enables teams to manage **projects, tasks, members, roles, and permissions** securely and efficiently.

---
# Features

## 1. Authentication & Authorization
  * JWT-based authentication
  * Secure login/logout
  * Role-Based Access Control (RBAC)
  * Permission-based UI rendering
  * Role hierarchy system

  Supported Roles:
    * Owner
    * Admin
    * Project Manager
    * Member
    * Guest

---
## 2. Workspace Member Management
  * Invite members to workspace
  * Update member roles
  * Remove members
  * Role-based permission restrictions
  * Role hierarchy enforcement
  * Prevent self-removal
  * Controlled role assignment

---
## 3. Project Management
  * Create projects
  * Update project details
  * Assign members to projects
  * Track project status
  * Manage project lifecycle

---
## 4. Task Management
  * Create tasks
  * Assign tasks
  * Update task status
  * Add task comments
  * Permission-controlled task updates

---
## 5. Permission-Based UI
  UI components automatically adapt based on:
    * User role
    * Permissions
    * Role hierarchy
  Examples:
    * Invite Members button only for authorized roles
    * Role dropdown visible only for higher roles
    * Remove member option restricted
    
---
# Tech Stack

## Frontend
  * React.js
  * Redux Toolkit
  * React Hooks
  * Tailwind CSS
  * Material UI Icons
  * Axios
  * Day.js

## Backend
  * Node.js
  * Express.js
  * MongoDB
  * Mongoose
  * JWT Authentication
  * RBAC Middleware

## Dev Tools
  * Redux DevTools
  * Postman
  * Jest (for further testing)
  * ESLint
  * Prettier

---
# Installation

## Clone Repository

```bash
  git clone https://github.com/your-username/project-management-system.git
```

---
## Install Dependencies

### Backend

```bash
cd Backend
npm install
```

### Frontend

```bash
cd Frontend
npm install
```

---
## Setup Environment Variables

Create `.env` inside Backend:

```
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/Project-Management
RESEND_API_KEY=your_resend_api_key
SECRET_KEY_ACCESS_TOKEN=access_token_secret_key
SECRET_KEY_REFRESH_TOKEN=refresh_token_secret_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\firebase_private_key"
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
```

Create `.env` inside Frontend:

```
VITE_API_BASE_URL="http://localhost:5000"
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_firebe_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_firebase_meaurement_id"
```

---
## Run Development Server

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---
# UI Features

  * Search team members
  * Role-based dropdowns
  * Invite modal
  * Project statistics cards
  * Permission-based rendering
  * Dynamic member actions

---
# Security Features

  * JWT Authentication
  * Role-Based Access Control
  * Permission validation
  * Protected routes
  * Backend authorization middleware

---
# Future Improvements

  * Notifications system
  * Activity logs
  * Audit history
  * File uploads
  * Real-time updates (Socket.io)
  * Redis caching
  * Advanced analytics dashboard

---
# Screenshots (Optional)

Add:

dashboard-page
<img width="1920" height="1103" alt="screencapture-localhost-5173-dashboard-2026-04-03-13_10_17" src="https://github.com/user-attachments/assets/b921cd0b-21db-4780-824e-e52c915112d7" />

projects-page
<img width="1920" height="912" alt="screencapture-localhost-5173-projects-2026-04-03-13_09_17" src="https://github.com/user-attachments/assets/bb5b8f43-807e-4540-8d83-6e6440877c70" />

team-page
<img width="1920" height="912" alt="screencapture-localhost-5173-team-2026-04-03-13_12_52" src="https://github.com/user-attachments/assets/fb4d8df8-17d9-4bcb-a111-552b7ef22e8e" />

---
# 👨‍💻 Author

**Pratham Patel**

Project Management System built using MERN Stack with RBAC.
