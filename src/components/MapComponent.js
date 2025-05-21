import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapComponent = () => {
  // 使用者位置（預設為台灣中心）
  const [currentPosition, setCurrentPosition] = useState({ lat: 23.973875, lng: 120.982024 });

  // 醫院位置列表
  const [hospitalLocations, setHospitalLocations] = useState([]);

  // 是否出現定位錯誤
  const [locationError, setLocationError] = useState(false);

  // 保存地圖參考物件
  const mapRef = useRef(null);

  // 地圖樣式
  const mapStyles = {
    height: '80vh',
    width: '100%',
  };

  // ✅ 地圖載入完成後執行的函式
  const onMapLoad = (map) => {
    mapRef.current = map;

    // 📍 建立 PlacesService 物件
    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: currentPosition,
      radius: 5000, // 搜尋半徑 5 公里
      type: ['hospital'], // 搜尋醫院
    };

    // 🔍 搜尋附近的醫院
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitalLocations(results); // 儲存搜尋結果
      } else {
        console.error('無法載入附近醫院:', status);
      }
    });

    // 📍 顯示使用者當前位置（使用 AdvancedMarkerElement）
    const userMarker = new window.google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: currentPosition,
      title: '你的位置',
    });
  };

  // 🔄 每次 hospitalLocations 有變化時，加入醫院標記
  useEffect(() => {
    if (!mapRef.current || hospitalLocations.length === 0) return;

    // 每個醫院都加上標記
    hospitalLocations.forEach((hospital) => {
      new window.google.maps.marker.AdvancedMarkerElement({
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

      {/* ✅ 注意：libraries 要寫成固定陣列避免效能警告 */}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']} // 這裡固定寫死，不要每次都重建新陣列
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          center={currentPosition}
          zoom={14}
          onLoad={onMapLoad}
        >
          {/* 所有標記都會在 onMapLoad 及 useEffect 中用 AdvancedMarkerElement 加入 */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
