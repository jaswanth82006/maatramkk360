import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Calendar } from 'lucide-react';

const ClassScheduler = ({ users, currentUser }) => {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({ subject: '', time: '', tutorId: currentUser?.role === 'tutor' ? currentUser.id : '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            // If tutor, only show my classes? Or all? Usually all or assigned. 
            // For now, let's show all for Admin, and filtered for Tutor if needed, 
            // but the requirement is just "create". Let's show all for simplicity or filter in parent.
            // Actually, the previous code showed all. Let's keep it consistent.
            setClasses(res.data);
        } catch (err) {
            console.error('Failed to fetch classes');
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            const classData = {
                ...newClass,
                tutorId: currentUser?.role === 'tutor' ? currentUser.id : newClass.tutorId
            };
            await api.post('/classes', classData);
            setMsg('Class scheduled!');
            setNewClass({ subject: '', time: '', tutorId: currentUser?.role === 'tutor' ? currentUser.id : '' });
            fetchClasses();
        } catch (err) {
            setMsg('Failed to schedule class');
        }
    };

    const tutors = users.filter(u => u.role === 'tutor');

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <Calendar size={20} style={{ color: 'var(--primary-color)' }} /> Schedule Class
                </h2>
                {msg && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1F2937', color: '#FBBF24', fontSize: '0.875rem', borderRadius: '0.25rem' }}>{msg}</div>}
                <form onSubmit={handleCreateClass}>
                    <div className="input-group">
                        <label className="input-label">Subject</label>
                        <input
                            type="text"
                            value={newClass.subject}
                            onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Time</label>
                        <input
                            type="datetime-local"
                            value={newClass.time}
                            onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    {currentUser?.role === 'admin' && (
                        <div className="input-group">
                            <label className="input-label">Assign Tutor</label>
                            <select
                                value={newClass.tutorId}
                                onChange={(e) => setNewClass({ ...newClass, tutorId: e.target.value })}
                                className="input-field"
                                required
                            >
                                <option value="">Select Tutor</option>
                                {tutors.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Schedule Class
                    </button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <Calendar size={20} style={{ color: 'var(--primary-color)' }} /> Scheduled Classes
                </h2>
                <div style={{ overflowY: 'auto', maxHeight: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {classes.map(c => (
                        <div key={c.id} style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.25rem', border: '1px solid #374151' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{c.subject}</h3>
                                    <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{new Date(c.time).toLocaleString()}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>Tutor ID: {c.tutorId}</p>
                                </div>
                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: c.status === 'scheduled' ? '#064E3B' : '#7F1D1D', color: c.status === 'scheduled' ? '#6EE7B7' : '#FCA5A5' }}>
                                    {c.status}
                                </span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#60A5FA', wordBreak: 'break-all' }}>
                                {c.link}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassScheduler;
