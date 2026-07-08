# Attendance Management System

A full-stack attendance management system built with Django (backend) and React (frontend) with Tailwind CSS. Now works as a standalone frontend with localStorage persistence!

## Features

- **Authentication**: Login and Signup pages with beautiful UI
- **Dashboard**: View total students, present/absent counts, and attendance percentage
- **Student Management**: Add, view, edit, and delete student records
- **Attendance Tracking**: Mark daily attendance (Present, Absent, Late)
- **Reports**: Generate attendance reports by date
- **Search**: Search students by name, roll number, or department
- **Settings**: System configuration and information
- **Backup**: Export and import attendance data as JSON

## Recent Updates

✅ **Fixed Hosting Issues**: The app now works standalone without a Django backend
✅ **HashRouter**: Changed from BrowserRouter to HashRouter for static file hosting
✅ **LocalStorage**: All data is now persisted in browser localStorage
✅ **Sample Data**: Comes with sample students and attendance records
✅ **No Backend Required**: The frontend works completely standalone

## Tech Stack

### Backend (Optional - for development)
- Django 5.0.2
- Django REST Framework
- SQLite database
- CORS support

### Frontend (Standalone)
- React 18
- Vite
- Tailwind CSS
- React Router (HashRouter)
- LocalStorage for data persistence

## Project Structure

```
├── backend/
│   ├── attendance_system/    # Django project settings
│   ├── api/                  # API app (models, views, serializers)
│   ├── manage.py
│   └── requirements.txt
├── src/                      # React frontend
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Setup Instructions

### Frontend Only (Recommended for Hosting)

The frontend now works completely standalone with localStorage. No backend required!

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

The production build in `dist/` can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

**Demo Credentials:**
- Email: admin@campus.edu
- Password: admin123

### Backend Setup (Optional - for development)

If you want to use the Django backend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

**Note:** The current frontend uses localStorage and does not connect to the backend. To enable backend connectivity, update the `api` object in `src/App.jsx` to make HTTP requests to the Django endpoints.

## API Endpoints

- `GET /api/students/` - List all students
- `POST /api/students/` - Create a student
- `PUT /api/students/{id}/` - Update a student
- `DELETE /api/students/{id}/` - Delete a student
- `GET /api/students/search/?q={query}` - Search students
- `GET /api/attendance/` - List all attendance records
- `POST /api/attendance/` - Create attendance record
- `PUT /api/attendance/{id}/` - Update attendance record
- `GET /api/attendance/by_date/?date={date}` - Get attendance by date
- `GET /api/attendance/dashboard/` - Get dashboard statistics
- `GET /api/attendance/report/?date={date}` - Get attendance report

## Design

The UI follows the design from the project image with:
- Dark teal/green sidebar navigation
- Yellow/amber accent colors
- Clean card-based layout
- Status badges for attendance (Present, Absent, Late)
- Responsive design
