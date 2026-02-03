# GravityBoard - Advanced Task Management System

GravityBoard is a modern, physics-inspired task management application designed to help you prioritize and execute tasks based on their "Gravity" (importance, urgency, and effort). It features a sleek, dark-themed UI, Kanban-style organization, and focus tools.

## 🚀 Features

*   **Gravity Scoring:** Tasks are weighted by urgency, effort, and priority to calculate a "Gravity Score", helping you focus on what matters.
*   **Kanban Workflow:** Visualize your tasks in columns (Inbox, Planning, In Progress, etc.) for efficient tracking.
*   **Focus Mode:** Enter a dedicated session for a specific task to eliminate distractions.
*   **Smart Notifications:**
    *   **Deadline Alerts:** Get notified 1 hour and 10 minutes before a task is due.
    *   **Notification Center:** A built-in inbox to review past alerts and mark them as read.
*   **Section Management:** Organize tasks into custom sections/projects.
*   **Responsive Design:** Fully optimized for desktop and mobile devices.
*   **Secure Authentication:** User registration and login with JWT protection.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide Icons
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Mongoose)
*   **State Management:** React Context API

## 📦 Installation & Setup

### Prerequisites
*   Node.js installed
*   MongoDB running locally or a MongoDB Atlas URI

### 1. clone the Repository
```bash
git clone <repository_url>
cd GravityBoard
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 🧠 Core Concepts

*   **Gravity:** A calculated metric derived from a task's Priority, Urgency, and Energy Level. High gravity tasks pull your attention first.
*   **Vectors:** Custom project sectors or areas of life (e.g., Work, Personal, Health).
*   **Energy Level:** Define how much mental/physical energy a task requires (Low, Medium, High).

## 📄 License
This project is open-source and available under the MIT License.
