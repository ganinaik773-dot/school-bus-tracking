import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, MapPin, Play, Square, Navigation, Activity, Users } from 'lucide-react';

// Mock coordinates for the "Simulate" button to make the map move during your pitch
const MOCK_ROUTE = [
  { lat: 12.9716, lng: 77.5946, speed: 20 },
  { lat: 12.9725, lng: 77.5955, speed: 35 },
  { lat: 12.9738, lng: 77.5968, speed: 45 },
  { lat: 12.9750, lng: 77.5980, speed: 30 },
  { lat: 12.9765, lng: 77.5995, speed: 0 }
];

export default function DriverDashboard() {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946, speed: 0 });
  const [activeMode, setActiveMode] = useState(null); // 'real' or 'sim'
  
  const watchId = useRef(null);
  const simInterval = useRef(null);

  // Stop everything if the component unmounts
  useEffect(() => {
    return () => stopTracking();
  }, []);

  const updateDatabase = async (lat, lng, speed, status) => {
    setLocation({ lat, lng, speed });
    const { error } = await supabase
      .from('buses')
      .update({ latitude: lat, longitude: lng, speed: speed, status: status })
      .eq('id', 1); // Updating Bus B-102
      
    if (error) console.error('Error updating GPS:', error);
  };

  // --- SEAT AVAILABILITY FUNCTION ---
  const handleSeatUpdate = async (status) => {
    const { error } = await supabase
      .from('buses')
      .update({ seat_status: status })
      .eq('id', 1); 
      
    if (error) {
      console.error("Error updating seat status:", error);
    } else {
      // Small visual feedback for the driver
      alert(`Status successfully updated to: ${status}`);
    }
  };

  // --- GPS TRACKING FUNCTIONS ---
  const startRealGPS = () => {
    if (!navigator.geolocation) return alert('GPS not supported on this device.');
    
    setTracking(true);
    setActiveMode('real');
    
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        // speed is in m/s, convert to km/h (multiply by 3.6). If null, fallback to 25.
        const kmhSpeed = speed ? speed * 3.6 : 25; 
        updateDatabase(latitude, longitude, kmhSpeed, 'on_route');
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const startSimulation = () => {
    setTracking(true);
    setActiveMode('sim');
    let step = 0;
    
    // Jump to the first coordinate immediately
    updateDatabase(MOCK_ROUTE[0].lat, MOCK_ROUTE[0].lng, MOCK_ROUTE[0].speed, 'on_route');

    // Move the bus every 3 seconds
    simInterval.current = setInterval(() => {
      step++;
      if (step >= MOCK_ROUTE.length) step = 0; // Loop back to start
      updateDatabase(MOCK_ROUTE[step].lat, MOCK_ROUTE[step].lng, MOCK_ROUTE[step].speed, 'on_route');
    }, 3000);
  };

  const stopTracking = () => {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    if (simInterval.current) clearInterval(simInterval.current);
    
    setTracking(false);
    setActiveMode(null);
    updateDatabase(location.lat, location.lng, 0, 'offline');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', paddingBottom: '40px' }}>
      
      {/* Header Profile Section */}
      <div className="card flex justify-between items-center mb-6" style={{ padding: '20px 30px' }}>
        <div className="flex items-center" style={{ gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <Shield size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Driver Terminal</h2>
            <p className="text-muted" style={{ margin: 0, marginTop: '4px' }}>Assigned Bus: <b>B-102</b></p>
          </div>
        </div>
      </div>

      {/* Main GPS Control Panel */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={24} color="var(--primary)"/> Route Controls
          </h3>
          <span className="badge" style={{ background: tracking ? '#D1FAE5' : '#FEE2E2', color: tracking ? '#065F46' : '#B91C1C', fontWeight: 'bold' }}>
            {tracking ? '🟢 BROADCASTING' : '🔴 OFFLINE'}
          </span>
        </div>

        {/* Telemetry Display */}
        <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#F1F5F9', padding: '16px', borderRadius: '12px' }}>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: '0 0 4px 0' }}>Current Speed</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--primary)' }}>
              {Math.round(location.speed)} <span style={{ fontSize: '1rem', color: '#64748B' }}>km/h</span>
            </p>
          </div>
          <div style={{ background: '#F1F5F9', padding: '16px', borderRadius: '12px' }}>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: '0 0 4px 0' }}>GPS Status</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: tracking ? 'var(--success)' : '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={20} /> {tracking ? 'Active' : 'Standby'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {!tracking ? (
          <div className="flex-col" style={{ gap: '12px' }}>
            <button onClick={startRealGPS} className="btn" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: 'var(--primary)' }}>
              <MapPin size={20} style={{ marginRight: '8px' }}/> START REAL GPS TRACKING
            </button>
            <button onClick={startSimulation} className="btn" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: '#F59E0B', color: 'white', border: 'none' }}>
              <Play size={20} style={{ marginRight: '8px' }}/> Start Simulated Demo
            </button>
          </div>
        ) : (
          <button onClick={stopTracking} className="btn" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: '#EF4444', color: 'white', border: 'none' }}>
            <Square size={20} style={{ marginRight: '8px' }}/> END TRIP & STOP TRACKING
          </button>
        )}
      </div>

      {/* NEW: Driver Seat Control Panel */}
      <div className="card" style={{ border: '2px solid #E2E8F0' }}>
        <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--primary)"/> Update Seat Capacity
          </h3>
        </div>
        
        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
          Notify waiting students about the current capacity of the bus in real-time.
        </p>

        <div className="flex" style={{ gap: '12px' }}>
          <button 
            onClick={() => handleSeatUpdate('Available')}
            className="btn" 
            style={{ flex: 1, padding: '14px', fontSize: '1rem', background: '#10B981', color: 'white', border: 'none' }}
          >
            🟢 Set: Seats Available
          </button>
          <button 
            onClick={() => handleSeatUpdate('Full')}
            className="btn" 
            style={{ flex: 1, padding: '14px', fontSize: '1rem', background: '#EF4444', color: 'white', border: 'none' }}
          >
            🔴 Set: Bus is Full
          </button>
        </div>
      </div>

    </div>
  );
}