
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
      style: 'mapbox://styles/mapbox/light-v11', // Style clair similaire à l'image
      center: [-3.9892, 5.3484], // Abidjan coordinates
      zoom: 12.5, // Zoom ajusté pour voir la ville
      minZoom: 11,
      maxZoom: 19,
      pitch: 0, // Vue en 2D
      bearing: 0,
    });

    // Add markers for both locations
    const locations = [
      {
        coordinates: [-3.9733, 5.3576] as [number, number],
        name: "Cabinet Maître Diarra - Cocody",
        description: "Cocody 2 plateaux, non loin du commissariat du 12e",
        horaires: "Lundi - Vendredi: 8h00 - 17h00",
        contact: "+225 07 07 84 37 77"
      },
      {
        coordinates: [-4.0060, 5.3073] as [number, number],
        name: "Cabinet Maître Diarra - Treichville",
        description: "Treichville, non loin du commissariat du 2e",
        horaires: "Lundi - Vendredi: 8h00 - 17h00",
        contact: "+225 01 02 46 52 52"
      }
    ];

    locations.forEach(location => {
      // Créer un élément personnalisé pour le marqueur
      const marker = document.createElement('div');
      marker.className = 'w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-accent transition-colors duration-300';

      // Créer un popup plus détaillé avec plus d'informations
      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: true,
        maxWidth: '350px',
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-4 bg-white rounded-lg">
          <h3 class="font-bold text-xl mb-2 text-primary">${location.name}</h3>
          <div class="space-y-2 text-gray-700">
            <p class="text-base"><strong>Adresse:</strong> ${location.description}</p>
            <p class="text-base"><strong>Horaires:</strong> ${location.horaires}</p>
            <p class="text-base"><strong>Contact:</strong> ${location.contact}</p>
          </div>
        </div>
      `);

      // Ajouter le marqueur à la carte
      const mapMarker = new mapboxgl.Marker(marker)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      // Ajouter un effet hover sur le marqueur
      marker.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl({
      visualizePitch: false
    }), 'top-right');
    
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
      maxWidth: 150,
      unit: 'metric'
    }), 'bottom-right');

    // Désactiver la rotation de la carte
    map.current.dragRotate.disable();
    map.current.touchZoomRotate.disableRotation();

    // Améliorer la lisibilité de la carte
    map.current.on('load', () => {
      if (!map.current) return;

      // Ajuster l'opacité des labels pour une meilleure lisibilité
      map.current.on('zoom', () => {
        const currentZoom = map.current?.getZoom() || 0;
        const opacity = Math.min(Math.max((currentZoom - 11) / 5, 0), 1);
        if (map.current?.getLayer('poi-labels')) {
          map.current?.setPaintProperty('poi-labels', 'text-opacity', opacity);
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  return (
    <div ref={mapContainer} className="w-full h-[600px] rounded-lg shadow-xl" />
  );
}
