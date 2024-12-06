<template>
  <div class="container">
    <div class="login">
      <img src="../assets/logo-er.png" alt="Logo do Sistema" class="logo" />

      <h1 class="login-title"> Login </h1>

      <div class="box-login">
        <label class="label" for="email">Email</label>
        <InputText class="input" id="email" v-model="email" aria-describedby="username-help" />

        <label class="label" for="password">Senha</label>
        <Password class="input" id="password" v-model="password" :feedback="false" />

        <PVButton type="button" class="login-button" @click="login">Entrar</PVButton>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="register-link">
          <span> Não possui uma conta? </span>
          <a @click.prevent="register" href="/register">Criar conta</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import http from '@/services/http.js'
import { useAuthStore } from '@/stores/auth.js'
import PVButton from 'primevue/button'

export default {
  components: {
    InputText,
    Password,
    PVButton
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      try {
        this.errorMessage = ''

        const auth = useAuthStore()
        const { data, headers } = await http.post('/v1/auth/login', {
          email: this.email,
          password: this.password
        })
        auth.setToken(headers.getAuthorization())
        auth.setUser(data.data)

        this.$router.push({ name: 'home' })
      } catch (error) {
        console.log(error)
        this.errorMessage = 'Email ou senha incorretos. Tente novamente.'
      }
    },
    register() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>

<style>
.p-inputtext {
  width: 100%;
}
</style>

<style lang="css" scoped src="../assets/loginview.css"></style>