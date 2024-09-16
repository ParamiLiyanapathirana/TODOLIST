
import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';

function Home() {
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({ id: null, task: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from the backend
  const fetchTodos = () => {
    axios.get('http://localhost:3001/get')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err));
  };

  // Handle edit button click
  const handleEditClick = (todo) => {
    setIsEditing(true);
    setCurrentTodo({ id: todo._id, task: todo.task });
  };

  // Handle edit form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/update/${currentTodo.id}`, { task: currentTodo.task })
      .then(result => {
        setIsEditing(false);
        fetchTodos();  // Refetch todos after updating
      })
      .catch(err => console.log(err));
  };

  // Handle delete button click
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(result => {
        fetchTodos();  // Refetch todos after deletion
      })
      .catch(err => console.log(err));
  };

  // Handle input change in the edit form
  const handleInputChange = (e) => {
    setCurrentTodo({ ...currentTodo, task: e.target.value });
  };

  return (
    <div className='home'>
      <h2>To Do List</h2>
      <Create />

      {todos.length === 0 ?
        <div><h2>No Record</h2></div>
        :
        todos.map(todo => (
          <div className='task' key={todo._id}>
            <div>
              <p>{todo.task}</p>
            </div>
            <div className="task-actions">
              {/* Edit Button */}
              <button onClick={() => handleEditClick(todo)} className="edit-btn">Edit</button>
              
              {/* Delete Button */}
              <button onClick={() => handleDelete(todo._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))
      }

      {/* Show the edit form if editing */}
      {isEditing && (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={currentTodo.task}
            onChange={handleInputChange}
          />
          <button type="submit">Update Task</button>
        </form>
      )}
    </div>
  );
}

export default Home;
