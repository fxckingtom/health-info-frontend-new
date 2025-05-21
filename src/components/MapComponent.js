// MapComponent.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🔧 修正 marker 圖示無法顯示的問題
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  const defaultPosition = [23.973875, 120.982024]; // 預設台灣中心
  const [currentPosition, setCurrentPosition] = useState(defaultPosition);
  const [hospitals, setHospitals] = useState([]);

  // 🔍 搜尋附近醫院（可重複使用）
  const searchNearbyHospitals = async (lat, lon) => {
    const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
    const radius = 5000;
    const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const results = data.features.map((place) => ({
        name: place.properties.name || '無名稱醫院',
        position: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
      }));
      setHospitals(results);
    } catch (err) {
      console.error('搜尋醫院失敗:', err);
    }
  };

  // 🌍 嘗試取得使用者位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCurrentPosition([lat, lon]);
          searchNearbyHospitals(lat, lon);
        },
        (err) => {
          console.warn('定位失敗，使用預設位置:', err.message);
          setCurrentPosition(defaultPosition);
          searchNearbyHospitals(defaultPosition[0], defaultPosition[1]);
        }
      );
    } else {
      console.warn('瀏覽器不支援定位，使用預設位置');
      searchNearbyHospitals(defaultPosition[0], defaultPosition[1]);
    }
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>📍 附近醫院地圖</h2>

      <MapContainer center={currentPosition} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* 使用者位置 */}
        <Marker position={currentPosition}>
          <Popup>你的位置</Popup>
        </Marker>

        {/* 顯示醫院標記 */}
        {hospitals.map((h, i) => (
          <Marker key={i} position={h.position}>
            <Popup>{h.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
