import axios from 'axios'

const USER_API_BASE_URL = "http://localhost:8080/api/auth"

class UserService {

    // Login - fetches user from database via backend
    login(credentials) {
        return axios.post(USER_API_BASE_URL + "/login", credentials, {
            headers: { 'Content-Type': 'application/json' }
        })
    }

    // Register new user
    register(user) {
        return axios.post(USER_API_BASE_URL + "/register", user, {
            headers: { 'Content-Type': 'application/json' }
        })
    }

    // Save JWT token to sessionStorage
    saveToken(token) {
        sessionStorage.setItem('token', token)
    }

    // Get stored token
    getToken() {
        return sessionStorage.getItem('token')
    }

    // Save user info to sessionStorage
    saveUser(user) {
        sessionStorage.setItem('user', JSON.stringify(user))
    }

    // Get stored user
    getUser() {
        const user = sessionStorage.getItem('user')
        return user ? JSON.parse(user) : null
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!sessionStorage.getItem('token')
    }

    // Attach token to all future axios requests
    setAuthHeader() {
        const token = this.getToken()
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }

    // Logout - clear everything
    logout() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
    }
}

export default new UserService()