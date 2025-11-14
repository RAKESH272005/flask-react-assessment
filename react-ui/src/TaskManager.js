
#new file added for task 2 react Frontend

// react-ui/src/TaskManager.js
import React, { useState, useEffect } from 'react';

// Basic inline styling
const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' },
  form: { display: 'flex', marginBottom: '20px' },
  input: { flexGrow: 1, padding: '10px', fontSize: '16px' },
  button: { padding: '10px 15px', fontSize: '16px', marginLeft: '10px' },
  list: { listStyle: 'none', padding: 0 },
  taskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' },
  taskText: { fontSize: '18px' },
  editForm: { display: 'flex', flexGrow: 1 },
};

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null); // The task object being edited
  const [editText, setEditText] = useState(''); // The text in the edit input

  // 1. [READ] Fetch tasks
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  // 2. [CREATE] Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle })
    })
    .then(res => res.json())
    .then(newTask => {
      setTasks([newTask, ...tasks]); // Add to top of the list
      setNewTaskTitle('');
    })
    .catch(err => console.error("Error adding task:", err));
  };

  // 3. [DELETE] Delete a task
  const handleDeleteTask = (taskId) => {
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setTasks(tasks.filter(task => task.id !== taskId));
        }
      })
      .catch(err => console.error("Error deleting task:", err));
  };

  // 4. [UPDATE] Save an edited task
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTask || !editText.trim()) return;

    fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText })
    })
    .then(res => res.json())
    .then(updatedTask => {
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      setEditingTask(null);
      setEditText('');
    })
    .catch(err => console.error("Error updating task:", err));
  };

  // Helper functions for editing state
  const startEditing = (task) => {
    setEditingTask(task);
    setEditText(task.title);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditText('');
  };

  return (
    <div style={styles.container}>
      <h1>Task Manager</h1>

      <form onSubmit={handleAddTask} style={styles.form}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add</button>
      </form>

      <ul style={styles.list}>
        {tasks.map(task => (
          <li key={task.id} style={styles.taskItem}>
            {editingTask && editingTask.id === task.id ? (
              // --- EDITING VIEW ---
              <form onSubmit={handleSaveEdit} style={styles.editForm}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>Save</button>
                <button type="button" onClick={cancelEditing} style={{...styles.button, backgroundColor: '#eee'}}>Cancel</button>
              </form>
            ) : (
              // --- DEFAULT VIEW ---
              <>
                <span style={styles.taskText}>{task.title}</span>
                <div>
                  <button onClick={() => startEditing(task)} style={{...styles.button, backgroundColor: 'orange'}}>Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)} style={{...styles.button, backgroundColor: 'red', color: 'white'}}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
