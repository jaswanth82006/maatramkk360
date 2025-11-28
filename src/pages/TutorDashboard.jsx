import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Calendar, CheckCircle, XCircle, Video, FileText, Plus, Megaphone, Send } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ClassScheduler from '../components/ClassScheduler';

const TutorDashboard = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestData, setRequestData] = useState({ type: 'cancel', reason: '', newTime: '', newTutorId: '' });
    const [reqMsg, setReqMsg] = useState('');

    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', link: '', dueDate: '', type: 'homework' });
    const [assignMsg, setAssignMsg] = useState('');

    const [tutors, setTutors] = useState([]);
    const [activeTab, setActiveTab] = useState('schedule');

    useEffect(() => {
        fetchClasses();
        fetchStudents();
        fetchTutors();
        fetchAssignments();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            const myClasses = res.data
                .filter(c => c.tutorId === user.id)
                .sort((a, b) => new Date(b.time) - new Date(a.time));
            setClasses(myClasses);
        } catch (err) {
            console.error('Failed to fetch classes');
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await api.get('/users');
            setStudents(res.data.filter(u => u.role === 'student'));
        } catch (err) {
            console.error('Failed to fetch students');
        }
    };

    const fetchTutors = async () => {
        try {
            const res = await api.get('/users');
            setTutors(res.data.filter(u => u.role === 'tutor' && u.id !== user.id));
        } catch (err) {
            console.error('Failed to fetch tutors');
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/assignments');
            setAssignments(res.data.filter(a => a.tutorId === user.id));
        } catch (err) {
            console.error('Failed to fetch assignments');
        }
    };

    const handleMarkAttendance = (studentId, status) => {
        if (!selectedClass) return;
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const saveAttendance = async () => {
        if (!selectedClass) return;
        try {
            const date = new Date().toISOString().split('T')[0];
            const promises = Object.entries(attendance).map(([studentId, status]) =>
                api.post('/attendance', {
                    classId: selectedClass.id,
                    studentId,
                    status,
                    date
                })
            );
            await Promise.all(promises);
            alert('Attendance saved successfully!');
            // Ideally clear attendance state or fetch existing to show saved state, 
            // but for now we keep it to show what was marked.
        } catch (err) {
            console.error('Failed to save attendance');
            alert('Failed to save attendance');
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests', {
                classId: selectedClass.id,
                tutorId: user.id,
                ...requestData
            });
            setReqMsg('Request submitted successfully!');
            setRequestData({ type: 'cancel', reason: '', newTime: '', newTutorId: '' });
            setTimeout(() => setReqMsg(''), 3000);
        } catch (err) {
            setReqMsg('Failed to submit request');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (!selectedClass) {
            alert('Please select a class first');
            return;
        }
        try {
            await api.post('/assignments', {
                classId: selectedClass.id,
                tutorId: user.id,
                ...newAssignment
            });
            setAssignMsg('Assignment created successfully!');
            setNewAssignment({ title: '', description: '', link: '', dueDate: '', type: 'homework' });
            fetchAssignments();
            setTimeout(() => setAssignMsg(''), 3000);
        } catch (err) {
            setAssignMsg('Failed to create assignment');
        }
    };

    return (
        <DashboardLayout title="Tutor Dashboard" role="Tutor">
            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`btn ${activeTab === 'schedule' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'schedule' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'schedule' ? 'black' : 'white', border: '1px solid var(--primary-color)' }}
                >
                    <Calendar size={18} /> Schedule
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
                <>
                    <ClassScheduler users={[]} currentUser={user} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Class List */}
                        <div className="card" style={{ height: 'fit-content' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                <Calendar size={20} style={{ color: 'var(--primary-color)' }} /> My Schedule
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {classes.length === 0 && <p style={{ color: '#6B7280' }}>No classes assigned.</p>}
                                {classes.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedClass(c)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            border: selectedClass?.id === c.id ? '1px solid var(--primary-color)' : '1px solid #374151',
                                            background: selectedClass?.id === c.id ? '#1F2937' : 'var(--bg-color)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <h3 style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{c.subject}</h3>
                                        <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{new Date(c.time).toLocaleString()}</p>
                                        <a
                                            href={c.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#60A5FA', marginTop: '0.5rem', textDecoration: 'none' }}
                                        >
                                            <Video size={12} /> Join Meet
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attendance & Request Area */}
                        <div className="card" style={{ gridColumn: 'span 2' }}>
                            {selectedClass ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>
                                            Mark Attendance: <span style={{ color: 'var(--primary-color)' }}>{selectedClass.subject}</span>
                                        </h2>
                                        <button
                                            onClick={() => setShowRequestForm(!showRequestForm)}
                                            style={{ fontSize: '0.875rem', color: '#F59E0B', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            {showRequestForm ? 'Hide Request Form' : 'Request Change'}
                                        </button>
                                    </div>

                                    {showRequestForm && (
                                        <div className="animate-fade-in" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#111827', borderRadius: '0.25rem', border: '1px solid #374151' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>Request Cancellation or Reschedule</h3>
                                            {reqMsg && <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#FBBF24' }}>{reqMsg}</div>}
                                            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div className="input-group">
                                                    <label className="input-label">Type</label>
                                                    <select
                                                        value={requestData.type}
                                                        onChange={(e) => setRequestData({ ...requestData, type: e.target.value })}
                                                        className="input-field"
                                                    >
                                                        <option value="cancel">Cancel Class</option>
                                                        <option value="reschedule">Reschedule</option>
                                                        <option value="swap">Swap Class</option>
                                                    </select>
                                                </div>
                                                {requestData.type === 'reschedule' && (
                                                    <div className="input-group">
                                                        <label className="input-label">New Time</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={requestData.newTime}
                                                            onChange={(e) => setRequestData({ ...requestData, newTime: e.target.value })}
                                                            className="input-field"
                                                            required
                                                        />
                                                    </div>
                                                )}
                                                {requestData.type === 'swap' && (
                                                    <div className="input-group">
                                                        <label className="input-label">Select New Tutor</label>
                                                        <select
                                                            value={requestData.newTutorId || ''}
                                                            onChange={(e) => setRequestData({ ...requestData, newTutorId: e.target.value })}
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
                                                <div className="input-group">
                                                    <label className="input-label">Reason</label>
                                                    <textarea
                                                        value={requestData.reason}
                                                        onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                                                        className="input-field"
                                                        rows="2"
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                                                    Submit Request
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                                        <table style={{ width: '100%', textAlign: 'left' }}>
                                            <thead>
                                                <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                                                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map(s => (
                                                    <tr key={s.id} style={{ borderBottom: '1px solid #1F2937' }}>
                                                        <td style={{ padding: '0.75rem' }}>{s.name}</td>
                                                        <td style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => handleMarkAttendance(s.id, 'present')}
                                                                style={{ padding: '0.5rem', borderRadius: '0.25rem', background: attendance[s.id] === 'present' ? 'rgba(16, 185, 129, 0.2)' : 'none', border: 'none', cursor: 'pointer', color: '#10B981' }}
                                                                title="Present"
                                                            >
                                                                <CheckCircle />
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkAttendance(s.id, 'absent')}
                                                                style={{ padding: '0.5rem', borderRadius: '0.25rem', background: attendance[s.id] === 'absent' ? 'rgba(239, 68, 68, 0.2)' : 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                                                                title="Absent"
                                                            >
                                                                <XCircle />
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                            {attendance[s.id] ? (
                                                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: attendance[s.id] === 'present' ? '#064E3B' : '#7F1D1D', color: attendance[s.id] === 'present' ? '#6EE7B7' : '#FCA5A5' }}>
                                                                    {attendance[s.id].toUpperCase()}
                                                                </span>
                                                            ) : (
                                                                <span style={{ fontSize: '0.75rem', color: '#4B5563' }}>Pending</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={saveAttendance}
                                            className="btn btn-primary"
                                            disabled={Object.keys(attendance).length === 0}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                    Select a class to mark attendance or manage requests
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'assignments' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <FileText size={20} style={{ color: 'var(--primary-color)' }} /> Assignments & Mock Tests
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Create Assignment Form */}
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Create New Assignment</h3>
                            {assignMsg && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1F2937', color: '#FBBF24', fontSize: '0.875rem', borderRadius: '0.25rem' }}>{assignMsg}</div>}
                            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Type</label>
                                    <select
                                        value={newAssignment.type}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="homework">Homework</option>
                                        <option value="mock_test">Mock Test</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Title</label>
                                    <input
                                        type="text"
                                        value={newAssignment.title}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g. Algebra Worksheet 1"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        value={newAssignment.description}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                        className="input-field"
                                        rows="2"
                                        placeholder="Instructions..."
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Link (optional)</label>
                                    <input
                                        type="url"
                                        value={newAssignment.link}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, link: e.target.value })}
                                        className="input-field"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Due Date</label>
                                    <input
                                        type="date"
                                        value={newAssignment.dueDate}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={!selectedClass}>
                                    <Plus size={18} /> Create Assignment
                                </button>
                                {!selectedClass && <p style={{ fontSize: '0.75rem', color: '#EF4444' }}>Select a class above to assign this to.</p>}
                            </form>
                        </div>

                        {/* List of Assignments */}
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Recent Assignments</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {assignments.length === 0 && <p style={{ color: '#6B7280' }}>No assignments created yet.</p>}
                                {assignments.map(a => (
                                    <div key={a.id} style={{ padding: '1rem', background: '#1F2937', borderRadius: '0.25rem', border: '1px solid #374151' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ fontWeight: 'bold', color: 'white' }}>{a.title}</h4>
                                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: a.type === 'mock_test' ? '#4C1D95' : '#065F46', color: 'white' }}>
                                                {a.type === 'mock_test' ? 'Mock Test' : 'Homework'}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: '0.5rem 0' }}>{a.description}</p>
                                        {a.link && (
                                            <a href={a.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem', color: '#60A5FA', display: 'block', marginBottom: '0.5rem' }}>
                                                View Resource
                                            </a>
                                        )}
                                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Due: {a.dueDate || 'No due date'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'announcements' && (
                <AnnouncementManager user={user} />
            )}
        </DashboardLayout>
    );
};
const AnnouncementManager = ({ user }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnn, setNewAnn] = useState({ title: '', content: '', targetRole: 'student' });
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
                authorId: user.id,
                authorName: user.name,
                ...newAnn
            });
            setMsg('Announcement posted!');
            setNewAnn({ title: '', content: '', targetRole: 'student' });
            fetchAnnouncements();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to post announcement');
        }
    };

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                <Megaphone size={20} style={{ color: 'var(--primary-color)' }} /> Announcements
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Post to Students</h3>
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
                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(a.date).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: '0.5rem 0' }}>{a.content}</p>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                    Posted by: {a.authorName} | To: {a.targetRole.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;
