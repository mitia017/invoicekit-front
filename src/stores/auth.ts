import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('/api/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    async register(name: string, email: string, password: string) {
      try {
        const response = await axios.post('/api/register', { name, email, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },
    async fetchUser() {
      if (this.token) {
        try {
          const response = await axios.get('/api/user')
          this.user = response.data
        } catch {
          this.logout()
        }
      }
    }
  }
})
