import { useEffect, useRef } from 'react';

function MapComponent() {
  const mapRef = useRef(null); // 綁定地圖顯示的位置

  useEffect(() => {
    // 確保 Google Maps script 已經載入
    if (window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 25.033964, lng: 121.564468 }, // 台北101
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: { lat: 25.033964, lng: 121.564468 },
        map: map,
        title: '台北101',
      });
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Google 地圖顯示範例</h2>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
      ></div>
    </div>
  );
}

export default MapComponent;
