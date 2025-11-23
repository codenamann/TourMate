import MapWrapper from '@/components/map/MapWrapper'

const Map = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Interactive Map</h1>
      <div className="rounded-lg overflow-hidden border border-border">
        <MapWrapper height="600px" />
      </div>
    </div>
  )
}

export default Map

