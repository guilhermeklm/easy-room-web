<template>
  <h2>Login</h2>

  <form @submit.prevent="login">
    <input type="text" placeholder="Seu email" v-model="user.email" />
    <input type="password" placeholder="Sua senha" v-model="user.password" />
    <button type="submit">Login</button>

    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </form>
</template>

<script setup>
import http from '@/services/http.js'
import { reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const errorMessage = computed(() => route.query.error || null)

const user = reactive({
  email: 'guilherme.klm22@gmail.com',
  password: 'senha123'
})

const auth = useAuthStore()

async function login() {
  try {
    const { data, headers } = await http.post('/v1/auth/login', user)
    auth.setToken(headers.getAuthorization())
    auth.setUser(data.data)

    errorMessage.value = ''
    router.push({ name: 'home' }) 
  } catch (error) {
    console.log(error)
    errorMessage.value = 'Email ou senha incorretos. Tente novamente.'
  }
}
</script>

<style></style>
