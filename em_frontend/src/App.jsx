import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEmployee from './components/AddEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import EmployeeList from './components/EmployeeList';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route index element={<EmployeeList />} />
          
          <Route path="/addEmployee" element={<AddEmployee />} />
          
          <Route path="/editEmployee/:id" element={<UpdateEmployee />} />
          
          <Route path="/profile" element={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Profile Page</h1>
                <p className="text-slate-400">Coming soon...</p>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;