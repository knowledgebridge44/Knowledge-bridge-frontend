# Quick Start Guide - Knowledge Bridge Frontend

Get up and running with the Knowledge Bridge React frontend in minutes!

## 🚀 Prerequisites

- Node.js 18+
- Laravel backend running on `http://localhost:8000`

## ⚡ Quick Setup (3 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173
```

That's it! The frontend is now running with hot reload.

## 📱 Try It Out

### Register an Account

1. Click **"Register"** on the landing page
2. Fill in your details
3. Choose role (Student or Teacher)
4. Click **"Create Account"**

### Login

1. Click **"Login"**
2. Enter your credentials
3. You'll be redirected to the dashboard

### Explore

- **Dashboard**: Overview of your learning activity
- **Courses**: Browse available courses (coming soon)
- **Q&A**: Ask and answer questions (coming soon)
- **Profile**: View your badges and progress (coming soon)

## 🎨 Features

### ✅ Currently Working

- User registration and authentication
- Login/logout with secure session cookies
- Light/dark theme toggle
- Responsive navigation
- Dashboard view
- Toast notifications

### 🚧 Coming Soon

- Course browsing and enrollment
- Lesson viewing with materials
- Q&A forum
- Ratings and comments
- Admin panel
- Analytics

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run typecheck

# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

## 🐛 Troubleshooting

### Can't connect to backend?

Make sure Laravel is running:
```bash
cd ../backend_laravel
php artisan serve
```

### CORS errors?

Check `backend_laravel/config/cors.php` allows `http://localhost:5173`

### Login not working?

1. Clear browser cookies
2. Restart both servers
3. Check browser console for errors

## 📚 Learn More

- See [README.md](./README.md) for full documentation
- See [SETUP_GUIDE.md](../SETUP_GUIDE.md) for detailed setup
- See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for feature status

## 💡 Tips

- **Dark Mode**: Toggle with the moon/sun icon in the navbar
- **Hot Reload**: Changes to code automatically update in browser
- **Console**: Open browser DevTools (F12) to see API calls and errors
- **React Query DevTools**: Click the flower icon (bottom-left) to inspect queries

## 🎯 Next Steps

Want to contribute? Check out the implementation status to see what needs to be built next!

Priority features:
1. Courses list and detail pages
2. Lesson viewing
3. Q&A system
4. Teacher lesson upload
5. Admin approval workflow

---

Happy coding! 🎉

