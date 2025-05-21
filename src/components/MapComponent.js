// MapComponent.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修正 marker 圖示在 React 中失效的問題
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// 類別翻譯對照表（✅移到元件外層，宣告一次即可）
const categoryTranslations = {
  "healthcare": "醫療機構",
  "healthcare.clinic_or_praxis": "診所",
  "healthcare.clinic_or_praxis.allergology": "過敏科診所",
  "healthcare.clinic_or_praxis.vascular_surgery": "血管外科診所",
  "healthcare.clinic_or_praxis.urology": "泌尿科診所",
  "healthcare.clinic_or_praxis.trauma": "創傷醫學診所",
  "healthcare.clinic_or_praxis.rheumatology": "風濕免疫科診所",
  "healthcare.clinic_or_praxis.radiology": "放射科診所",
  "healthcare.clinic_or_praxis.pulmonology": "胸腔科診所",
  "healthcare.clinic_or_praxis.psychiatry": "精神科診所",
  "healthcare.clinic_or_praxis.paediatrics": "小兒科診所",
  "healthcare.clinic_or_praxis.otolaryngology": "耳鼻喉科診所",
  "healthcare.clinic_or_praxis.orthopaedics": "骨科診所",
  "healthcare.clinic_or_praxis.ophthalmology": "眼科診所",
  "healthcare.clinic_or_praxis.occupational": "職業醫學診所",
  "healthcare.clinic_or_praxis.gynaecology": "婦產科診所",
  "healthcare.clinic_or_praxis.general": "一般科診所",
  "healthcare.clinic_or_praxis.gastroenterology": "胃腸科診所",
  "healthcare.clinic_or_praxis.endocrinology": "內分泌科診所",
  "healthcare.clinic_or_praxis.dermatology": "皮膚科診所",
  "healthcare.clinic_or_praxis.cardiology": "心臟科診所",
  "healthcare.dentist": "牙醫診所",
  "healthcare.dentist.orthodontics": "牙齒矯正診所",
  "healthcare.hospital": "醫院",
  "healthcare.pharmacy": "藥局"
};

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCurrentPosition([lat, lon]);

          const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
          const radius = 5000;
          const url = `https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:${lon},${lat},${radius}&limit=30&apiKey=${apiKey}`;

          try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.features) {
              console.error('API 回傳錯誤，內容如下:', data);
              return;
            }

            const results = data.features.map((place) => {
              const rawCategory = place.properties.categories?.[0] || '未知機構';
              const translatedCategory = categoryTranslations[rawCategory] || rawCategory;
              return {
                name: place.properties.name || '無名稱機構',
                type: translatedCategory,
                position: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
              };
            });

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
        <MapUpdater center={currentPosition} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={currentPosition}>
          <Popup>你的位置</Popup>
        </Marker>
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
