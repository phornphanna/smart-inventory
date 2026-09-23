import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    loading: false,
    error: null as string | null,
    resetToken: null as string | null,
    resetEmail: null as string | null,
  }),

  actions: {
    async login(email: string, password: string, keepLoggedIn: boolean) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/login', {
          email,
          password,
        })

        console.log('LOGIN RESPONSE:', response.data)

        const token = response.data.data.token
        const user = response.data.data.user

        if (!token) {
          throw new Error('Login succeeded but no token was returned')
        }

        this.user = user
        this.token = token

        localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        if (keepLoggedIn) {
          localStorage.setItem('token', token)
        } else {
          sessionStorage.setItem('token', token)
        }

        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed'

        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(email: string, otp: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/verify-otp', {
          email,
          otp,
        })

        this.resetToken = response.data.data.resetToken

        return response.data
      } catch (error: any) {
        this.error =
          error.response?.data?.message ||
          'Invalid OTP'

        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/forgot-password', {
          email,
        })
      
        // return console.log(response)

        if(response.data.success){
         this.resetEmail = email
         this.loading = false 
        return response.data
        } else {
          this.loading = false 
            return   response.data;
        }

      
      } catch (error: any) {
        this.error =
          error.response?.data?.message ||
          'Unable to send OTP'
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.error = null

      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    },
  },
})
