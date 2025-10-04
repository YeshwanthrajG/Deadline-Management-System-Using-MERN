### Deadline Management System using MERN

Clockyn - A feature rich, full stack deadline management application. Built with React.js, Node.js, Express.js, and MongoDB, this project helps users plan, categorize, and track all their tasks, including recurring and custom deadlines via a responsive, and interactive dashboard. The application features a beautiful glassmorphism UI design and allows users to manage their daily tasks efficiently with user authentication, task CRUD operations, and real-time updates.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- 🔐 **JWT Authentication:** Secure registration & login, session persistence
- ✨ **Glassmorphism UI:** Modern, responsive interface with Tailwind CSS
- 🏷️ **Priority-based Sorting:** Sort and filter tasks by priority (High, Medium, Low)
- 📅 **One-time, Daily & Custom Tasks:** Support for fixed, recurring, and custom repeat intervals for tasks
- 🔄 **Recurrence Options:** Add daily habits, weekly routines, or custom recurring deadlines
- 📅 **Interactive Dashboard:** Visual stats, real-time progress, and analytics via dynamic dashboard
- 🧩 **Task Filtering:** Advanced filters by status, date, priority, and category
- ⏰ **Due Date Reminders:** See tasks due soon, overdue, and upcoming
- 📋 **Task Categories & Status:** Classify tasks as pending, in-progress, completed, or missed
- 📊 **Statistics Widget:** Visual breakdown of progress (total, completed, pending, in-progress, missed, priority (high, medium, low), completion rate)
- 📝 **Rich Task Descriptions & Attachments:** Add meeting links, descriptions, and even task related images
- ☑️ **CRUD Task Management:** Create, Read, Update/Edit, and Delete tasks in real-time
- 🎨 **Mobile-friendly:** Responsive UI/UX layouts for seamless use across devices
- 🔒 **Protected Routes:** Only authenticated users can manipulate and view their tasks

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing (secure auth)
- **express-validator** - Input validation middleware

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **React Router** - Client-side routing (SPA navigation)
- **React Context API** - State management
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful hand-crafted SVG icons

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** or **yarn** package manager (v6.x or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YeshwanthrajG/Deadline-Management-System-Using-MERN.git
cd Deadline-Management-System-Using-MERN
```

### 2. Backend Setup

- npm installation

```bash
cd backend
npm install
```

- Create `.env` in `backend/`:

```bash
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

- Run the backend

```bash
npm run dev
```


### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start

/* Frontend runs on [http://localhost:3000](http://localhost:3000), backend on [http://localhost:5000](http://localhost:5000). */
```

## Running the Application

1. **Start MongoDB:** (or use Atlas Cloud)
2. **Start Backend:** See [Backend](#2-backend-setup)
3. **Start Frontend:** See [Frontend](#3-frontend-setup)

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login & get JWT
- `GET /api/auth/profile` — Get authenticated user's profile

### Tasks
- `GET /api/tasks` — All tasks for current user, with sort/filter params
- `POST /api/tasks` — Add a task (`title`, `description`, `priority`, `status`, `dueDate`, `repeat`)
- `GET /api/tasks/:id` — Details of a single task
- `PUT /api/tasks/:id` — Update a task (supports editing status, recurrence, etc.)
- `DELETE /api/tasks/:id` — Delete a task

## Project Structure

See the [project-structure.txt](project-structure.txt) file for details.

## Usage

1. **Register/Login:** Sign up and log in to your private dashboard.
2. **Create Tasks:** Add one-time, daily, or custom-repeating tasks; specify due date, priority, details, attachments or links.
3. **Sort & Filter:** Use the filter bar to narrow tasks by status or priority. Sort by deadline date, priority, or custom order.
4. **Edit/Complete:** Mark tasks as in-progress, completed, missed, or edit their details at any time.
5. **Dashboard Stats:** Visual widgets show total, completed, in-progress, missed, and high-priority tasks, with a completion percentage bar.
6. **Recurrence:** Set tasks as daily, weekly, or with custom repeat intervals (e.g. every N days or on select weekdays).
7. **Attachments:** Optionally add meeting/video call links or upload supporting documents.
8. **Responsive UI:** Enjoy the full functionality on any device, desktop, tablet, or mobile.

## Screenshots

See the [SCREENSHOTS](screenshots.md) file for details.

## Contributing

📢 Open to All Contributors

1. Fork and clone this repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push to your fork (`git push origin feature/my-feature`)
5. Open a pull request

## License

MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Yeshwanthraj G**  
[GitHub: @YeshwanthrajG](https://github.com/YeshwanthrajG)

---

> ⭐ Star this repo if you found it helpful!

---