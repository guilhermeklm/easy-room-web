<template>
  <div class="container">
    <div class="login">
      <img src="../assets/logo.svg" alt="Logo do Sistema" class="logo" />

      <label class="label" for="email">Email</label>
      <InputText class="input" id="email" v-model="email" aria-describedby="username-help" />

      <label class="label" for="password">Senha</label>
      <Password class="input" id="password" v-model="password" :feedback="false" />

      <PVButton type="button" class="login-button" @click="login">Entrar</PVButton>

      <div class="register-link">
        <span>Não possui uma conta? </span>
        <a @click.prevent="register" href="#">Criar conta</a>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
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
      email: 'guilherme.klm22@gmail.com',
      password: 'senha123',
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
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.logo {
  width: 100%;
  max-width: 200px;
  margin-bottom: 20px;
}

.label {
  align-self: flex-start;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  margin-bottom: 15px;
}

.login-button {
  width: 100%;
  margin-top: 10px;
}

.register-link {
  margin-top: 15px;
  text-align: center;
}

.register-link a {
  color: #078bbf;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.register-link a:hover {
  text-decoration: underline;
}

.p-inputtext {
  width: 100%;
}

.error-message {
  color: red;
  margin-top: 10px;
}

@media only screen and (max-height: 435px) {
  .logo {
    display: none;
  }
}
</style>
