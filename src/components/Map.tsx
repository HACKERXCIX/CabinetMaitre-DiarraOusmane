
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key')
        .eq('name', 'mapbox_token')
        .single();

      if (error) {
        console.error('Error fetching Mapbox token:', error);
        return;
      }

      if (data) {
        setMapboxToken(data.key);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Changé pour un style avec plus de détails
      center: [-3.9892, 5.3484], // Abidjan coordinates
      zoom: 12,
      minZoom: 9, // Limite le zoom minimum pour garder le contexte
      maxZoom: 18, // Permet un zoom plus proche pour voir les détails
    });

    // Add markers for both locations
    const locations = [
      {
        coordinates: [-3.9733, 5.3576] as [number, number],
        name: "Cabinet Maître Diarra - Cocody",
        description: "Cocody 2 plateaux, non loin du commissariat du 12e"
      },
      {
        coordinates: [-4.0060, 5.3073] as [number, number],
        name: "Cabinet Maître Diarra - Treichville",
        description: "Treichville, non loin du commissariat du 2e"
      }
    ];

    locations.forEach(location => {
      // Créer un élément personnalisé pour le marqueur
      const marker = document.createElement('div');
      marker.className = 'w-6 h-6 bg-accent rounded-full border-2 border-white shadow-lg cursor-pointer';

      // Créer un popup avec plus d'informations
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: '300px'
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-lg mb-1">${location.name}</h3>
          <p class="text-gray-600">${location.description}</p>
        </div>
      `);

      // Ajouter le marqueur à la carte
      new mapboxgl.Marker(marker)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Ajouter le contrôle de géolocalisation
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-right');

    // Ajouter l'échelle
    map.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-right');

    // Ajouter le contrôle de plein écran
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Améliorer l'interaction avec la carte
    map.current.on('load', () => {
      if (!map.current) return;
      
      // Activer la rotation de la carte
      map.current.dragRotate.enable();
      map.current.touchZoomRotate.enableRotation();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  return (
    <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" /> // Hauteur augmentée pour une meilleure visibilité
  );
}
