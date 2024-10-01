import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
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

  function isTokenValid() {
    try {
      const decoded = jwtDecode(token.value);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        return false
      } else {
        return true
      }

    } catch (error) {
      console.log(error)
      return false
    }
  }

  return {
    token, user, setToken, setUser, isTokenValid, isAuthenticated
  }
})
