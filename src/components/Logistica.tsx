"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useEventStore } from "@/store/useEventStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { MapPin, Navigation, Fuel, Calculator, CheckCircle2, TrendingDown, Save, Loader2, Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

// Google Maps libraries - using places for autocomplete
const MAP_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];
const DEFAULT_ORIGIN = "Santiago, Chile";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

const center = {
  lat: -33.5138,
  lng: -70.7523
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
  ],
};

export function Logistica() {
  const { user, profile } = useAuth();
  const [originAddress, setOriginAddress] = useState("");
  const [isEditingOrigin, setIsEditingOrigin] = useState(false);
  const [isSavingOrigin, setIsSavingOrigin] = useState(false);
  const [originSaved, setOriginSaved] = useState(false);
  
  useEffect(() => {
    if (profile?.origin_address) {
      setOriginAddress(profile.origin_address);
    }
  }, [profile]);

  const originDisplay = originAddress ? originAddress.split(',')[0] + (originAddress.split(',')[1] ? ',' + originAddress.split(',')[1] : '') : "No configurado";
  
  // Enhanced Google Maps loader with places and geometry libraries
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: MAP_LIBRARIES,
    version: "weekly",
  });

  const [destination, setDestination] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rendimiento, setRendimiento] = useState(12);
  const [precioLitro, setPrecioLitro] = useState(1150);
  const [isSaved, setIsSaved] = useState(false);

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{text: string, value: number, fuelCost: number} | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const setFuelCost = useEventStore((s) => s.setFuelCost);

  const handleSaveOrigin = async () => {
    if (!user || !originAddress.trim()) return;
    
    setIsSavingOrigin(true);
    try {
      const { error } = await supabase
        .from("perfiles")
        .update({ origin_address: originAddress.trim() })
        .eq("id", user.id);

      if (error) throw error;
      setOriginSaved(true);
      setIsEditingOrigin(false);
      setTimeout(() => setOriginSaved(false), 3000);
    } catch (err) {
      console.error("Error saving origin:", err);
    } finally {
      setIsSavingOrigin(false);
    }
  };

  const onLoadOriginAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    originAutocompleteRef.current = autocomplete;
  };

  const onOriginPlaceChanged = () => {
    if (originAutocompleteRef.current) {
      const place = originAutocompleteRef.current.getPlace();
      if (place?.formatted_address) {
        setOriginAddress(place.formatted_address);
      }
    }
  };

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
        calculateDeliveryRoute(newDest, rendimiento, precioLitro);
      }
    }
  };

  const calculateDeliveryRoute = async (dest: string, rend: number, precio: number) => {
    if (!isLoaded || !dest.trim()) return;
    if (!originAddress.trim()) {
      setError("Debes configurar tu dirección de origen primero");
      return;
    }

    setError(null);
    setIsSaved(false);
    setLoadingRoute(true);

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originAddress,
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

  const handleWhatsApp = () => {
    if (!telefono || !destination || !originAddress) return;
    
    const mensaje = `🚚 *Ruta de Entrega* - *Blamey ERP*

*📍 Origen:* ${originAddress}
*🏁 Destino:* ${destination}
*📏 Distancia:* ${distanceInfo?.text} (ida y vuelta: ${((distanceInfo?.value || 0) * 2 / 1000).toFixed(1)} km)
*⛽ Costo Combustible:* $${distanceInfo?.fuelCost.toLocaleString("es-CL")}

_Enviado desde Blamey ERP_`;
    
    const telefonoLimpio = telefono.replace(/\D/g, "");
    window.open(`https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  if (loadError) {
    return (
      <div className="p-8 text-center glass-card space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Error al cargar Google Maps</h3>
        <p className="text-white/60 text-sm">
          Verifica que la API Key de Google Maps esté configurada correctamente en las variables de entorno.
        </p>
        <p className="text-white/40 text-xs">
          Error: {loadError.message}
        </p>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-8 text-center glass-card space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Google Maps no configurado</h3>
        <p className="text-white/60 text-sm">
          La API Key de Google Maps no está configurada. Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en tus variables de entorno.
        </p>
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
        </p>
      </div>

      {/* Configuración de Origen */}
      <div className="glass-card p-4 border-wanda-pink/30">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-bold text-white/90">
            <MapPin className="w-4 h-4 text-wanda-pink" />
            Mi Dirección de Origen
          </label>
          {!isEditingOrigin && (
            <button 
              onClick={() => setIsEditingOrigin(true)}
              className="text-xs text-wanda-pink hover:underline"
            >
              Cambiar
            </button>
          )}
        </div>

        {isEditingOrigin ? (
          <div className="space-y-3">
            {isLoaded ? (
              <Autocomplete
                onLoad={onLoadOriginAutocomplete}
                onPlaceChanged={onOriginPlaceChanged}
                restrictions={{ country: "cl" }}
              >
                <input
                  type="text"
                  placeholder="Ej: Tu dirección, Comuna, Ciudad"
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wanda-pink/70 transition-all font-medium text-white placeholder:text-white/40"
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                disabled
                placeholder="Cargando mapas..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 opacity-50 cursor-not-allowed font-medium text-white"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={handleSaveOrigin}
                disabled={isSavingOrigin || !originAddress.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light disabled:opacity-50"
              >
                {isSavingOrigin ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditingOrigin(false);
                  if (profile?.origin_address) setOriginAddress(profile.origin_address);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3">
            <span className="text-white font-medium">{originDisplay}</span>
            {originSaved && (
              <span className="text-cosmo-green text-sm flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Guardado
              </span>
            )}
          </div>
        )}
        <p className="text-xs text-white/40 mt-2">
          Esta dirección se guardará para tus próximos cálculos de ruta.
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

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-1.5 text-white/90">
              <Phone className="w-4 h-4 text-cosmo-green" />
              WhatsApp (opcional)
            </label>
            <input
              type="tel"
              placeholder="+56 9 1234 5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cosmo-green/70 transition-all font-medium text-white placeholder:text-white/40"
            />
            <p className="text-xs text-white/40 mt-1">Para enviar la ruta por WhatsApp</p>
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

        {isLoaded && originAddress && (
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
          disabled={loadingRoute || !isLoaded || !originAddress}
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

          {telefono && (
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-500"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar ruta por WhatsApp
            </button>
          )}
        </div>
      )}
    </div>
  );
}
