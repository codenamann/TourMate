# ⚡ Quick Start Guide

## 🚀 Get Backend Running in 3 Steps

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Create `.env` File

Copy `env.template` to `.env` and update with your MongoDB credentials:

```bash
# Windows
copy env.template .env

# Mac/Linux
cp env.template .env
```

Then edit `.env` and replace:
- `USERNAME` and `PASSWORD` with your MongoDB Atlas credentials
- Or use local MongoDB: `mongodb://localhost:27017/tourmate`

### Step 3: Start Server
```bash
npm run dev
```

✅ Server will start on `http://localhost:5000`
✅ Test it: Visit `http://localhost:5000/api/ping`

## 📝 .env File Template

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/tourmate
JWT_SECRET=supersecret
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🔍 Troubleshooting

**Server won't start?**
- Check MongoDB connection string in `.env`
- Ensure MongoDB is running (if local)
- Check if port 5000 is available

**MongoDB connection error?**
- Verify `MONGO_URI` is correct
- For Atlas: Check network access settings
- For local: Ensure MongoDB service is running

**Frontend can't connect?**
- Verify backend is running on port 5000
- Check `CORS_ORIGIN` matches frontend URL (http://localhost:5173)

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] MongoDB connection string is valid
- [ ] Server starts without errors
- [ ] `/api/ping` returns `{"message":"Backend running"}`
- [ ] Frontend can make API calls

## 🎯 Next Steps

Once backend is running:
1. Start frontend: `cd client && npm run dev`
2. Test API endpoints
3. Seed database with sample data (optional)
4. Implement authentication (Phase 5)

