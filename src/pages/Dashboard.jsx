import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');
  

  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  // fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []); // runs once on mount

  async function fetchTasks() {
    try {
      const response = await axios.get(
        `${API_URL}/api/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` }
          // sending JWT token — backend verifyToken reads this
        }
      );
      setTasks(response.data.tasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/tasks`,
        { title, priority, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(prev => [response.data.task, ...prev]);
      setTitle(''); // clear input
      setPriority('medium'); //set to default priority
      setDescription('');

    } catch (err) {
      setError('Failed to add task');
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(
        `${API_URL}/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const response = await axios.put(
       `${API_URL}/api/tasks/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev =>
        prev.map(t => t._id === id ? response.data.task : t)
      );
    } catch (err) {
      setError('Failed to update task');
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // filter tasks
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  if (loading) return <div style={styles.center}>Loading tasks...</div>;

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>DevTask</h1>
        <div style={styles.userInfo}>
          <span>Hello, {user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>

        {error && <p style={styles.error}>{error}</p>}

        {/* Add task form */}
        <form onSubmit={handleAddTask} style={styles.addForm}>
          <div style={styles.formTop}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Add a new task..."
              style={styles.addInput}
            />
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              style={styles.prioritySelect}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" style={styles.addBtn}>
              Add Task
            </button>
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)..."
            style={styles.textarea}
            rows={2}
          />
        </form>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{tasks.length}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {tasks.filter(t => t.status === 'todo').length}
            </span>
            <span style={styles.statLabel}>Todo</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {tasks.filter(t => t.status === 'in-progress').length}
            </span>
            <span style={styles.statLabel}>In Progress</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {tasks.filter(t => t.status === 'done').length}
            </span>
            <span style={styles.statLabel}>Done</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div style={styles.filters}>
          {['all', 'todo', 'in-progress', 'done'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? '#534AB7' : '#f0f0f0',
                color: filter === f ? 'white' : '#333',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task list */}
        {filteredTasks.length === 0
          ? <p style={styles.empty}>No tasks found.</p>
          : filteredTasks.map(task => (
           <div key={task._id} style={styles.taskCard}>
              <div style={styles.taskLeft}>
                <div>
                  <h3 style={styles.taskTitle}>{task.title}</h3>
                  {task.description && (
                    <p style={styles.taskDesc}>{task.description}</p>
                  )}
                </div>
                <span style={{...styles.badge,
                  background: task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#dcfce7',
                  color: task.priority === 'high' ? '#991b1b' : task.priority === 'medium' ? '#92400e' : '#166534',
                }}>
                  {task.priority}
                </span>
              </div>
              <div style={styles.taskRight}>
                <select
                  value={task.status}
                  onChange={e => handleStatusChange(task._id, e.target.value)}
                  style={styles.select}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={() => handleDelete(task._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  header: { background: '#534AB7', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', margin: 0 },
  userInfo: { display: 'flex', alignItems: 'center', gap: '16px', color: 'white' },
  logoutBtn: { padding: '6px 16px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '6px', cursor: 'pointer' },
  content: { maxWidth: '700px', margin: '0 auto', padding: '24px' },
  error: { color: 'red', marginBottom: '16px' },
  addForm: { display: 'flex', gap: '0px', marginBottom: '24px',flexDirection: 'column' },
  addInput: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  addBtn: { padding: '10px 20px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  stat: { background: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '4px' },
  statNum: { fontSize: '28px', fontWeight: '600', color: '#534AB7' },
  statLabel: { fontSize: '12px', color: '#666' },
  filters: { display: 'flex', gap: '8px', marginBottom: '16px' },
  filterBtn: { padding: '6px 16px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  taskCard: { background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  taskLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  taskTitle: { margin: 0, fontSize: '15px' },
  badge: { padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  taskRight: { display: 'flex', gap: '8px', alignItems: 'center' },
  select: { padding: '6px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' },
  deleteBtn: { padding: '6px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  empty: { textAlign: 'center', color: '#666', padding: '40px' },
  prioritySelect: {padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer', background: 'white'},
  formTop: { display: 'flex', gap: '8px', marginBottom: '8px'},
  textarea: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit'},
  taskDesc: { fontSize: '13px', color: '#666', margin: '4px 0 0 0', lineHeight: '1.4',}
};

export default Dashboard;