import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Navigation, Play, Square, MapPin, User, Truck, Gauge, Radio, Activity } from 'lucide-react';

// Backup simulation route
const DEMO_ROUTE = [
  { lat: 12.9716, lng: 77.5946 }, { lat: 12.9725, lng: 77.6000 },
  { lat: 12.9750, lng: 77.6050 }, { lat: 12.9784, lng: 77.6408 }
];

export default function DriverDashboard() {
  const [bus, setBus] = useState(null);
  const [trackingMode, setTrackingMode] = useState('none'); // 'none', 'simulated', 'gps'
  const [step, setStep] = useState(0);
  const [watchId, setWatchId] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  
  const BUS_ID = 1;

  // Fetch Driver & Bus Details on Load
  useEffect(() => {
    const fetchBusDetails = async () => {
      const { data } = await supabase.from('buses').select('*').eq('id', BUS_ID).single();
      setBus(data);
    };
    fetchBusDetails();
  }, []);

  // Real GPS Tracking Logic
  const startRealGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setTrackingMode('gps');
    
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, speed } = position.coords;
        const speedKmh = speed ? (speed * 3.6) : 0; 

        setCurrentCoords({ latitude, longitude });
        setCurrentSpeed(speedKmh);

        await supabase.from('buses').update({
          latitude,
          longitude,
          speed: speedKmh,
          status: 'on_route',
          updated_at: new Date().toISOString()
        }).eq('id', BUS_ID);
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("Please enable location permissions in your browser.");
        stopTracking();
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
    
    setWatchId(id);
  };

  // Simulated Tracking Logic (Backup Demo)
  useEffect(() => {
    let interval;
    if (trackingMode === 'simulated' && step < DEMO_ROUTE.length) {
      interval = setInterval(async () => {
        const nextPos = DEMO_ROUTE[step];
        const simulatedSpeed = 35 + Math.random() * 10;
        
        setCurrentCoords({ latitude: nextPos.lat, longitude: nextPos.lng });
        setCurrentSpeed(simulatedSpeed);
        
        await supabase.from('buses').update({
          latitude: nextPos.lat,
          longitude: nextPos.lng,
          speed: simulatedSpeed,
          status: 'on_route',
          updated_at: new Date().toISOString()
        }).eq('id', BUS_ID);

        setStep((prev) => prev + 1);
      }, 3000);
    } else if (trackingMode === 'simulated' && step >= DEMO_ROUTE.length) {
      stopTracking();
    }
    return () => clearInterval(interval);
  }, [trackingMode, step]);

  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setTrackingMode('none');
    setStep(0);
    setWatchId(null);
    setCurrentCoords(null);
    setCurrentSpeed(0);
    supabase.from('buses').update({ status: 'offline', speed: 0 }).eq('id', BUS_ID);
  };

  if (!bus) return <div className="container flex justify-center mt-10"><h3>Loading Terminal...</h3></div>;

  return (
    <div className="container" style={{ maxWidth: '500px', padding: '20px' }}>
      
      {/* Driver Profile Header */}
      <div className="card flex justify-between items-center mb-6" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>{bus.driver_name}</h2>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Duty Active</p>
          </div>
        </div>
        <div className="flex-col items-end" style={{ gap: '4px' }}>
          <span style={{ background: 'white', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Truck size={14} /> {bus.bus_number}
          </span>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{bus.route_name}</span>
        </div>
      </div>

      <div className="card text-center flex-col items-center mb-6">
        {/* Main Action Area */}
        {trackingMode === 'none' ? (
          <div className="flex-col" style={{ width: '100%', gap: '15px' }}>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '10px' }}>
              <Radio size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
              <h3 style={{ margin: 0, color: 'var(--text)' }}>Terminal Ready</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Awaiting trip start command.</p>
            </div>

            <button className="btn btn-success" onClick={startRealGPS} style={{ padding: '24px', fontSize: '1.2rem', width: '100%', borderRadius: '16px' }}>
              <Navigation size={24} /> START REAL GPS TRACKING
            </button>
            
            <div style={{ position: 'relative', margin: '15px 0' }}>
              <hr style={{ borderTop: '1px solid #E2E8F0' }} />
              <span style={{ position: 'absolute', top: '-10px', background: 'white', padding: '0 10px', left: '42%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
            </div>

            <button className="btn btn-outline" onClick={() => { setTrackingMode('simulated'); setStep(0); }} style={{ padding: '16px', borderRadius: '12px' }}>
              <Play size={20} /> Start Simulated Demo
            </button>
          </div>
        ) : (
          <div className="flex-col" style={{ width: '100%' }}>
            <div style={{ padding: '20px', background: '#D1FAE5', borderRadius: '12px', marginBottom: '20px', border: '1px solid #34D399' }}>
              <Activity size={32} color="#059669" style={{ marginBottom: '10px', animation: 'pulse 2s infinite' }} />
              <h3 style={{ margin: 0, color: '#065F46' }}>Broadcasting Location</h3>
              <p style={{ color: '#047857', fontSize: '0.9rem', marginTop: '4px' }}>Parents can now see your bus.</p>
            </div>

            <button className="btn btn-danger" onClick={stopTracking} style={{ padding: '24px', fontSize: '1.2rem', width: '100%', borderRadius: '16px' }}>
              <Square size={24} /> END TRIP
            </button>
          </div>
        )}
      </div>

      {/* Live Telemetry Grid */}
      <div className="grid grid-cols-2" style={{ gap: '16px' }}>
        <div className="card flex-col items-center text-center" style={{ padding: '16px' }}>
          <Gauge size={24} color="var(--primary)" style={{ marginBottom: '8px' }}/>
          <h2 style={{ margin: 0 }}>{Math.round(currentSpeed)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>km/h</span></h2>
          <span className="text-muted text-sm">Current Speed</span>
        </div>
        
        <div className="card flex-col items-center text-center" style={{ padding: '16px' }}>
          <MapPin size={24} color={trackingMode !== 'none' ? "var(--success)" : "var(--text-muted)"} style={{ marginBottom: '8px' }}/>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            {currentCoords ? `${currentCoords.latitude.toFixed(4)}, ${currentCoords.longitude.toFixed(4)}` : 'Waiting...'}
          </h3>
          <span className="text-muted text-sm">Coordinates</span>
        </div>
      </div>

    </div>
  );
}