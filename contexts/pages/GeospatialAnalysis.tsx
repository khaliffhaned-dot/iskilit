import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header.tsx';
import Card from '../../components/Card.tsx';
import { Workspace, User } from '../../types.ts';
import * as securityService from '../../services/securityService.ts';
import { MalaysiaMap } from '../../components/MalaysiaMap.tsx';
import { MapPin, ShieldCheck, HelpCircle, Globe, Settings as SettingsIcon } from 'lucide-react';

interface GeospatialAnalysisProps {
    activeWorkspace: Workspace;
    currentUser: User;
}

const GeospatialAnalysis: React.FC<GeospatialAnalysisProps> = ({ activeWorkspace, currentUser }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const [isGoogleMapsActive, setIsGoogleMapsActive] = useState(false);
    const [keySource, setKeySource] = useState<string>('');

    useEffect(() => {
        // Look for Google Maps API Key from multi-source secrets
        const apiKey = 
            process.env.GOOGLE_MAPS_PLATFORM_KEY || 
            (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
            securityService.getGoogleMapsApiKey();
        
        if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_IS_NOT_SET' || apiKey === 'YOUR_API_KEY') {
            setMapError("Google Maps API Key is not configured. Falling back to the advanced local Sourcing Cartography engine.");
            setIsLoading(false);
            setIsGoogleMapsActive(false);
            return;
        }

        setKeySource(apiKey.substring(0, 6) + "...");

        // Define initMap on the window object so the script callback can find it.
        (window as any).initMap = () => {
            if (mapRef.current && (window as any).google) {
                try {
                    const googleMap = new (window as any).google.maps.Map(mapRef.current, {
                        center: { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur
                        zoom: 11,
                        mapId: 'ESCALATE_MAP_ID_LIGHT', // For custom styling
                        disableDefaultUI: false,
                        styles: [
                            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
                            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
                            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
                            { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
                            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
                            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
                            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
                            { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
                            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
                            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
                            { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
                            { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
                            { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
                            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
                            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
                        ]
                    });

                    // Add simulated active listening marker on Kuala Lumpur
                    new (window as any).google.maps.Marker({
                        position: { lat: 3.1390, lng: 101.6869 },
                        map: googleMap,
                        title: "Kuala Lumpur Sourcing Hub",
                        animation: (window as any).google.maps.Animation.DROP
                    });

                    setMap(googleMap);
                    setIsGoogleMapsActive(true);
                    setIsLoading(false);
                } catch (err: any) {
                    console.error("Failed to initialize Google Maps:", err);
                    setMapError("Failed to initialize the Google Maps library at runtime. Falling back to the advanced local vector engine.");
                    setIsGoogleMapsActive(false);
                    setIsLoading(false);
                }
            }
        };

        // Check if the script is already loaded to avoid duplicates
        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&map_ids=ESCALATE_MAP_ID_LIGHT`;
            script.async = true;
            document.head.appendChild(script);
            script.onerror = () => {
                console.error("Google Maps script failed to load.");
                setMapError("The Google Maps script failed to load (possibly due to key restrictions or network/sandbox blockages).");
                setIsGoogleMapsActive(false);
                setIsLoading(false); 
            };
        } else if ((window as any).google && (window as any).google.maps) {
            // If script is already there, just init the map.
             (window as any).initMap();
        }
    }, []);

    return (
        <div className="fade-in">
            <Header 
                title="Market Geointelligence" 
                subtitle="Map your reputation terrain. Analyze real-time narrative sentiment, local sourcing priority, and media density clusters across geopolitical regions." 
            />
            
            {/* API Key Status Info Banner */}
            <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isGoogleMapsActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {isGoogleMapsActive ? <ShieldCheck className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                    </div>
                    <div>
                        <div className="text-xs font-extrabold text-slate-800">
                            Map Engine Status: {isGoogleMapsActive ? 'Enterprise Google Maps Active' : 'Adaptive Local Cartography Mode'}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                            {isGoogleMapsActive 
                                ? `Connected successfully using API Key (prefix: ${keySource}). Satellite and dynamic layout capabilities unlocked.` 
                                : `Displaying the responsive vector-grid projection. All interactive geofences, regional narratives, and sentiment filters remain fully active.`
                            }
                        </p>
                    </div>
                </div>

                {!isGoogleMapsActive && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <SettingsIcon className="w-4 h-4 text-slate-600 animate-spin-slow" />
                        <span>Configure Google Maps Key in <strong>Settings</strong> to enable Satellite layers</span>
                    </div>
                )}
            </div>

            {/* Dynamic Rendering Block */}
            {isGoogleMapsActive ? (
                <Card className="p-4 border border-slate-200 shadow-md">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-150">
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Enterprise Satellite Engine</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Interactive Street and Topographical Layer</p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">LIVE DATA FEED</span>
                    </div>
                    <div className="h-[60vh] w-full rounded-xl bg-slate-200 overflow-hidden relative" ref={mapRef}>
                        {isLoading && (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold bg-slate-100">
                                Loading Google Maps Satellite Layer...
                            </div>
                        )}
                    </div>
                </Card>
            ) : (
                /* Fallback to our stunning vector listening map of Malaysia with all state metrics and narrative layers! */
                <MalaysiaMap isCrisisMode={false} />
            )}
        </div>
    );
};

export default GeospatialAnalysis;
