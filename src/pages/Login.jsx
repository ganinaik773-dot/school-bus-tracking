import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Loader2 } from 'lucide-react';

export default function Login({ role, redirectTo }) {
  const [loading, setLoading] = useState(false);
  
  const defaultEmail = 
    role === 'Driver' ? 'raj.kumar@college.edu' : 
    role === 'Admin' ? 'admin@college.edu' : 'rahul@college.edu';
    
  const [email, setEmail] = useState(defaultEmail);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      localStorage.setItem(`${role.toLowerCase()}_auth`, 'true');

      if (role === 'Student') {
        const assignedBusId = email.toLowerCase().includes('rahul') ? 1 : 2;
        localStorage.setItem('student_bus_id', assignedBusId);
        
        const displayName = email.split('@')[0];
        localStorage.setItem('student_name', displayName.charAt(0).toUpperCase() + displayName.slice(1));
      }

      setLoading(false);
      navigate(redirectTo);
    }, 1500);
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="card text-center" style={{ maxWidth: '400px', width: '100%', padding: '40px 30px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: '#EEF2FF', padding: '16px', borderRadius: '50%', color: 'var(--primary)' }}>
            <Shield size={40} />
          </div>
        </div>
        
        <h2>{role} Portal</h2>
        <p className="text-muted mb-6" style={{ marginBottom: '30px' }}>
          Sign in to access your dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">College ID or Email</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94A3B8' }} />
              <input 
                type="text" 
                required 
                className="input-field" 
                placeholder="Enter your credentials" 
                style={{ paddingLeft: '44px' }} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '30px' }}>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94A3B8' }} />
              <input type="password" required className="input-field" placeholder="••••••••" style={{ paddingLeft: '44px' }} defaultValue="hackathon123" />
            </div>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={24} style={{ animation: 'spin 1s linear infinite' }} /> : 'Secure Sign In'}
          </button>
        </form>
        
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '20px' }}>
          <i>Demo: Log in as "rahul" vs "amit" to track different buses.</i>
        </p>
      </div>
    </div>
  );
}