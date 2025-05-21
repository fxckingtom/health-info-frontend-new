// MapComponent.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修正 marker 圖示在 React 中失效的問題
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState([23.973875, 120.982024]); // 台灣中心
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCurrentPosition([lat, lon]);

          // ✅ 查詢醫院 + 診所（移除 bias 參數）
          const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
          const radius = 5000;
          const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital,healthcare.clinic&filter=circle:${lon},${lat},${radius}&limit=30&apiKey=${apiKey}`;

          try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.features) {
              console.error('API 回傳錯誤，內容如下:', data);
              return;
            }

            const results = data.features.map((place) => ({
              name: place.properties.name || '無名稱機構',
              type: place.properties.categories?.[0] || '未知類型',
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

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>📍 附近醫療機構地圖</h2>

      <MapContainer center={currentPosition} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* 使用者位置 */}
        <Marker position={currentPosition}>
          <Popup>你的位置</Popup>
        </Marker>

        {/* 顯示醫院與診所 */}
        {places.map((place, index) => (
          <Marker key={index} position={place.position}>
            <Popup>
              {place.name}<br />
              類型：{place.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
