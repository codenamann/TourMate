import { createBrowserRouter } from 'react-router-dom'
import UserLayout from '@/components/layout/UserLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

// User pages
import Home from '@/pages/user/Home'
import Explore from '@/pages/user/Explore'
import DestinationDetail from '@/pages/user/DestinationDetail'
import UserHotels from '@/pages/user/Hotels'
import BudgetPlanner from '@/pages/user/BudgetPlanner'
import Itinerary from '@/pages/user/Itinerary'
import ItineraryDetail from '@/pages/user/ItineraryDetail'
import Profile from '@/pages/user/Profile'
import Chatbot from '@/pages/user/Chatbot'
import Map from '@/pages/user/Map'
import Login from '@/pages/user/Login'
import Register from '@/pages/user/Register'
import TestUI from '@/pages/TestUI'

// Admin pages
import Dashboard from '@/pages/admin/Dashboard'
import Destinations from '@/pages/admin/Destinations'
import AdminHotels from '@/pages/admin/Hotels'
import HotelsNew from '@/pages/admin/HotelsNew'
import HiddenGems from '@/pages/admin/HiddenGems'
import CreateDestination from '@/pages/admin/CreateDestination'
import CreateHiddenGem from '@/pages/admin/CreateHiddenGem'
import Reviews from '@/pages/admin/Reviews'
import MapTools from '@/pages/admin/MapTools'
import AdminLogin from '@/pages/admin/AdminLogin'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'explore',
        element: <Explore />,
      },
      {
        path: 'destination/:id',
        element: <DestinationDetail />,
      },
      {
        path: 'hotels',
        element: <UserHotels />,
      },
      {
        path: 'budget',
        element: <BudgetPlanner />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'itinerary',
        element: (
          <ProtectedRoute>
            <Itinerary />
          </ProtectedRoute>
        ),
      },
      {
        path: 'itinerary/:id',
        element: (
          <ProtectedRoute>
            <ItineraryDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat',
        element: <Chatbot />,
      },
      {
        path: 'map',
        element: <Map />,
      },
      {
        path: 'test-ui',
        element: <TestUI />,
      },
    ],
  },
  {
    path: '/admin',
    children: [
      {
        path: 'login',
        element: <AdminLogin />,
      },
      {
        element: <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'destinations',
            element: <Destinations />,
          },
          {
            path: 'destinations/new',
            element: <CreateDestination />,
          },
          {
            path: 'hotels',
            element: <AdminHotels />,
          },
          {
            path: 'hotels/new',
            element: <HotelsNew />,
          },
          {
            path: 'hidden-gems',
            element: <HiddenGems />,
          },
          {
            path: 'hidden-gems/new',
            element: <CreateHiddenGem />,
          },
          {
            path: 'reviews',
            element: <Reviews />,
          },
          {
            path: 'map-tools',
            element: <MapTools />,
          },
        ],
      },
    ],
  },
])

