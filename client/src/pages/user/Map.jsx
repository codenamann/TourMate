import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MapWrapper from '@/components/map/MapWrapper'
import { Marker, Popup } from 'react-leaflet'
import { getDestinations } from '@/api/destinations'
import { getHotels } from '@/api/hotels'
import { Badge } from '@/components/ui/badge'
import { destinationIcon, hotelIcon, hiddenGemIcon, userLocationIcon } from '@/lib/mapIcons'
import '@/lib/leaflet'

const Map = () => {
  const [searchParams] = useSearchParams()
  const [destinations, setDestinations] = useState([])
  const [hotels, setHotels] = useState([])
  const [hiddenGems, setHiddenGems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDestinations, setShowDestinations] = useState(true)
  const [showHotels, setShowHotels] = useState(true)
  const [showHiddenGems, setShowHiddenGems] = useState(true)
  const [showUserLocation, setShowUserLocation] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]) // Default: India
  const [mapZoom, setMapZoom] = useState(5)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter([latitude, longitude])
          setMapZoom(10) // Zoom in closer when showing user location
        },
        (error) => {
          console.log('Geolocation error:', error)
          // Fallback to default India center (already set)
        }
      )
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [destRes, hotelsRes, gemsRes] = await Promise.all([
          getDestinations({ category: 'destination' }),
          getHotels(),
          getDestinations({ category: 'hidden_gem' })
        ])
        setDestinations(destRes.data)
        setHotels(hotelsRes.data)
        setHiddenGems(gemsRes.data)
      } catch (error) {
        console.error('Error fetching map data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter by destination ID if provided in URL
  const destinationId = searchParams.get('destination')
  const filteredDestinations = destinationId
    ? destinations.filter(d => d._id === destinationId)
    : destinations

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Interactive Map</h1>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDestinations}
              onChange={(e) => setShowDestinations(e.target.checked)}
            />
            <span className="text-sm">Destinations</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showHotels}
              onChange={(e) => setShowHotels(e.target.checked)}
            />
            <span className="text-sm">Hotels</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showHiddenGems}
              onChange={(e) => setShowHiddenGems(e.target.checked)}
            />
            <span className="text-sm">Hidden Gems</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUserLocation}
              onChange={(e) => setShowUserLocation(e.target.checked)}
            />
            <span className="text-sm">My Location</span>
          </label>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading map data...</div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-border">
          <MapWrapper height="600px" center={mapCenter} zoom={mapZoom}>
            {/* User location marker */}
            {userLocation && showUserLocation && (
              <Marker 
                position={[userLocation.lat, userLocation.lng]}
                icon={userLocationIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold mb-1">You are here</h3>
                    <p className="text-xs text-muted-foreground">
                      {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            {showDestinations && filteredDestinations.map((dest) => (
              dest.coordinates && (
                <Marker
                  key={dest._id}
                  position={[dest.coordinates.lat, dest.coordinates.lng]}
                  icon={destinationIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold mb-1">{dest.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {dest.cityId?.name || 'Unknown location'}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Destination
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
            {showHotels && hotels.map((hotel) => (
              hotel.coordinates && (
                <Marker
                  key={hotel._id}
                  position={[hotel.coordinates.lat, hotel.coordinates.lng]}
                  icon={hotelIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold mb-1">{hotel.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {hotel.cityId?.name || 'Unknown location'}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        Hotel
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
            {showHiddenGems && hiddenGems.map((gem) => (
              gem.coordinates && (
                <Marker
                  key={gem._id}
                  position={[gem.coordinates.lat, gem.coordinates.lng]}
                  icon={hiddenGemIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold mb-1">{gem.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {gem.cityId?.name || 'Unknown location'}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Hidden Gem
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapWrapper>
        </div>
      )}
    </div>
  )
}

export default Map

