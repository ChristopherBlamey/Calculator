"use client";

import { useState, useCallback, useRef } from "react";
import { useEventStore } from "@/store/useEventStore";
import { MapPin, Navigation, Fuel, Calculator, CheckCircle2, TrendingDown } from "lucide-react";
import { useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

const LIBRARIES: ("places")[] = ["places"];
const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN_ADDRESS || "Buda 2961, Maipú, Santiago, Chile";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

const center = {
  lat: -33.5138, // Center loosely around Maipú or Santiago initially
  lng: -70.7523
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
};

export function Logistica() {
  const originDisplay = ORIGIN.split(',')[0] + (ORIGIN.split(',')[1] ? ',' + ORIGIN.split(',')[1] : '');
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const [destination, setDestination] = useState("");
  const [rendimiento, setRendimiento] = useState(12); // km/L
  const [precioLitro, setPrecioLitro] = useState(1150); // CLP
  const [isSaved, setIsSaved] = useState(false);

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{text: string, value: number, fuelCost: number} | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const setFuelCost = useEventStore((s) => s.setFuelCost);

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      let newDest = "";
      if (place && place.formatted_address) {
        newDest = place.formatted_address;
      } else if (place && place.name) {
        newDest = place.name;
      }
      if (newDest) {
        setDestination(newDest);
        // Automatically calculate when a place is selected
        calculateDeliveryRoute(newDest, rendimiento, precioLitro);
      }
    }
  };

  const calculateDeliveryRoute = async (dest: string, rend: number, precio: number) => {
    if (!isLoaded || !dest.trim()) return;

    setError(null);
    setIsSaved(false);
    setLoadingRoute(true);

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: ORIGIN,
        destination: dest,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidHighways: true,
        avoidTolls: true,
      });

      setDirections(results);
      
      if (results.routes.length > 0 && results.routes[0].legs.length > 0) {
        const leg = results.routes[0].legs[0];
        const meters = leg.distance?.value || 0;
        const text = leg.distance?.text || "0 km";
        
        const totalKm = (meters * 2) / 1000;
        const fuelCost = (totalKm / rend) * precio;

        setDistanceInfo({
          text,
          value: meters,
          fuelCost: Math.round(fuelCost)
        });
      }
    } catch (err: any) {
      console.error("Error calculating route:", err);
      setError("No se pudo calcular la ruta. Verifica que el destino sea válido y esté en Chile.");
      setDirections(null);
      setDistanceInfo(null);
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    calculateDeliveryRoute(destination, rendimiento, precioLitro);
  };

  const handleSaveToEvent = () => {
    if (distanceInfo) {
      setFuelCost(distanceInfo.fuelCost);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  if (loadError) {
    return (
      <div className="p-8 text-center text-red-400 glass-card">
        Error al cargar Google Maps. Verifica la API Key.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Cálculo de <span className="gradient-text-green">Logística</span>
        </h2>
        <p className="text-white/60 text-sm">
          Calcula el costo del combustible para tu evento sin peajes ni autopistas.
          <br/>Origen: <span className="text-cosmo-green">{originDisplay}</span>
        </p>
      </div>

      <form onSubmit={handleCalculate} className="glass-card p-6 space-y-5">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-1.5 text-white/90">
              <MapPin className="w-4 h-4 text-wanda-pink" />
              Dirección de Destino
            </label>
            {isLoaded ? (
              <Autocomplete
                onLoad={onLoadAutocomplete}
                onPlaceChanged={onPlaceChanged}
                restrictions={{ country: "cl" }}
              >
                <input
                  type="text"
                  required
                  placeholder="Ej: Plaza de Armas, Santiago"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cosmo-green/70 transition-all font-medium text-white placeholder:text-white/40"
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                disabled
                placeholder="Cargando mapas..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 opacity-50 cursor-not-allowed font-medium text-white placeholder:text-white/40"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-1.5 text-white/90">
                <TrendingDown className="w-4 h-4 text-cosmo-green" />
                Rendimiento (km/L)
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.1"
                value={rendimiento}
                onChange={(e) => setRendimiento(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cosmo-green/70 transition-all font-medium text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-1.5 text-white/90">
                <Fuel className="w-4 h-4 text-wanda-pink" />
                Precio Litro ($)
              </label>
              <input
                type="number"
                required
                min="1"
                value={precioLitro}
                onChange={(e) => setPrecioLitro(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wanda-pink/70 transition-all font-medium text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </div>

        {isLoaded && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-lg relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={11}
              center={center}
              options={mapOptions}
            >
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: "#7FFF00",
                      strokeWeight: 6,
                      strokeOpacity: 0.9,
                    },
                  }}
                />
              )}
            </GoogleMap>
            <div className="absolute inset-0 pointer-events-none border-2 border-cosmo/50 rounded-xl shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] mix-blend-overlay"></div>
          </div>
        )}

        <button
          type="submit"
          disabled={loadingRoute || !isLoaded}
          className="w-full fab-glow green bg-cosmo-green text-black font-bold py-3.5 rounded-xl hover:bg-cosmo-green-light transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingRoute ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              Calcular Ruta
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
      </form>

      {distanceInfo && (
        <div className="glass-card neon-border-cosmo p-6 animate-slide-up space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center divide-x divide-white/10">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-60 mb-1">Distancia Ida</p>
              <p className="text-xl font-bold">{distanceInfo.text}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-60 mb-1">Total (Ida y Vuelta)</p>
              <p className="text-xl font-bold text-cosmo-green">
                {((distanceInfo.value * 2) / 1000).toFixed(1)} km
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
            <p className="text-sm opacity-60 mb-1 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Costo Estimado Combustible
            </p>
            <p className="text-4xl font-black gradient-text-pink">
              ${distanceInfo.fuelCost.toLocaleString("es-CL")}
            </p>
          </div>

          <button
            onClick={handleSaveToEvent}
            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isSaved 
                ? "bg-white/10 text-cosmo-green border border-cosmo-green/30" 
                : "bg-wanda-pink text-white fab-glow hover:bg-wanda-pink-light"
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Guardado en Evento Actual
              </>
            ) : (
              "Usar este costo en el Evento"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
