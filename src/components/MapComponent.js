// components/MapComponent.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../MapComponent.css'; 

// 地圖自動更新位置元件
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

// 自訂圖示
const blueIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState([23.973875, 120.982024]);
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCurrentPosition([lat, lon]);

          const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
          const radius = 5000;
          const url = `https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:${lon},${lat},5000&limit=100&lang=zh&apiKey=${apiKey}`;

          try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.features) {
              console.error('API 回傳錯誤，內容如下:', data);
              return;
            }

            const results = data.features.map((place) => ({
              name: place.properties.name || '無名稱機構',
              address: place.properties.formatted || '無地址',
              position: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
            }));

            setPlaces(results);
          } catch (err) {
            console.error('搜尋失敗:', err);
          }
        },
        (err) => {
          console.error('定位失敗，使用預設位置:', err.message);
        }
      );
    }
  }, []);

  const filteredPlaces = places
    .filter((place) => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="map-page">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>📍 附近醫療機構查詢</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="搜尋醫療機構名稱"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="place-list">
        {filteredPlaces.map((place, index) => (
          <div key={index} className="place-card">
            <h4>{place.name}</h4>
            <p>{place.address}</p>
          </div>
        ))}
      </div>

      <button className="map-toggle-button" onClick={() => setShowMap(!showMap)}>
        {showMap ? '關閉地圖' : '開啟地圖'}
      </button>

      {showMap && (
        <div className="mini-map">
          <MapContainer center={currentPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <MapUpdater center={currentPosition} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={currentPosition} icon={blueIcon}>
              <Popup>你的位置</Popup>
            </Marker>
            {places.map((place, index) => (
              <Marker key={index} position={place.position} icon={redIcon}>
                <Popup>{place.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
