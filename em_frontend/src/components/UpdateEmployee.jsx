import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../service/EmployeeService';
import { User, Mail, Phone, Briefcase, Building2, ArrowLeft, Save } from 'lucide-react';

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    id: id,
    name: "",
    phone: "",
    email: "",
    department: "Engineering",
    position: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [notification, setNotification] = useState(null);

  const departments = ['Engineering', 'Medical', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      try {
        const response = await EmployeeService.getEmployeeById(id);
        setEmployee(response.data);
      } catch (error) {
        console.log(error);
        showNotification('Failed to fetch employee data', 'error');
      }
      setFetchingData(false);
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmployee({ ...employee, [e.target.name]: value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!employee.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!employee.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!employee.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10,}$/.test(employee.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    if (!employee.position?.trim()) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateEmployee = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    EmployeeService.updateEmployee(employee, id)
      .then((response) => {
        showNotification('Employee updated successfully!');
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        showNotification('Failed to update employee', 'error');
        setLoading(false);
      });
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-all mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Employee List</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Update Employee</h1>
              <p className="text-slate-400">Modify employee information</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 px-8 py-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Employee Information</h2>
            <p className="text-sm text-slate-400 mt-1">Update the details for {employee.name}</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Full Name *</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border ${
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address *</span>
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number *</span>
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border ${
                    errors.phone ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Department *</span>
                  </div>
                </label>
                <select
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Position *</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="position"
                  value={employee.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border ${
                    errors.position ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.position && <p className="mt-1 text-sm text-red-400">{errors.position}</p>}
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-700">
              <button
                onClick={updateEmployee}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Employee</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/")}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployee;