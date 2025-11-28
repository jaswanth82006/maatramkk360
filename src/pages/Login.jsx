import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        setError('');
        try {
            const result = await login(email, password);
            console.log('Login result:', result);
            if (result.success) {
                const role = result.user.role;
                console.log('Redirecting to:', role);
                if (role === 'admin') navigate('/admin');
                else if (role === 'tutor') navigate('/tutor');
                else if (role === 'student') navigate('/student');
                else navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #121212 0%, #000000 100%)', position: 'relative', overflow: 'hidden' }}>

            {/* Background Decoration */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'rgba(30, 58, 138, 0.1)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10, backdropFilter: 'blur(20px)', background: 'rgba(30, 30, 30, 0.8)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 193, 7, 0.2)', filter: 'blur(20px)', borderRadius: '50%' }}></div>
                        <img src="/logo.png" alt="Maatram KK360" style={{ width: '80px', height: '80px', borderRadius: '50%', position: 'relative', zIndex: 10, border: '2px solid rgba(255, 193, 7, 0.5)' }} />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginTop: '1rem' }}>Maatram <span style={{ color: 'var(--primary-color)' }}>KK360</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Integrated Management Platform</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(127, 29, 29, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#FECACA', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }}></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">EMAIL ADDRESS</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '1rem' }}
                    >
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid rgba(55, 65, 81, 0.5)', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Designed & Developed by <span style={{ color: '#D1D5DB', fontWeight: 600 }}>Team: SparkVision</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
