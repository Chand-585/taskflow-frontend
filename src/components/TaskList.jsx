import { useState } from 'react';
import Task from './Task';
import AddTask from './AddTask';

function TaskList() {
  const [filter, setFilter] = useState('all');

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn Node.js',  status: 'done',        priority: 'high'   },
    { id: 2, title: 'Build DevTask',  status: 'in-progress', priority: 'high'   },
    { id: 3, title: 'Learn React',    status: 'todo',        priority: 'medium' },
  ]);

  function handleAdd(title) {
    const newTask = {
      id: tasks.length + 1,
      title,
      status: 'todo',
      priority: 'medium',
    };
    setTasks([...tasks, newTask]); // spread existing + add new
  }
  // filter tasks based on current filter value
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter);

  return (
    <div>
      <h2>My Tasks ({tasks.length})</h2>
      <AddTask onAdd={handleAdd} />

      <div style={{ margin: '16px 0' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('todo')}>Todo</button>
        <button onClick={() => setFilter('in-progress')}>In Progress</button>
        <button onClick={() => setFilter('done')}>Done</button>
      </div>

      {filteredTasks.map(task => (
        <Task key={task.id} {...task} />
      ))}

      {filteredTasks.length === 0 && <p>No tasks found.</p>}
    </div>
  );
}

export default TaskList;