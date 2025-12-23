// Map Dashboard Component
// Interactive geospatial map for visualizing GNIS data

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface GeoObject {
  id: string;
  name: { primary: string };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: any;
}

interface MapDashboardProps {
  initialCenter?: LatLngExpression;
  initialZoom?: number;
  data?: GeoObject[];
}

export const MapDashboard: React.FC<MapDashboardProps> = ({
  initialCenter = [37.7749, -122.4194], // San Francisco default
  initialZoom = 10,
  data = [],
}) => {
  const [markers, setMarkers] = useState<GeoObject[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<GeoObject | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMarkers(data);
  }, [data]);

  if (!isClient) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div className="map-dashboard">
      <div className="map-header">
        <h2>GNIS Geographic Data Viewer</h2>
        <div className="map-controls">
          <button onClick={() => window.location.reload()}>Refresh</button>
          <select onChange={(e) => console.log('Filter:', e.target.value)}>
            <option value="all">All Features</option>
            <option value="populated_place">Cities</option>
            <option value="natural_feature">Natural Features</option>
            <option value="administrative">Administrative</option>
          </select>
        </div>
      </div>

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.geometry.coordinates[1], marker.geometry.coordinates[0]]}
            eventHandlers={{
              click: () => setSelectedFeature(marker),
            }}
          >
            <Popup>
              <div className="feature-popup">
                <h3>{marker.name.primary}</h3>
                <p><strong>Type:</strong> {marker.properties?.classification?.category}</p>
                <p><strong>Location:</strong> {marker.properties?.location?.state}</p>
                {marker.properties?.demographics?.population && (
                  <p><strong>Population:</strong> {marker.properties.demographics.population.toLocaleString()}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedFeature && (
        <div className="feature-details">
          <h3>Feature Details</h3>
          <button onClick={() => setSelectedFeature(null)}>Close</button>
          <pre>{JSON.stringify(selectedFeature, null, 2)}</pre>
        </div>
      )}

      <style jsx>{`
        .map-dashboard {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #1a1a1a;
          color: white;
        }
        .map-controls {
          display: flex;
          gap: 1rem;
        }
        .map-controls button,
        .map-controls select {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .feature-details {
          position: absolute;
          top: 80px;
          right: 20px;
          width: 400px;
          max-height: 500px;
          overflow-y: auto;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }
        .feature-popup h3 {
          margin: 0 0 0.5rem 0;
        }
        .map-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 600px;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default MapDashboard;
