import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { UserPlus, Users, Calendar, Eye, Megaphone, Send, BarChart2, LayoutDashboard, UserCog } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ClassScheduler from '../components/ClassScheduler';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student' });
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            const roleOrder = { admin: 1, tutor: 2, student: 3 };
            const sortedUsers = res.data.sort((a, b) => {
                const roleDiff = (roleOrder[a.role] || 4) - (roleOrder[b.role] || 4);
                if (roleDiff !== 0) return roleDiff;
                return a.name.localeCompare(b.name);
            });
            setUsers(sortedUsers);
        } catch (err) {
            console.error('Failed to fetch users');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', newUser);
            setMessage('User added successfully!');
            setNewUser({ name: '', email: '', password: '', role: 'student' });
            fetchUsers();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to add user');
        }
    };

    const tutorsCount = users.filter(u => u.role === 'tutor').length;
    const studentsCount = users.filter(u => u.role === 'student').length;

    return (
        <DashboardLayout title="Admin Dashboard" role="Admin">
            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'overview' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'overview' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <LayoutDashboard size={18} /> Overview
                </button>

                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`btn ${activeTab === 'schedule' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'schedule' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'schedule' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <Calendar size={18} /> Schedule
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`btn ${activeTab === 'analytics' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'analytics' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'analytics' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <BarChart2 size={18} /> Analytics
                </button>
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`btn ${activeTab === 'announcements' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'announcements' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'announcements' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <Megaphone size={18} /> Announcements
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '50%' }}>
                                <Users size={32} style={{ color: 'var(--primary-color)' }} />
                            </div>
                            <div>
                                <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Total Tutors</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{tutorsCount}</h3>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}>
                                <Users size={32} style={{ color: '#60A5FA' }} />
                            </div>
                            <div>
                                <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Total Students</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{studentsCount}</h3>
                            </div>
                        </div>
                    </div>

                    {/* User Management Section */}
                    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Add User Form */}
                        <div className="card">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                <UserPlus size={20} style={{ color: 'var(--primary-color)' }} /> Add New User
                            </h2>
                            {message && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1F2937', color: '#FBBF24', fontSize: '0.875rem', borderRadius: '0.25rem' }}>{message}</div>}
                            <form onSubmit={handleAddUser}>
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <input
                                        type="text"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="student">Student</option>
                                        <option value="tutor">Tutor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    Add User
                                </button>
                            </form>
                        </div>

                        {/* User List */}
                        <div className="card">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                <Users size={20} style={{ color: 'var(--primary-color)' }} /> Existing Users
                            </h2>
                            <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                                            <th style={{ padding: '0.5rem' }}>Name</th>
                                            <th style={{ padding: '0.5rem' }}>Role</th>
                                            <th style={{ padding: '0.5rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                                <td style={{ padding: '0.5rem' }}>{u.name}</td>
                                                <td style={{ padding: '0.5rem', textTransform: 'capitalize', color: 'var(--primary-color)' }}>{u.role}</td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <button
                                                        onClick={() => window.location.href = `/admin/user/${u.id}`}
                                                        style={{ background: 'transparent', border: 'none', color: '#60A5FA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                    >
                                                        <Eye size={16} /> Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        <TutorOverview />
                        <StudentOverview />
                    </div>
                    <RequestManager />
                </>
            )}


            {/* Schedule Tab */}
            {
                activeTab === 'schedule' && (
                    <ClassScheduler users={users} currentUser={{ role: 'admin' }} />
                )
            }

            {/* Announcements Tab */}
            {
                activeTab === 'announcements' && (
                    <AnnouncementManager />
                )
            }

            {/* Analytics Tab */}
            {
                activeTab === 'analytics' && (
                    <AnalyticsDashboard />
                )
            }
        </DashboardLayout >
    );
};

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnn, setNewAnn] = useState({ title: '', content: '', targetRole: 'all' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (err) {
            console.error('Failed to fetch announcements');
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements', {
                authorId: 'admin',
                authorName: 'Admin',
                ...newAnn
            });
            setMsg('Announcement posted!');
            setNewAnn({ title: '', content: '', targetRole: 'all' });
            fetchAnnouncements();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to post announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error('Failed to delete announcement');
        }
    };

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                <Megaphone size={20} style={{ color: 'var(--primary-color)' }} /> Announcements
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Post New Announcement</h3>
                    {msg && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1F2937', color: '#FBBF24', fontSize: '0.875rem', borderRadius: '0.25rem' }}>{msg}</div>}
                    <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Title</label>
                            <input
                                type="text"
                                value={newAnn.title}
                                onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Content</label>
                            <textarea
                                value={newAnn.content}
                                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                                className="input-field"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Target Audience</label>
                            <select
                                value={newAnn.targetRole}
                                onChange={(e) => setNewAnn({ ...newAnn, targetRole: e.target.value })}
                                className="input-field"
                            >
                                <option value="all">All Users</option>
                                <option value="student">Students Only</option>
                                <option value="tutor">Tutors Only</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <Send size={18} /> Post Announcement
                        </button>
                    </form>
                </div>

                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Recent Announcements</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {announcements.length === 0 && <p style={{ color: '#6B7280' }}>No announcements yet.</p>}
                        {announcements.map(a => (
                            <div key={a.id} style={{ padding: '1rem', background: '#1F2937', borderRadius: '0.25rem', border: '1px solid #374151' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ fontWeight: 'bold', color: 'white' }}>{a.title}</h4>
                                    <button onClick={() => handleDelete(a.id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: '0.5rem 0' }}>{a.content}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280' }}>
                                    <span>To: {a.targetRole.toUpperCase()}</span>
                                    <span>{new Date(a.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RequestManager = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests');
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch requests');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/requests/${id}`, { status });
            fetchRequests();
        } catch (err) {
            console.error('Failed to update request');
        }
    };

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Pending Requests</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                            <th style={{ padding: '0.75rem' }}>Tutor</th>
                            <th style={{ padding: '0.75rem' }}>Type</th>
                            <th style={{ padding: '0.75rem' }}>Reason</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 && <tr><td colSpan="5" style={{ padding: '0.75rem', color: '#6B7280' }}>No requests found.</td></tr>}
                        {requests.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                <td style={{ padding: '0.75rem' }}>{r.tutorName || r.tutorId}</td>
                                <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{r.type}</td>
                                <td style={{ padding: '0.75rem' }}>{r.reason}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', background: r.status === 'approved' ? '#064E3B' : r.status === 'rejected' ? '#7F1D1D' : '#78350F', color: r.status === 'approved' ? '#6EE7B7' : r.status === 'rejected' ? '#FCA5A5' : '#FCD34D' }}>
                                        {r.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    {r.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleStatusUpdate(r.id, 'approved')}
                                                style={{ background: '#059669', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(r.id, 'rejected')}
                                                style={{ background: '#DC2626', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TutorOverview = () => {
    const [tutors, setTutors] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, classesRes] = await Promise.all([
                api.get('/users'),
                api.get('/classes')
            ]);
            // Duplicate data for demo purposes if few tutors
            let fetchedTutors = usersRes.data.filter(u => u.role === 'tutor');
            if (fetchedTutors.length > 0 && fetchedTutors.length < 5) {
                const original = [...fetchedTutors];
                fetchedTutors = [...original, ...original, ...original].slice(0, 5).map((t, i) => ({ ...t, id: t.id + '_dup_' + i }));
            }
            setTutors(fetchedTutors);
            setClasses(classesRes.data);
        } catch (err) {
            console.error('Failed to fetch data');
        }
    };

    const getStats = (tutorId) => {
        const realId = tutorId.split('_dup_')[0];
        const tutorClasses = classes.filter(c => c.tutorId === realId);
        const now = new Date();
        const completed = tutorClasses.filter(c => new Date(c.time) < now && c.status !== 'cancelled').length;
        const upcoming = tutorClasses.filter(c => new Date(c.time) > now && c.status !== 'cancelled').length;
        return { total: tutorClasses.length, completed, upcoming };
    };

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Tutor Overview</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                            <th style={{ padding: '0.75rem' }}>Tutor Name</th>
                            <th style={{ padding: '0.75rem' }}>Total Assigned</th>
                            <th style={{ padding: '0.75rem' }}>Completed</th>
                            <th style={{ padding: '0.75rem' }}>Upcoming</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutors.length === 0 && <tr><td colSpan="4" style={{ padding: '0.75rem', color: '#6B7280' }}>No tutors found.</td></tr>}
                        {tutors.map(t => {
                            const stats = getStats(t.id);
                            return (
                                <tr key={t.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{t.name}</td>
                                    <td style={{ padding: '0.75rem' }}>{stats.total}</td>
                                    <td style={{ padding: '0.75rem', color: '#10B981' }}>{stats.completed}</td>
                                    <td style={{ padding: '0.75rem', color: '#F59E0B' }}>{stats.upcoming}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StudentOverview = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, attRes] = await Promise.all([
                api.get('/users'),
                api.get('/attendance')
            ]);
            // Duplicate data for demo purposes if few students
            let fetchedStudents = usersRes.data.filter(u => u.role === 'student');
            if (fetchedStudents.length > 0 && fetchedStudents.length < 5) {
                const original = [...fetchedStudents];
                fetchedStudents = [...original, ...original, ...original].slice(0, 5).map((s, i) => ({ ...s, id: s.id + '_dup_' + i }));
            }
            setStudents(fetchedStudents);
            setAttendance(attRes.data);
        } catch (err) {
            console.error('Failed to fetch data');
        }
    };

    const getStats = (studentId) => {
        const realId = studentId.split('_dup_')[0];
        const studentAtt = attendance.filter(a => a.studentId === realId);
        const total = studentAtt.length;
        const present = studentAtt.filter(a => a.status === 'present').length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        const lastClass = studentAtt.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return { percentage, lastStatus: lastClass ? lastClass.status : 'N/A' };
    };

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Student Overview</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                            <th style={{ padding: '0.75rem' }}>Student Name</th>
                            <th style={{ padding: '0.75rem' }}>Attendance</th>
                            <th style={{ padding: '0.75rem' }}>Last Class</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 && <tr><td colSpan="3" style={{ padding: '0.75rem', color: '#6B7280' }}>No students found.</td></tr>}
                        {students.map(s => {
                            const stats = getStats(s.id);
                            return (
                                <tr key={s.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{s.name}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '60px', height: '6px', background: '#374151', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${stats.percentage}%`, height: '100%', background: stats.percentage >= 75 ? '#10B981' : stats.percentage >= 50 ? '#FBBF24' : '#EF4444' }} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{stats.percentage}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.75rem',
                                            background: stats.lastStatus === 'present' ? 'rgba(16, 185, 129, 0.2)' : stats.lastStatus === 'absent' ? 'rgba(239, 68, 68, 0.2)' : '#374151',
                                            color: stats.lastStatus === 'present' ? '#10B981' : stats.lastStatus === 'absent' ? '#EF4444' : '#9CA3AF'
                                        }}>
                                            {stats.lastStatus.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnalyticsDashboard = () => {
    const [attendanceStats, setAttendanceStats] = useState({ total: 0, present: 0, percentage: 0 });
    const [performanceStats, setPerformanceStats] = useState({ avgScore: 0, totalTests: 0 });
    const [subjectPerformance, setSubjectPerformance] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [attRes, perfRes] = await Promise.all([
                api.get('/attendance'),
                api.get('/performance')
            ]);

            // Attendance Stats
            const attendance = attRes.data;
            const totalAtt = attendance.length;
            const presentAtt = attendance.filter(a => a.status === 'present').length;
            const attPercentage = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 0;
            setAttendanceStats({ total: totalAtt, present: presentAtt, percentage: attPercentage });

            // Performance Stats
            const performance = perfRes.data.filter(p => p.type === 'academic');
            const totalTests = performance.length;
            const totalScore = performance.reduce((acc, curr) => acc + Number(curr.score), 0);
            const avgScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
            setPerformanceStats({ avgScore, totalTests });

            // Subject Breakdown
            const subjects = {};
            performance.forEach(p => {
                if (!subjects[p.subject]) subjects[p.subject] = { total: 0, count: 0 };
                subjects[p.subject].total += Number(p.score);
                subjects[p.subject].count += 1;
            });
            const subjectData = Object.entries(subjects).map(([sub, data]) => ({
                subject: sub,
                avg: Math.round(data.total / data.count)
            }));
            setSubjectPerformance(subjectData);

        } catch (err) {
            console.error('Failed to fetch analytics');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', color: '#9CA3AF' }}>Overall Attendance</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: '0.5rem 0' }}>
                        {attendanceStats.percentage}%
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{attendanceStats.present} / {attendanceStats.total} Sessions</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', color: '#9CA3AF' }}>Avg Academic Score</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60A5FA', margin: '0.5rem 0' }}>
                        {performanceStats.avgScore}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Across {performanceStats.totalTests} Tests</p>
                </div>
            </div>

            {/* Charts Area */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'white' }}>Subject Performance</h2>
                {subjectPerformance.length === 0 ? (
                    <p style={{ color: '#6B7280' }}>No academic data available.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {subjectPerformance.map(s => (
                            <div key={s.subject}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'white' }}>{s.subject}</span>
                                    <span style={{ color: '#9CA3AF' }}>{s.avg}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: `${s.avg}%`,
                                            height: '100%',
                                            background: s.avg >= 80 ? '#10B981' : s.avg >= 60 ? '#FBBF24' : '#EF4444',
                                            transition: 'width 0.5s ease-in-out'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
