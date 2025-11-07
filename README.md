# 🎯 Visitor Management System (VMS)

A comprehensive, production-ready visitor management system built with modern technologies and best practices.

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **TypeScript** - Type safety
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication with access & refresh tokens
- **bcryptjs** - Password hashing (automatic via Mongoose middleware)
- **Zod** - Schema validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management (replaced Zustand as requested)
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## ✨ Features

### Authentication & Authorization
- ✅ Secure JWT-based authentication
- ✅ Access token & refresh token system
- ✅ Automatic token refresh on expiry
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Role-based access control (Admin, Employee, Receptionist)

### Visitor Management
- ✅ Create, read, update visitors
- ✅ Auto-generated unique pass numbers
- ✅ Check-in/Check-out workflow
- ✅ Visitor approval system
- ✅ Status tracking (Scheduled → Checked In → Checked Out → Cancelled)
- ✅ Search, filter, sort, pagination

### Dashboard
- ✅ Real-time statistics
- ✅ Currently active visitors
- ✅ Today's visitor count
- ✅ Quick actions
- ✅ Activity insights

### Additional Features
- ✅ Audit logging for all actions
- ✅ In-app notifications
- ✅ Responsive design
- ✅ Error handling & validation
- ✅ Loading states
- ✅ Toast notifications

## 📁 Project Structure

```
visitor-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.config.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── visitor.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── notification.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── models/
│   │   │   ├── user.model.ts (password auto-hashing)
│   │   │   ├── visitor.model.ts
│   │   │   ├── audit-log.model.ts
│   │   │   └── notification.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── visitor.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── notification.routes.ts
│   │   ├── services/
│   │   │   ├── audit.service.ts
│   │   │   └── notification.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts
│   │   │   └── error.utils.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── protected-route.component.tsx
│   │   │   └── layout/
│   │   │       ├── layout.component.tsx
│   │   │       ├── navbar.component.tsx
│   │   │       └── sidebar.component.tsx
│   │   ├── lib/
│   │   │   └── api.client.ts (with auto-refresh)
│   │   ├── pages/
│   │   │   ├── login.page.tsx
│   │   │   ├── dashboard.page.tsx
│   │   │   └── visitors.page.tsx
│   │   ├── store/
│   │   │   ├── index.ts (Redux store)
│   │   │   └── slices/
│   │   │       ├── auth.slice.ts
│   │   │       ├── visitor.slice.ts
│   │   │       ├── dashboard.slice.ts
│   │   │       └── notification.slice.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/visitor_management

# JWT Secrets (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start MongoDB** (if local)
```bash
mongod
```

5. **Run development server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Authentication

### Password Hashing
**Passwords are automatically hashed** when users are created or updated. The `user.model.ts` has a `pre('save')` hook:

```typescript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); // 12 rounds
  next();
});
```

**You never store plain text passwords!** ✅

### JWT Flow
1. User logs in → receives `accessToken` (7 days) and `refreshToken` (30 days)
2. `accessToken` is sent with every API request
3. When `accessToken` expires → frontend automatically uses `refreshToken` to get new tokens
4. If `refreshToken` expires → user must login again

## 👥 User Roles & Permissions

### Admin
- Full system access
- Manage users
- View all visitors
- Check-in/Check-out
- Generate reports

### Employee
- Schedule visitors
- Approve visitor requests
- View own scheduled visitors
- Dashboard access

### Receptionist
- Register visitors
- Check-in/Check-out visitors
- View visitor list
- Dashboard access

## 🎨 UI Features (Based on Reference Design)

- ✅ Modern gradient backgrounds
- ✅ Card-based layouts
- ✅ Color-coded status badges with dots
- ✅ Smooth transitions and hover effects
- ✅ Responsive tables with actions
- ✅ Real-time statistics cards with trends
- ✅ Professional navigation
- ✅ Toast notifications
- ✅ Loading states

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Visitors
- `GET /api/visitors` - Get all visitors (with filters)
- `POST /api/visitors` - Create visitor
- `GET /api/visitors/:id` - Get visitor by ID
- `PATCH /api/visitors/:id` - Update visitor
- `POST /api/visitors/:id/check-in` - Check in visitor
- `POST /api/visitors/:id/check-out` - Check out visitor
- `POST /api/visitors/:id/approve` - Approve visitor
- `POST /api/visitors/:id/cancel` - Cancel visitor

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/current-visitors` - Get currently active visitors

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/search/employees` - Search employees (for typeahead)

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read

## 🧪 Testing

### Create Test Users via MongoDB

```javascript
// In MongoDB shell or Compass
use visitor_management;

// Admin user
db.users.insertOne({
  email: "admin@vms.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewv8/KWvqxJLGkv6", // password123
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Receptionist user
db.users.insertOne({
  email: "receptionist@vms.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewv8/KWvqxJLGkv6", // password123
  firstName: "Reception",
  lastName: "Desk",
  role: "receptionist",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Test Login
- Email: `admin@vms.com`
- Password: `password123`

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT secrets (use `openssl rand -base64 32`)
3. Enable HTTPS
4. Set up MongoDB Atlas or production database
5. Configure proper CORS origins
6. Set up PM2 or Docker for process management

### Frontend
1. Build: `npm run build`
2. Deploy `dist` folder to:
   - Vercel (recommended)
   - Netlify
   - AWS S3 + CloudFront
   - Your own server with Nginx

## 📝 Code Standards (2025)

✅ **Functional programming** - No classes except for errors
✅ **`entity.type.ts` naming** - Modern file naming
✅ **TypeScript strict mode** - Maximum type safety
✅ **Async/await** - No callbacks
✅ **Redux Toolkit** - Modern Redux with slices
✅ **Axios interceptors** - Auto token refresh
✅ **Error boundaries** - Graceful error handling
✅ **Tailwind CSS v4** - Utility-first styling
✅ **Vite** - Fast build tool

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 💡 Key Takeaways

1. **Passwords are NEVER stored in plain text** - automatic hashing via Mongoose hooks
2. **JWT tokens expire and auto-refresh** - seamless user experience
3. **Redux Toolkit for state management** - as requested, no Zustand
4. **Latest standards** - functional programming, modern naming conventions
5. **Production-ready** - error handling, validation, security headers
6. **Beautiful UI** - based on your reference image

---

**Built with ❤️ using latest 2025 standards**