// MapComponent.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  // 地圖中心點的狀態
  const [currentPosition, setCurrentPosition] = useState({ lat: 23.973875, lng: 120.982024 }); // 台灣的中心點
  // 儲存醫院位置的狀態
  const [hospitalLocations, setHospitalLocations] = useState([]);

  // 地圖樣式
  const mapStyles = {
    height: '80vh', // 改為視窗高度 80%
    width: '100%',
  };


  // 地圖載入完成後的回呼函式
  const onMapLoad = (map) => {
    // 使用 PlacesService 來搜尋附近的醫院
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: currentPosition,
      radius: 5000, // 搜尋半徑為 5 公里
      type: ['hospital'], // 搜尋類型為醫院
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // 將搜尋結果儲存到狀態中
        setHospitalLocations(results);
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
        },
        () => {
          console.error('無法取得使用者位置，使用預設位置。');
        }
      );
    } else {
      console.error('瀏覽器不支援地理定位，使用預設位置。');
    }
  }, []);

  return (
  <div>
    <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>📍 附近醫院地圖</h2>

    <LoadScript
      googleMapsApiKey="AIzaSyBTlqHAPuKk7ImTi739UXII-eFTIgMPGtg"
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        center={currentPosition}
        zoom={14}
        onLoad={onMapLoad}
      >
        <Marker position={currentPosition} label="你的位置" />
        {hospitalLocations.map((hospital, index) => (
          <Marker
            key={index}
            position={hospital.geometry.location}
            title={hospital.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  </div>
);
}
export default MapComponent;
