# TourMate Setup Guide

## Quick Start

### 1. Clone and Install

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Configure Backend

Create `server/.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/tourmate
JWT_SECRET=supersecret
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Replace `USERNAME` and `PASSWORD` with your MongoDB Atlas credentials, or use a local MongoDB connection string.

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Verify Setup

- Backend: Visit `http://localhost:5000/api/ping` - should return `{"message":"Backend running"}`
- Frontend: Visit `http://localhost:5173` - should show TourMate homepage

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Replace in `.env` file

### Local MongoDB

1. Install MongoDB locally
2. Use connection string: `mongodb://localhost:27017/tourmate`
3. Update `.env` file

## Testing API Endpoints

### Using curl:

```bash
# Test backend
curl http://localhost:5000/api/ping

# Get destinations
curl http://localhost:5000/api/destinations

# Get cities
curl http://localhost:5000/api/cities
```

### Using Browser:

Visit `http://localhost:5000/api/ping` in your browser.

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB is running (if local)
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS_ORIGIN in server `.env` matches frontend URL
- Check browser console for errors

### Database connection errors
- Verify MongoDB URI is correct
- Check network access (for Atlas)
- Ensure database user has proper permissions

## Next Steps

1. Seed database with sample data
2. Test all API endpoints
3. Implement authentication
4. Add file upload functionality

