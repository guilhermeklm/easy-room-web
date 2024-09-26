import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import http from '@/services/http.js'

export const authStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user')))

  function setToken(tokenValue) {
    localStorage.setItem('token', tokenValue)
    token.value = tokenValue
  }

  function setUser(userValue) {
    localStorage.setItem('user', JSON.stringify(userValue))
    user.value = userValue
  }

  function isAuthenticated() {
    return token.value && user.value
  }

  const fullName = computed(() => {
    return user.value.firstName + ' ' + user.value.lastName
  })

  async function checkToken() {
    try {
      const tokenAuth = 'Bearer ' + token.value
      const { data } = http.get('/auth/verify', {
        headers: {
          Authorization: tokenAuth
        }
      })

      return data
    } catch (error) {
      console.log(error.response?.data)
    }
  }

  return {
    token, user, setToken, setUser, checkToken, isAuthenticated, fullName
  }
})
