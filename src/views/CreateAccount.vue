<template>
  <div class="signup-container">
    <div class="signup-box">
      <div class="box-logo">
        <img src="../assets/logo-er.png" alt="Logo" class="logo" />
      </div>
      <div id="linha-vertical"></div>
      <div class="box-inputs">
        <form @submit.prevent="handleSubmit">
          <h2>Criar Conta</h2>
          <div class="form-group">
            <label for="name">Nome</label>
            <InputText class="input" id="name" v-model="name" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <InputText class="input" id="email" v-model="email" />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <Password class="input" id="password" v-model="password" :feedback="false" />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirmar Senha</label>
            <Password
              class="input"
              id="confirmPassword"
              v-model="confirmPassword"
              :feedback="false"
            />
          </div>
          <PVButton type="button" class="login-button" @click="handleSubmit">Criar</PVButton>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import PVButton from 'primevue/button'
import http from '@/services/http.js'

export default {
  components: {
    InputText,
    Password,
    PVButton
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: null
    }
  },
  methods: {
    async handleSubmit() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem!'
        return
      }
      this.errorMessage = null

      try {
        const { data } = await http.post('/v1/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })

        if(data.status == "success") {
          this.$router.push({ name: 'login' })
        } else {
          throw new Error("error")
        }

      } catch (error) {
        console.log(error)
        this.errorMessage = "Ocorreu algum erro interno dentro do servidor, contate o suporte"
      }
    }
  }
}
</script>

<style lang="css" scoped src="../assets/createaccount.css"></style>
