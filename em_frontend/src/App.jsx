import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEmployee from './components/AddEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import EmployeeList from './components/EmployeeList';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { ProtectedRoute } from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route - no Navbar */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes - Navbar only shown when logged in */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <EmployeeList />
          </ProtectedRoute>
        } />

        <Route path="/addEmployee" element={
          <ProtectedRoute>
            <Navbar />
            <AddEmployee />
          </ProtectedRoute>
        } />

        <Route path="/editEmployee/:id" element={
          <ProtectedRoute>
            <Navbar />
            <UpdateEmployee />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar />
            <Profile />
            </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;