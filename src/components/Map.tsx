
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('key')
          .eq('name', 'mapbox_token')
          .maybeSingle();

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          setError('Erreur lors de la récupération de la clé Mapbox');
          return;
        }

        if (!data?.key) {
          setError('Clé Mapbox non trouvée');
          return;
        }

        setMapboxToken(data.key);
      } catch (err) {
        console.error('Error in fetchMapboxToken:', err);
        setError('Erreur inattendue lors de la récupération de la clé Mapbox');
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-3.9892, 5.3484], // Abidjan coordinates
        zoom: 13,
        minZoom: 11,
        maxZoom: 19,
        pitch: 45,
        bearing: 0,
      });

      map.current = newMap;

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
        const marker = document.createElement('div');
        marker.className = 'w-8 h-8 bg-white rounded-full border-2 border-primary shadow-lg cursor-pointer hover:bg-primary hover:border-white transition-colors duration-300';

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

        const mapMarker = new mapboxgl.Marker(marker)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(newMap);

        marker.addEventListener('mouseenter', () => {
          popup.addTo(newMap);
        });
      });

      // Add map controls
      newMap.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true
      }), 'top-right');
      
      newMap.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-right');

      newMap.addControl(new mapboxgl.ScaleControl({
        maxWidth: 150,
        unit: 'metric'
      }), 'bottom-right');

      newMap.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      newMap.on('load', () => {
        if (!newMap) return;

        newMap.setFog({
          'color': 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2
        });

        newMap.on('zoom', () => {
          const currentZoom = newMap.getZoom();
          const opacity = Math.min(Math.max((currentZoom - 11) / 5, 0), 1);
          if (newMap.getLayer('poi-labels')) {
            newMap.setPaintProperty('poi-labels', 'text-opacity', opacity);
          }
        });
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Erreur lors de l\'initialisation de la carte');
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  if (error) {
    return (
      <div className="w-full h-[600px] rounded-lg shadow-xl bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-center p-4">{error}</p>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="w-full h-[600px] rounded-lg shadow-xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-[600px] rounded-lg shadow-xl" />
  );
}
