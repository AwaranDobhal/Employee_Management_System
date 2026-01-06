import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../service/EmployeeService';
import { Search, Plus, Edit2, Trash2, X, Mail, Phone, User, Filter, Download, Eye } from 'lucide-react';

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [notification, setNotification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const navigate = useNavigate();
  const departments = ['Engineering', 'Medical', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortEmployees();
  }, [employees, searchTerm, selectedDepartment, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await EmployeeService.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.log(error);
      showNotification('Failed to fetch employees', 'error');
    }
    setLoading(false);
  };

  const filterAndSortEmployees = () => {
    let filtered = employees.filter(emp => {
      const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.phone?.includes(searchTerm);
      const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'department') return (a.department || '').localeCompare(b.department || '');
      return 0;
    });

    setFilteredEmployees(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteEmployee = (e, id) => {
    e.preventDefault();
    EmployeeService.deleteEmployeeById(id)
      .then(() => {
        if (employees) {
          setEmployees((prevElement) => {
            return prevElement.filter((employee) => employee.id !== id);
          });
        }
        showNotification('Employee deleted successfully');
        setShowDeleteConfirm(false);
        setEmployeeToDelete(null);
      })
      .catch((error) => {
        console.log(error);
        showNotification('Failed to delete employee', 'error');
      });
  };

  const editEmployee = (e, id) => {
    e.preventDefault();
    navigate(`/editEmployee/${id}`);
  };

  const viewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Position'];
    const rows = filteredEmployees.map(emp => [
      emp.name || '',
      emp.email || '',
      emp.phone || '',
      emp.department || '',
      emp.position || ''
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    showNotification('Data exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Actions */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => navigate("/addEmployee")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="department">Sort by Department</option>
            </select>

            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="text-slate-400 text-sm">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>

        {/* Employee Cards/List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-16">
            <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">No employees found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {employee.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                      <p className="text-sm text-slate-400">{employee.position || "No Position Assigned"}</p>
                    </div>
                  </div>
                  {employee.department && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      {employee.department}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => viewEmployee(employee)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => editEmployee(e, employee.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setEmployeeToDelete(employee);
                      setShowDeleteConfirm(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {employee.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-white font-medium">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">{employee.email}</div>
                      <div className="text-sm text-slate-400">{employee.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {employee.department ? (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {employee.department}
                        </span>
                      ) : (
                        <span className="text-slate-500">{N/A}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{employee.position || "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewEmployee(employee)}
                          className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => editEmployee(e, employee.id)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEmployeeToDelete(employee);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Employee Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {selectedEmployee.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedEmployee.name}</h3>
                  <p className="text-slate-400">{selectedEmployee.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <div className="flex items-center space-x-2 text-white">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{selectedEmployee.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                  <div className="flex items-center space-x-2 text-white">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                </div>

                {selectedEmployee.department && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                      {selectedEmployee.department}
                    </span>
                  </div>
                )}

              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    navigate(`/editEmployee/${selectedEmployee.id}`);
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  Edit Employee
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Employee</h3>
              <p className="text-slate-400 mb-6">
                Are you sure you want to delete {employeeToDelete?.name}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={(e) => deleteEmployee(e, employeeToDelete.id)}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setEmployeeToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;