import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  // 地圖中心點的狀態
  const [currentPosition, setCurrentPosition] = useState({ lat: 23.973875, lng: 120.982024 }); // 台灣的中心點
  // 儲存醫院位置的狀態
  const [hospitalLocations, setHospitalLocations] = useState([]);
  // 追蹤位置獲取狀態
  const [locationError, setLocationError] = useState(false);

  // 地圖樣式
  const mapStyles = {
    height: '80vh', // 改為視窗高度 80%
    width: '100%',
  };

  // 地圖載入完成後的回呼函式
  const onMapLoad = (map) => {
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: currentPosition,
      radius: 5000, // 搜尋半徑為 5 公里
      type: ['hospital'], // 搜尋類型為醫院
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitalLocations(results);
      } else {
        console.error('無法載入附近醫院:', status);
      }
    });
  };

  // 取得使用者目前位置
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
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          center={currentPosition}
          zoom={14}
          onLoad={onMapLoad}
        >
          <Marker position={currentPosition} label="你的位置" />
          {hospitalLocations.map((hospital) => (
            <Marker
              key={hospital.place_id || hospital.id || Math.random()} // 優先使用 place_id，否則使用隨機值作為臨時解決
              position={hospital.geometry.location}
              title={hospital.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
