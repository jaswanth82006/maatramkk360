import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Calendar, Video, User, Save, FileText, Megaphone } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [activeTab, setActiveTab] = useState('schedule');
    const [profileData, setProfileData] = useState({
        phone: user?.phone || '',
        school: user?.school || '',
        class: user?.class || '',
        place: user?.place || '',
        parentName: user?.parentName || '',
        parentPhone: user?.parentPhone || ''
    });
    const [academicData, setAcademicData] = useState({ subject: '', examName: '', score: '' });
    const [msg, setMsg] = useState('');

    const [performanceRecords, setPerformanceRecords] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetchClasses();
        fetchPerformance();
        fetchAssignments();
        fetchAnnouncements();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            // Sort by time descending (latest first)
            const sortedClasses = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
            setClasses(sortedClasses);
        } catch (err) {
            console.error('Failed to fetch classes');
        }
    };

    const fetchPerformance = async () => {
        try {
            const res = await api.get(`/performance?studentId=${user.id}`);
            setPerformanceRecords(res.data);
        } catch (err) {
            console.error('Failed to fetch performance records');
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/assignments');
            setAssignments(res.data);
        } catch (err) {
            console.error('Failed to fetch assignments');
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            // Filter for 'all' or 'student'
            setAnnouncements(res.data.filter(a => a.targetRole === 'all' || a.targetRole === 'student'));
        } catch (err) {
            console.error('Failed to fetch announcements');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/users/${user.id}`, profileData);
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to update profile');
        }
    };

    const handleAddAcademicMark = async (e) => {
        e.preventDefault();
        try {
            await api.post('/performance', {
                studentId: user.id,
                ...academicData,
                type: 'academic'
            });
            setAcademicData({ subject: '', examName: '', score: '' });
            fetchPerformance();
            setMsg('Mark added successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to add mark');
        }
    };

    return (
        <DashboardLayout title="Student Dashboard" role="Student">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`btn ${activeTab === 'schedule' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'schedule' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'schedule' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <Calendar size={18} /> Schedule
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`btn ${activeTab === 'profile' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'profile' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'profile' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <User size={18} /> Profile Setup
                </button>
                <button
                    onClick={() => setActiveTab('performance')}
                    className={`btn ${activeTab === 'performance' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'performance' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'performance' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <User size={18} /> Performance
                </button>
                <button
                    onClick={() => setActiveTab('academic')}
                    className={`btn ${activeTab === 'academic' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'academic' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'academic' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <User size={18} /> Academic Marks
                </button>
                <button
                    onClick={() => setActiveTab('assignments')}
                    className={`btn ${activeTab === 'assignments' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'assignments' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'assignments' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <FileText size={18} /> Assignments
                </button>
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`btn ${activeTab === 'announcements' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'announcements' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'announcements' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <Megaphone size={18} /> Announcements
                </button>
            </div>

            {activeTab === 'schedule' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <Calendar size={20} style={{ color: 'var(--primary-color)' }} /> My Schedule
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {classes.length === 0 && <p style={{ color: '#6B7280', gridColumn: '1 / -1' }}>No classes scheduled.</p>}
                        {classes.map(c => (
                            <div key={c.id} style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.25rem', border: '1px solid #374151', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.125rem' }}>{c.subject}</h3>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: c.status === 'scheduled' ? '#064E3B' : '#7F1D1D', color: c.status === 'scheduled' ? '#6EE7B7' : '#FCA5A5' }}>
                                        {c.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '1rem' }}>{new Date(c.time).toLocaleString()}</p>
                                <a
                                    href={c.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '0.5rem', background: '#1F2937', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', textDecoration: 'none', transition: 'background 0.2s' }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'black'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = 'white'; }}
                                >
                                    <Video size={16} /> Join Class
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'performance' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <User size={20} style={{ color: 'var(--primary-color)' }} /> My Performance (Tutor Remarks)
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                                    <th style={{ padding: '0.75rem' }}>Subject</th>
                                    <th style={{ padding: '0.75rem' }}>Score</th>
                                    <th style={{ padding: '0.75rem' }}>Remarks</th>
                                    <th style={{ padding: '0.75rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceRecords.filter(r => r.type !== 'academic').length === 0 && <tr><td colSpan="4" style={{ padding: '0.75rem', color: '#6B7280' }}>No records found.</td></tr>}
                                {performanceRecords.filter(r => r.type !== 'academic').map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                        <td style={{ padding: '0.75rem' }}>{r.subject}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--primary-color)' }}>{r.score}</td>
                                        <td style={{ padding: '0.75rem' }}>{r.remarks}</td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#9CA3AF' }}>{new Date(r.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'academic' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <User size={20} style={{ color: 'var(--primary-color)' }} /> Academic Marks
                    </h2>
                    {msg && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1F2937', color: '#FBBF24', fontSize: '0.875rem', borderRadius: '0.25rem' }}>{msg}</div>}

                    <form onSubmit={handleAddAcademicMark} style={{ marginBottom: '2rem', padding: '1rem', background: '#111827', borderRadius: '0.25rem', border: '1px solid #374151' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'white', marginBottom: '1rem' }}>Add New Mark</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="input-group">
                                <label className="input-label">Exam Name</label>
                                <input
                                    type="text"
                                    value={academicData.examName}
                                    onChange={(e) => setAcademicData({ ...academicData, examName: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. Midterm 1"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Subject</label>
                                <input
                                    type="text"
                                    value={academicData.subject}
                                    onChange={(e) => setAcademicData({ ...academicData, subject: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. Math"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Score (out of 100)</label>
                                <input
                                    type="number"
                                    value={academicData.score}
                                    onChange={(e) => setAcademicData({ ...academicData, score: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. 95"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: 'fit-content' }}>
                            Add Mark
                        </button>
                    </form>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                                    <th style={{ padding: '0.75rem' }}>Exam Name</th>
                                    <th style={{ padding: '0.75rem' }}>Subject</th>
                                    <th style={{ padding: '0.75rem' }}>Score</th>
                                    <th style={{ padding: '0.75rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceRecords.filter(r => r.type === 'academic').length === 0 && <tr><td colSpan="4" style={{ padding: '0.75rem', color: '#6B7280' }}>No academic marks found.</td></tr>}
                                {performanceRecords.filter(r => r.type === 'academic').map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                        <td style={{ padding: '0.75rem' }}>{r.examName}</td>
                                        <td style={{ padding: '0.75rem' }}>{r.subject}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--primary-color)' }}>{r.score}</td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#9CA3AF' }}>{new Date(r.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <FileText size={20} style={{ color: 'var(--primary-color)' }} /> Assignments & Mock Tests
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {assignments.length === 0 && <p style={{ color: '#6B7280', gridColumn: '1 / -1' }}>No assignments found.</p>}
                        {assignments.map(a => (
                            <div key={a.id} style={{ padding: '1rem', background: '#1F2937', borderRadius: '0.25rem', border: '1px solid #374151', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontWeight: 'bold', color: 'white', fontSize: '1.125rem' }}>{a.title}</h3>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: a.type === 'mock_test' ? '#4C1D95' : '#065F46', color: 'white' }}>
                                        {a.type === 'mock_test' ? 'Mock Test' : 'Homework'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '1rem' }}>{a.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Due: {a.dueDate || 'No due date'}</span>
                                    {a.link && (
                                        <a
                                            href={a.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ fontSize: '0.875rem', color: '#60A5FA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                        >
                                            View Resource <FileText size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'announcements' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <Megaphone size={20} style={{ color: 'var(--primary-color)' }} /> Announcements
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {announcements.length === 0 && <p style={{ color: '#6B7280' }}>No announcements found.</p>}
                        {announcements.map(a => (
                            <div key={a.id} style={{ padding: '1rem', background: '#1F2937', borderRadius: '0.25rem', border: '1px solid #374151' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontWeight: 'bold', color: 'white', fontSize: '1.125rem' }}>{a.title}</h3>
                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(a.date).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#D1D5DB', marginBottom: '0.5rem' }}>{a.content}</p>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                    Posted by: {a.authorName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="card" style={{ maxWidth: '600px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <User size={20} style={{ color: 'var(--primary-color)' }} /> Profile Setup
                    </h2>
                    {msg && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1F2937', color: '#FBBF24', fontSize: '0.875rem', borderRadius: '0.25rem' }}>{msg}</div>}
                    <form onSubmit={handleProfileUpdate}>
                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="input-field"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">School Name</label>
                            <input
                                type="text"
                                value={profileData.school}
                                onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                                className="input-field"
                                placeholder="Enter school name"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Class / Grade</label>
                            <input
                                type="text"
                                value={profileData.class}
                                onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
                                className="input-field"
                                placeholder="e.g. 10th Grade"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Place / City</label>
                            <input
                                type="text"
                                value={profileData.place}
                                onChange={(e) => setProfileData({ ...profileData, place: e.target.value })}
                                className="input-field"
                                placeholder="Enter your city"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Parent Name</label>
                            <input
                                type="text"
                                value={profileData.parentName}
                                onChange={(e) => setProfileData({ ...profileData, parentName: e.target.value })}
                                className="input-field"
                                placeholder="Enter parent name"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Parent Phone</label>
                            <input
                                type="tel"
                                value={profileData.parentPhone}
                                onChange={(e) => setProfileData({ ...profileData, parentPhone: e.target.value })}
                                className="input-field"
                                placeholder="Enter parent phone"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            <Save size={18} /> Save Changes
                        </button>
                    </form>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentDashboard;
