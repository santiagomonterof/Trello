import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BoardList from './pages/boards/BoardList';
import BoardForm from './pages/boards/BoardForm';
import BoardMove from './pages/boards/BoardMove';
import RosterForm from './pages/rosters/RosterForm';
import TaskForm from './pages/tasks/TaskForm';
import AddForm from './pages/boards/AddForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/board/list",
    element: <BoardList />,
  },
  {
    path: "/board/create",
    element: <BoardForm />,
  },
  {
    path: "/board/edit/:id",
    element: <BoardForm />,
  },
  {
    path: "/board/element/:id",
    element: <BoardMove />,
  },
  {
    path: "/board/addFriend/:id",
    element: <AddForm />,
  },
  {
    path: "/roster/create",
    element: <RosterForm />,
  },
  {
    path: "/roster/edit/:id",
    element: <RosterForm />,
  },
  {
    path: "/task/create",
    element: <TaskForm />,
  },
  {
    path: "/task/edit/:id",
    element: <TaskForm />,
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
