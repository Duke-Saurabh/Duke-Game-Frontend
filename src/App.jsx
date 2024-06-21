import React from 'react';
import './App.css';
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import Layout from './Layout';
import { Login, Register } from './Pages/Index';
import JoinGame from './Pages/Users.Login/Logined/Game/JoinGame';
import PlayGame from './Pages/Users.Login/Logined/Game/PlayGame';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="game" element={<JoinGame />}>
       
      </Route>
      <Route path="play" element={<PlayGame />} />
      <Route path="*" element={<Register />} />
    </Route>
  )
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
