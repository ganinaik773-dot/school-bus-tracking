import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Truck, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      const { data } = await supabase.from('buses').select('*').order('id');
      if (data) setBuses(data);
    };
    fetchBuses();

    const adminSub = supabase.channel('admin-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'buses' }, 
      (payload) => {
        setBuses(curr => curr.map(b => b.id === payload.new.id ? payload.new : b));
      }).subscribe();

    return () => supabase.removeChannel(adminSub);
  }, []);

  const activeBuses = buses.filter(b => b.status === 'on_route').length;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>School Fleet Command</h2>
          <p className="text-muted">Monitor all active routes and drivers in real-time.</p>
        </div>
        <button className="btn">+ Add New Bus</button>
      </div>

      <div className="grid grid-cols-4 mb-6">
        <div className="card flex items-center justify-between">
          <div><h3 className="text-muted">Total Fleet</h3><h2 style={{ margin: 0 }}>{buses.length}</h2></div>
          <div style={{ padding: '16px', background: '#F1F5F9', borderRadius: '12px' }}><Truck size={28} color="var(--primary)" /></div>
        </div>
        <div className="card flex items-center justify-between">
          <div><h3 className="text-muted">Active On Route</h3><h2 style={{ margin: 0, color: 'var(--success)' }}>{activeBuses}</h2></div>
          <div style={{ padding: '16px', background: '#D1FAE5', borderRadius: '12px' }}><CheckCircle size={28} color="var(--success)" /></div>
        </div>
        <div className="card flex items-center justify-between">
          <div><h3 className="text-muted">Delayed</h3><h2 style={{ margin: 0, color: 'var(--warning)' }}>0</h2></div>
          <div style={{ padding: '16px', background: '#FEF3C7', borderRadius: '12px' }}><AlertTriangle size={28} color="var(--warning)" /></div>
        </div>
        <div className="card flex items-center justify-between">
          <div><h3 className="text-muted">Total Students</h3><h2 style={{ margin: 0 }}>240</h2></div>
          <div style={{ padding: '16px', background: '#F1F5F9', borderRadius: '12px' }}><Users size={28} color="var(--text-muted)" /></div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Live Fleet Status</h3>
          <div className="flex items-center" style={{ background: '#F8FAFC', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '8px' }}/>
            <input type="text" placeholder="Search bus or driver..." style={{ border: 'none', background: 'transparent', outline: 'none' }} />
          </div>
        </div>

        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '2px solid #F1F5F9' }}>Bus ID</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '2px solid #F1F5F9' }}>Driver</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '2px solid #F1F5F9' }}>Route</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '2px solid #F1F5F9' }}>Live Status</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '2px solid #F1F5F9' }}>Speed</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="hover:bg-slate-50">
                <td style={{ padding: '16px 12px', fontWeight: '700' }}>{bus.bus_number}</td>
                <td style={{ padding: '16px 12px' }}>{bus.driver_name}</td>
                <td style={{ padding: '16px 12px' }} className="text-muted">{bus.route_name}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span className={`badge ${bus.status === 'on_route' ? 'badge-success' : ''}`} style={{ background: bus.status === 'on_route' ? '#D1FAE5' : '#F1F5F9', color: bus.status === 'on_route' ? '#065F46' : '#64748B' }}>
                    {bus.status === 'on_route' ? '🟢 On Route' : '🔴 Offline'}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', fontWeight: '600' }}>{Math.round(bus.speed)} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}