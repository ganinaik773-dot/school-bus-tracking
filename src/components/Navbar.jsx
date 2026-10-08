import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (location.pathname === '/') return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={28} /> BusTrack.io
      </Link>
      <div className="flex items-center" style={{ gap: '10px' }}>
        <Link to="/student/login" style={{ padding: '8px 16px', borderRadius: '8px' }}>Student</Link>
        <Link to="/driver/login" style={{ padding: '8px 16px', borderRadius: '8px' }}>Driver</Link>
        <Link to="/admin/login" style={{ padding: '8px 16px', borderRadius: '8px', background: '#F1F5F9' }}>Admin</Link>
        {location.pathname !== '/student/login' && location.pathname !== '/driver/login' && location.pathname !== '/admin/login' && (
           <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem', marginLeft: '10px' }}>Logout</button>
        )}
      </div>
    </nav>
  );
}