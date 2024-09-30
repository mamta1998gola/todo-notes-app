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
      const data = await fetch(`${API}/getAllTodos/${user.email}`);
      const todos = await data.json();

      setAllTodos(todos?.allTodos || []);
      setCompletedTodos(todos?.completedTodos || []);
    }
  }

  const getUserData = async () => {
    const data = await fetch(`${API}/userdata`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      credentials: 'include',
      body: JSON.stringify({ token: JSON.parse(sessionStorage.getItem('token')) ?? '' })
    });

    const userData = await data.json();
    setUser(prev => ({
      ...prev,
      email: userData.data.email
    }));
  }

  useEffect(() => {
    if (user.email !== '') {
      fetchTodos();
    } else {
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
