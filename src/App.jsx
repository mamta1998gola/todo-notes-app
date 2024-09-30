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
import PrivateRoutes from './authroute';
import { MyContext } from './MyContext';
import UserGreeting from './components/userGreetings';

const API = import.meta.env.VITE_API_URL;

function Root() {
  const [user, setUser] = useState({ 'username': '', 'email': '', 'password': '' })
  const [allTodos, setAllTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const fetchTodos = async () => {
    if (user?.email) {
      fetch(`${API}/getAllTodos`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email: user.email })
      })
        .then(res => res.json())
        .then(todos => {
          setAllTodos(todos?.allTodos || []);
          setCompletedTodos(todos?.completedTodos || []);
        });
    }
  }

  const getUserData = () => {
    if (sessionStorage.getItem('token')) {
      fetch(`${API}/userdata`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ token: JSON.parse(sessionStorage.getItem('token')) ?? '' })
      })
        .then(res => res.json())
        .then(response => {
          setUser(prev => ({
            ...prev,
            email: response.data.email
          }));
        })
        .catch(err => { throw new Error(err) })
    }
  }

  useEffect(() => {
    fetch('https://to-do-server-app.vercel.app/test-cors', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

    if (user.email !== '') {
      fetchTodos();
    } else if (sessionStorage.getItem('token')) {
      getUserData();
    }
  }, [user.email]);

  return (
    <MyContext.Provider value={{ user, setUser }}>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/todo" element={<PrivateRoutes>
            <UserGreeting />
            <AddTodo fetchAllTodos={fetchTodos} />
            <Todos
              allTodos={allTodos}
              completedTodos={completedTodos}
              fetchAllTodos={fetchTodos}
            />
          </PrivateRoutes>}
            errorElement={<ErrorRoute />}
          />
          <Route path="/storage" element={<PrivateRoutes><StorageToDo /></PrivateRoutes>} errorElement={<ErrorRoute />} />
          <Route path="/changepassword" element={<ChangePassowrd />} />
        </Routes>
      </div>
    </MyContext.Provider>
  )
}

export default Root
