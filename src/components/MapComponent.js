import { useEffect, useRef, useState } from 'react';

function MapComponent() {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 載入 Google Maps script
  useEffect(() => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.id = 'googleMaps';
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true); // script 載入完成
      document.body.appendChild(script);
    } else {
      setMapLoaded(true); // script 已經存在，直接設為載入完成
    }
  }, []);

  // 地圖初始化
  useEffect(() => {
    if (mapLoaded && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 25.033964, lng: 121.564468 },
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: { lat: 25.033964, lng: 121.564468 },
        map: map,
        title: '台北101',
      });
    }
  }, [mapLoaded]);

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
