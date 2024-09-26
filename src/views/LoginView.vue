<template>
  <h2>Login</h2>

  <form @submit.prevent="login">
    <input 
      type="text" 
      placeholder="Seu email" 
      v-model="user.email"
    />
    <input 
      type="password" 
      placeholder="Sua senha" 
      v-model="user.password"
    />
    <button type="submit"> Login </button>
  </form>
</template>

<script setup>

import http from '@/services/http.js'
import { reactive } from 'vue';
import { authStore } from '@/stores/auth.js'


const user = reactive({
  email: "",
  password: ""
})

async function login() {
  console.log('Apertou no botao login')
  try {
    const { data } = await http.post('/auth', user)
    console.log(data)
    authStore.setToken(data.token)
    authStore.setUser(data.user) 
  } catch (error) {
    console.log(error?.response?.data)
  }
}
</script>

<style></style>
