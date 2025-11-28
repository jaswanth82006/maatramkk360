import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const DashboardLayout = ({ children, title, role }) => {
    const { user, logout } = useAuth();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-family)', position: 'relative', overflow: 'hidden' }}>
            {/* Background Gradients */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'rgba(255, 193, 7, 0.05)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'rgba(30, 58, 138, 0.05)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
            </div>

            {/* Navbar */}
            <header style={{ background: 'rgba(30, 30, 30, 0.8)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
                <div className="container" style={{ height: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 193, 7, 0.2)', filter: 'blur(4px)', borderRadius: '50%' }}></div>
                            <img src="/logo.png" alt="Maatram Logo" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', position: 'relative', zIndex: 10, border: '2px solid rgba(255, 193, 7, 0.5)' }} />
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', letterSpacing: '-0.025em' }}>
                            Maatram <span style={{ color: 'var(--primary-color)' }}>KK360</span>
                        </h1>
                        {role && (
                            <span style={{ marginLeft: '0.5rem', padding: '0.125rem 0.75rem', borderRadius: '9999px', background: 'rgba(31, 41, 55, 0.8)', fontSize: '0.75rem', fontWeight: 500, color: '#D1D5DB', border: '1px solid #374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {role}
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right', display: 'none' }} className="md-block">
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{user?.name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="btn btn-danger"
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <LogOut size={18} />
                            <span style={{ fontWeight: 500 }}>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container animate-fade-in" style={{ flexGrow: 1, padding: '2rem 1rem', width: '100%', position: 'relative', zIndex: 10 }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', letterSpacing: '-0.025em', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>{title}</h2>
                    <div style={{ height: '4px', flexGrow: 1, marginLeft: '1.5rem', background: 'linear-gradient(to right, #1F2937, transparent)', borderRadius: '9999px' }}></div>
                </div>
                {children}
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(30, 30, 30, 0.5)', marginTop: 'auto', position: 'relative', zIndex: 10, backdropFilter: 'blur(4px)' }}>
                <div className="container" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        Designed & Developed by <span style={{ color: '#D1D5DB', fontWeight: 600 }}>Team: SparkVision</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default DashboardLayout;
