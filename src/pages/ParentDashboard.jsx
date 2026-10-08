import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BusMap from '../components/BusMap';
import { Bell, MapPin, Clock, Gauge, Navigation, User, Hash, Crosshair, Users } from 'lucide-react';

export default function ParentDashboard() {
  const [bus, setBus] = useState(null);
  
  const storedBusId = localStorage.getItem('student_bus_id');
  const BUS_ID = storedBusId ? parseInt(storedBusId) : 1; 
  const studentName = localStorage.getItem('student_name') || 'Student';

  useEffect(() => {
    const fetchBus = async () => {
      const { data } = await supabase.from('buses').select('*').eq('id', BUS_ID).single();
      setBus(data);
    };
    fetchBus();

    const busSub = supabase.channel(`bus-updates-${BUS_ID}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'buses', filter: `id=eq.${BUS_ID}` }, 
      (payload) => setBus(payload.new)).subscribe();

    return () => supabase.removeChannel(busSub);
  }, [BUS_ID]);

  if (!bus) return <div className="container flex items-center justify-center" style={{ height: '60vh' }}><h3>Loading Live GPS...</h3></div>;

  const calculateETA = (speed) => {
    if (speed <= 0) return "Stopped";
    const timeInMins = Math.round((2 / speed) * 60); 
    return `${timeInMins} min`;
  };

  const isFull = bus.seat_status === 'Full';

  return (
    <div className="container">
      <div className="card flex justify-between items-center mb-6" style={{ padding: '20px 30px' }}>
        <div className="flex items-center" style={{ gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {studentName.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Welcome, {studentName}</h2>
            <p className="text-muted" style={{ margin: 0, marginTop: '4px' }}>Live tracking enabled for your Bus: <b>{bus.bus_number}</b></p>
          </div>
        </div>
        <span className={`badge ${bus.status === 'on_route' ? 'badge-success' : ''}`} style={{ fontSize: '1rem', padding: '10px 20px', background: bus.status === 'on_route' ? '#D1FAE5' : '#F1F5F9', color: bus.status === 'on_route' ? '#065F46' : '#64748B' }}>
          {bus.status === 'on_route' ? '🟢 LIVE TRACKING ACTIVE' : '🔴 BUS OFFLINE'}
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="flex-col">
          <div style={{ position: 'relative' }}>
            <BusMap lat={bus.latitude} lng={bus.longitude} busNumber={bus.bus_number} />
          </div>
          
          <div className="grid grid-cols-4 card" style={{ marginTop: '0', padding: '24px' }}>
            <div className="flex-col items-center"><Gauge size={28} color="var(--primary)"/><span style={{ fontWeight: '600' }}>{Math.round(bus.speed)} km/h</span><span className="text-muted text-sm">Speed</span></div>
            <div className="flex-col items-center"><Clock size={28} color="var(--warning)"/><span style={{ fontWeight: '600' }}>{calculateETA(bus.speed)}</span><span className="text-muted text-sm">Est. Time</span></div>
            <div className="flex-col items-center"><MapPin size={28} color="var(--success)"/><span style={{ fontWeight: '600' }}>2.1 km</span><span className="text-muted text-sm">Distance</span></div>
            <div className="flex-col items-center"><Navigation size={28} color="var(--text)"/><span style={{ fontWeight: '600' }}>MG Road</span><span className="text-muted text-sm">Next Stop</span></div>
          </div>
        </div>

        <div className="flex-col" style={{ gap: '24px' }}>
          
          {/* UPDATED: View-Only Seat Status Card */}
          <div className="card" style={{ border: isFull ? '2px solid #FCA5A5' : '2px solid #6EE7B7' }}>
            <div className="flex justify-between items-center" style={{ paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="var(--primary)"/> Live Seat Status
              </h3>
              <span className="badge" style={{ background: isFull ? '#FEE2E2' : '#D1FAE5', color: isFull ? '#B91C1C' : '#065F46', fontWeight: 'bold', fontSize: '1rem', padding: '8px 16px' }}>
                {isFull ? '🔴 Bus is Full' : '🟢 Seats Available'}
              </span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: '8px 0 0 0' }}>
              Status is updated live by the bus driver.
            </p>
          </div>

          <div className="card" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <h3 style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px', color: 'var(--text)' }}>🚌 Trip Details</h3>
            
            <div className="flex-col" style={{ gap: '16px' }}>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}><Hash size={20} color="var(--primary)"/></div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Bus Number</p>
                  <p style={{ fontWeight: '700', margin: 0 }}>{bus.bus_number}</p>
                </div>
              </div>
              
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}><User size={20} color="var(--primary)"/></div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Assigned Driver</p>
                  <p style={{ fontWeight: '700', margin: 0 }}>{bus.driver_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}