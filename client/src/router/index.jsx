import { createBrowserRouter } from 'react-router-dom'
import UserLayout from '@/components/layout/UserLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// User pages
import Home from '@/pages/user/Home'
import Explore from '@/pages/user/Explore'
import DestinationDetail from '@/pages/user/DestinationDetail'
import UserHotels from '@/pages/user/Hotels'
import BudgetPlanner from '@/pages/user/BudgetPlanner'
import Itinerary from '@/pages/user/Itinerary'
import Profile from '@/pages/user/Profile'
import Chatbot from '@/pages/user/Chatbot'
import Map from '@/pages/user/Map'
import TestUI from '@/pages/TestUI'

// Admin pages
import Dashboard from '@/pages/admin/Dashboard'
import Destinations from '@/pages/admin/Destinations'
import AdminHotels from '@/pages/admin/Hotels'
import HotelsNew from '@/pages/admin/HotelsNew'
import HiddenGems from '@/pages/admin/HiddenGems'
import Reviews from '@/pages/admin/Reviews'
import MapTools from '@/pages/admin/MapTools'

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
        path: 'itinerary',
        element: <Itinerary />,
      },
      {
        path: 'profile',
        element: <Profile />,
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
    element: <AdminLayout />,
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
        path: 'reviews',
        element: <Reviews />,
      },
      {
        path: 'map-tools',
        element: <MapTools />,
      },
    ],
  },
])

