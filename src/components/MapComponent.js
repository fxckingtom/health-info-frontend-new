import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 23.973875, lng: 120.982024 });
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const mapRef = useRef(null);

  const mapStyles = {
    height: '80vh',
    width: '100%',
  };

  // ✅ 地圖載入後建立 PlacesService 並搜尋醫院
  const onMapLoad = (map) => {
    mapRef.current = map;

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: currentPosition,
      radius: 5000,
      type: ['hospital'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitalLocations(results);
      } else {
        console.error('無法載入附近醫院:', status);
      }
    });

    // ✅ 顯示使用者位置（使用舊版 Marker）
    new window.google.maps.Marker({
      map: map,
      position: currentPosition,
      title: '你的位置',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      },
    });
  };

  // ✅ 顯示醫院標記
  useEffect(() => {
    if (!mapRef.current || hospitalLocations.length === 0) return;

    hospitalLocations.forEach((hospital) => {
      new window.google.maps.Marker({
        map: mapRef.current,
        position: hospital.geometry.location,
        title: hospital.name,
      });
    });
  }, [hospitalLocations]);

  // ✅ 嘗試取得使用者位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(false);
        },
        (error) => {
          console.error('無法取得使用者位置:', error.message);
          setLocationError(true);
        }
      );
    } else {
      console.error('瀏覽器不支援地理定位，使用預設位置。');
      setLocationError(true);
    }
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>📍 附近醫院地圖</h2>
      {locationError && (
        <p style={{ textAlign: 'center', color: 'red' }}>
          無法獲取您的位置，已使用預設位置。
        </p>
      )}

      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']} // 必須保留才能用 PlacesService
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          center={currentPosition}
          zoom={14}
          onLoad={onMapLoad}
        >
          {/* 標記都在 useEffect 和 onMapLoad 中加入 */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
