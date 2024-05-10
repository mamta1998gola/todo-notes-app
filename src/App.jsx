import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import Header from './components/header'
import AddTodo from './components/addtodo'
import Todos from './components/todos'
import StorageToDo from './components/storageToDo';
import './App.css'
import ErrorRoute from './components/error-route';
import LoginRegister from './components/loginRegister';
import ChangePassowrd from './components/changePassword';

const API = 'http://localhost:8080';

function Root() {
  const [allTodos, setAllTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const fetchTodos = async () => {
    const data = await fetch(`${API}/getAllTodos`);
    const todos = await data.json();

    setAllTodos(todos?.allTodos || []);
    setCompletedTodos(todos?.completedTodos || []);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <Header />
      <div> 
        <Routes>
          <Route path="/" element={<>
            <AddTodo fetchAllTodos={fetchTodos} />
            <Todos
              allTodos={allTodos}
              completedTodos={completedTodos}
              fetchAllTodos={fetchTodos}
            />
          </>}
            errorElement={<ErrorRoute />}
          />
          <Route path="/storage" element={<StorageToDo />} errorElement={<ErrorRoute />} />
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/changepassword" element={<ChangePassowrd />} />
        </Routes>
      </div>
    </>

  )
}

export default Root
