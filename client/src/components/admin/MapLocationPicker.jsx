import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import '@/lib/leaflet'
import "@/styles/leaflet-dialog-fix.css"

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onLocationSelect({ lat, lng })
    }
  })
  return null
}

// Component to fix Leaflet resize bug
const ResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
};

const MapLocationPicker = ({ 
  initialCenter = [20.5937, 78.9629], 
  value = null, 
  onChange 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(value)

  useEffect(() => {
    if (value) {
      setSelectedLocation(value)
    }
  }, [value])

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    if (onChange) {
      onChange(location)
    }
  }

  const mapCenter = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng] 
    : initialCenter

  return (
    <div className="relative z-0 w-full h-[400px] rounded-md overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={selectedLocation ? 12 : 5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <ResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          </Marker>
        )}
      </MapContainer>
      {selectedLocation && (
        <div className="mt-2 p-2 bg-muted rounded text-sm">
          <p className="text-muted-foreground">
            <strong>Lat:</strong> {selectedLocation.lat.toFixed(4)},{" "}
            <strong>Lng:</strong> {selectedLocation.lng.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click on the map to change location
          </p>
        </div>
      )}
    </div>
  )
}

export default MapLocationPicker

