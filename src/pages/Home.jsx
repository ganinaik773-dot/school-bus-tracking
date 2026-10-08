import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Bell, Activity, Truck, Navigation, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="hero-wrapper">
      <div className="hero-bg-blob"></div>

      <div className="container hero-container">
        
        {/* Header */}
        <header className="flex justify-between items-center hero-header">
          <div className="flex items-center hero-logo">
            <ShieldCheck size={32} /> BusTrack.io
          </div>
          <Link to="/admin/login" className="hero-admin-link">Admin Access</Link>
        </header>

        {/* Hero Section */}
        <div className="grid hero-grid">
          
          {/* Left: Copy & Buttons */}
          <div className="flex-col">
            <div className="badge badge-success hero-badge">
              🚀 Hackathon MVP Edition
            </div>
            
            <h1 className="hero-title">
              Next-Generation <br />
              <span className="hero-title-gradient">College Transit.</span>
            </h1>
            
            <p className="text-muted hero-subtitle">
              Empower students with live GPS tracking, give drivers a simple navigation terminal, and provide campus administration with complete fleet visibility.
            </p>
            
            <div className="flex hero-buttons">
              <Link to="/student/login" className="btn btn-large btn-shadow">
                🎓 Student Portal
              </Link>
              <Link to="/driver/login" className="btn btn-outline btn-large bg-white">
                🚌 Driver Portal
              </Link>
            </div>
          </div>

          {/* Right: Abstract Mockup Graphic */}
          <div className="mockup-wrapper">
            <div className="mockup-card">
              
              <div className="flex justify-between items-center mockup-header">
                <div className="flex items-center gap-2">
                  <Truck color="var(--primary)"/>
                  <span className="font-bold">Live Fleet</span>
                </div>
                <span className="badge badge-success flex items-center gap-2">
                  <span className="status-dot"></span> Active
                </span>
              </div>

              <div className="mockup-map">
                 <MapPin size={40} color="var(--primary)" className="mockup-map-pin" />
                 <svg className="mockup-map-lines">
                    <path d="M0,50 Q100,10 200,80 T400,100" fill="none" stroke="black" strokeWidth="4"/>
                    <path d="M50,200 Q150,150 250,180 T450,120" fill="none" stroke="black" strokeWidth="2"/>
                 </svg>
              </div>

              <div className="grid grid-cols-2 mockup-stat-grid">
                <div className="mockup-stat-box blue">
                  <Clock size={20} color="var(--primary)" className="mb-2"/>
                  <p className="text-muted mockup-stat-label">ETA to Campus</p>
                  <p className="mockup-stat-value">4 Mins</p>
                </div>
                <div className="mockup-stat-box green">
                  <Navigation size={20} color="#059669" className="mb-2"/>
                  <p className="text-muted mockup-stat-label">Bus Speed</p>
                  <p className="mockup-stat-value text-emerald-800">35 km/h</p>
                </div>
              </div>
            </div>
            
            {/* Floating Notification */}
            <div className="card flex items-center mockup-floating-card">
              <div className="mockup-floating-icon">
                <Bell size={20} color="var(--warning)" />
              </div>
              <div>
                <p className="font-bold text-sm m-0">Rahul boarded</p>
                <p className="text-muted text-xs m-0 mt-1">Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-header">
          <h2>Why Campuses Choose Us</h2>
          <p className="text-muted">Enterprise-grade tracking built for the modern student experience.</p>
        </div>

        <div className="grid grid-cols-4">
          <div className="card flex-col feature-card">
            <div className="feature-icon-box primary"><MapPin size={28} /></div>
            <h3 className="feature-title">Live GPS Streaming</h3>
            <p className="text-muted feature-desc">Real-time sub-second location updates directly from the driver's mobile device.</p>
          </div>
          
          <div className="card flex-col feature-card">
            <div className="feature-icon-box warning"><Activity size={28} /></div>
            <h3 className="feature-title">Smart Predictions</h3>
            <p className="text-muted feature-desc">Dynamic arrival time and delay calculations based on live vehicle speed data.</p>
          </div>
          
          <div className="card flex-col feature-card">
            <div className="feature-icon-box success"><ShieldCheck size={28} /></div>
            <h3 className="feature-title">Secure Architecture</h3>
            <p className="text-muted feature-desc">Role-based access ensures only authorized students can view active route locations.</p>
          </div>
          
          <div className="card flex-col feature-card">
            <div className="feature-icon-box danger"><Bell size={28} /></div>
            <h3 className="feature-title">Instant Telemetry</h3>
            <p className="text-muted feature-desc">Built on WebSockets to push status changes to the dashboard without refreshing.</p>
          </div>
        </div>

      </div>
    </div>
  );
}