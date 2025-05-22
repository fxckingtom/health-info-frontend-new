import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../MapComponent.css';

// 藍色圖標（使用你修正後的正確 URL）
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 紅色圖標
const redIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 地圖中心點更新元件
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState([23.973875, 120.982024]);
  const [places, setPlaces] = useState([]);
  const [mapVisible, setMapVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCurrentPosition([lat, lon]);

        const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

        // 取得使用者中文地址並移除郵遞區號
        const geocodeUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=zh&apiKey=${apiKey}`;
        const geocodeRes = await fetch(geocodeUrl);
        const geocodeData = await geocodeRes.json();
        const rawFormatted = geocodeData?.features?.[0]?.properties?.formatted || '無法取得中文地址';
        const addressWithoutZip = rawFormatted.replace(/\b\d{5}\b/, '').trim().replace(/,\s*,/g, ',').replace(/^,|,$/g, '');
        setCurrentAddress(addressWithoutZip);

        // 取得醫療機構列表（含中文地址、無郵遞區號）
        const radius = 5000;
        const placesUrl = `https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:${lon},${lat},${radius}&limit=100&lang=zh&apiKey=${apiKey}`;
        const res = await fetch(placesUrl);
        const data = await res.json();

        if (!data.features) {
          console.error('API 回傳錯誤:', data);
          return;
        }

        const results = data.features.map((place) => {
          const fullAddress = place.properties.formatted || '';
          const cleanAddress = fullAddress.replace(/\b\d{5}\b/, '').trim().replace(/,\s*,/g, ',').replace(/^,|,$/g, '');

          return {
            name: place.properties.name || '無名稱機構',
            address: cleanAddress,
            position: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
          };
        });

        setPlaces(results);
      },
      (err) => {
        console.error('定位失敗:', err.message);
      }
    );
  }, []);

  const filteredPlaces = places
    .filter((p) => p.name.includes(searchTerm))
    .slice(0, 100);

  return (
    <div className="map-wrapper">
      <h2 className="map-title">📍 附近醫療機構</h2>

      <input
        className="search-bar"
        type="text"
        placeholder="搜尋醫療機構名稱..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="current-location">
        <strong>你的位置：</strong> {currentAddress}
      </div>

      <div className="place-list">
        {filteredPlaces.map((place, index) => (
          <div key={index} className="place-card">
            <strong>{place.name}</strong><br />
            📍 {place.address}
          </div>
        ))}
      </div>

      <button className="toggle-map-btn" onClick={() => setMapVisible(!mapVisible)}>
        {mapVisible ? '🔽 收起地圖' : '🗺️ 展開地圖'}
      </button>

      {mapVisible && (
        <div className="map-container">
          <MapContainer center={currentPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <MapUpdater center={currentPosition} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            <Marker position={currentPosition} icon={blueIcon}>
              <Popup>你的位置</Popup>
            </Marker>
            {places.map((place, index) => (
              <Marker key={index} position={place.position} icon={redIcon}>
                <Popup>
                  {place.name}<br />
                  {place.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
