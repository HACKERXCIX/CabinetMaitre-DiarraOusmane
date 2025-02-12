
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWRpYXJyYSIsImEiOiJjbHRuMDc4bjQwN3RoMmtvN3FzMG11dW4wIn0.Sp8YfUDcbrdlh7k4vOk3cA';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-3.9892, 5.3484] as [number, number], // Abidjan coordinates avec type assertion
      zoom: 12
    });

    // Add markers for both locations
    const locations = [
      {
        coordinates: [-3.9733, 5.3576] as [number, number], // Type assertion pour Cocody
        name: "Cabinet Maître Diarra - Cocody"
      },
      {
        coordinates: [-4.0060, 5.3073] as [number, number], // Type assertion pour Treichville
        name: "Cabinet Maître Diarra - Treichville"
      }
    ];

    locations.forEach(location => {
      const marker = document.createElement('div');
      marker.className = 'w-6 h-6 bg-accent rounded-full border-2 border-white shadow-lg';

      new mapboxgl.Marker(marker)
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="font-bold">${location.name}</h3>`))
        .addTo(map.current!);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className="w-full h-[400px] rounded-lg shadow-lg" />
  );
}
