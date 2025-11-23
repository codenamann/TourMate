# TourMate Server

Backend server for TourMate application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

3. Run the server:
```bash
npm run dev
```

## API Endpoints

### User Endpoints
- `GET /api/cities` - Get all cities
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/reviews` - Create review
- `POST /api/safety-reviews` - Create safety review
- `POST /api/budget/plan` - Plan budget

### Admin Endpoints
- `GET /admin/api/destinations` - Get all destinations
- `POST /admin/api/destinations` - Create destination
- `PUT /admin/api/destinations/:id` - Update destination
- `DELETE /admin/api/destinations/:id` - Delete destination
- `GET /admin/api/hotels` - Get all hotels
- `POST /admin/api/hotels` - Create hotel
- `PUT /admin/api/hotels/:id` - Update hotel
- `DELETE /admin/api/hotels/:id` - Delete hotel
- `GET /admin/api/hidden-gems` - Get hidden gems
- `POST /admin/api/map/create` - Create item via map

## Structure

```
server/
  config/        # Database configuration
  controllers/   # Request handlers
  models/        # MongoDB schemas
  routes/        # API routes
  middleware/    # Custom middleware
  app.js         # Express app setup
  server.js      # Server entry point
```
