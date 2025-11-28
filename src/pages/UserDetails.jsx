import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Save, Trash2, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const [performanceRecords, setPerformanceRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({ subject: '', score: '', remarks: '' });

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await api.get('/users');
            const foundUser = res.data.find(u => u.id === id);
            if (foundUser) {
                setUser(foundUser);
                if (foundUser.role === 'student') {
                    fetchPerformance(foundUser.id);
                }
            } else {
                setError('User not found');
            }
        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformance = async (studentId) => {
        try {
            const res = await api.get(`/performance?studentId=${studentId}`);
            setPerformanceRecords(res.data);
        } catch (err) {
            console.error('Failed to fetch performance records');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/users/${id}`, user);
            setMsg('User updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to update user');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/users/${id}`);
                navigate('/admin');
            } catch (err) {
                setMsg('Failed to delete user');
            }
        }
    };

    const handleAddPerformance = async (e) => {
        e.preventDefault();
        try {
            await api.post('/performance', {
                studentId: user.id,
                ...newRecord
            });
            setMsg('Performance record added!');
            setNewRecord({ subject: '', score: '', remarks: '' });
            fetchPerformance(user.id);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to add performance record');
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!user) return null;

    return (
        <DashboardLayout title="User Details" role="Admin">
            <button
                onClick={() => navigate('/admin')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="card" style={{ maxWidth: '800px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <User size={24} style={{ color: 'var(--primary-color)' }} /> {user.name}
                    </h2>
                    <button
                        onClick={handleDelete}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#7F1D1D', color: '#FCA5A5', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                    >
                        <Trash2 size={18} /> Delete User
                    </button>
                </div>

                {msg && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1F2937', color: '#FBBF24', fontSize: '0.875rem', borderRadius: '0.25rem' }}>{msg}</div>}

                <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="input-group">
                        <label className="input-label">Name</label>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Role</label>
                        <select
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="input-field"
                        >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {user.role === 'student' && (
                        <>
                            <div className="input-group">
                                <label className="input-label">Phone</label>
                                <input
                                    type="tel"
                                    value={user.phone || ''}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">School</label>
                                <input
                                    type="text"
                                    value={user.school || ''}
                                    onChange={(e) => setUser({ ...user, school: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Class</label>
                                <input
                                    type="text"
                                    value={user.class || ''}
                                    onChange={(e) => setUser({ ...user, class: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Place</label>
                                <input
                                    type="text"
                                    value={user.place || ''}
                                    onChange={(e) => setUser({ ...user, place: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </>
                    )}

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {user.role === 'student' && (
                <div className="card" style={{ maxWidth: '800px', marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Tutor Remarks</h2>

                    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                                    <th style={{ padding: '0.5rem' }}>Subject</th>
                                    <th style={{ padding: '0.5rem' }}>Score</th>
                                    <th style={{ padding: '0.5rem' }}>Remarks</th>
                                    <th style={{ padding: '0.5rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceRecords.filter(r => r.type !== 'academic').length === 0 && <tr><td colSpan="4" style={{ padding: '0.5rem', color: '#6B7280' }}>No records found.</td></tr>}
                                {performanceRecords.filter(r => r.type !== 'academic').map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                        <td style={{ padding: '0.5rem' }}>{r.subject}</td>
                                        <td style={{ padding: '0.5rem', color: 'var(--primary-color)' }}>{r.score}</td>
                                        <td style={{ padding: '0.5rem' }}>{r.remarks}</td>
                                        <td style={{ padding: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>{new Date(r.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Add New Record</h3>
                    <form onSubmit={handleAddPerformance} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                        <div className="input-group">
                            <label className="input-label">Subject</label>
                            <input
                                type="text"
                                value={newRecord.subject}
                                onChange={(e) => setNewRecord({ ...newRecord, subject: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Score</label>
                            <input
                                type="text"
                                value={newRecord.score}
                                onChange={(e) => setNewRecord({ ...newRecord, score: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label className="input-label">Remarks</label>
                            <input
                                type="text"
                                value={newRecord.remarks}
                                onChange={(e) => setNewRecord({ ...newRecord, remarks: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Add Record</button>
                    </form>
                </div>
            )}

            {user.role === 'student' && (
                <div className="card" style={{ maxWidth: '800px', marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Academic Marks (Student Reported)</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                                    <th style={{ padding: '0.5rem' }}>Exam Name</th>
                                    <th style={{ padding: '0.5rem' }}>Subject</th>
                                    <th style={{ padding: '0.5rem' }}>Score</th>
                                    <th style={{ padding: '0.5rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceRecords.filter(r => r.type === 'academic').length === 0 && <tr><td colSpan="4" style={{ padding: '0.5rem', color: '#6B7280' }}>No academic marks found.</td></tr>}
                                {performanceRecords.filter(r => r.type === 'academic').map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                        <td style={{ padding: '0.5rem' }}>{r.examName}</td>
                                        <td style={{ padding: '0.5rem' }}>{r.subject}</td>
                                        <td style={{ padding: '0.5rem', color: 'var(--primary-color)' }}>{r.score}</td>
                                        <td style={{ padding: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>{new Date(r.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UserDetails;
