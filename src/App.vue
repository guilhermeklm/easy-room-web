<template>
  <ul>
    <li>
      <router-link :to="{ name: 'home' }"> Home </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'login' }"> Login </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'dashboard' }"> Dashboard </router-link>
    </li>
  </ul>
  <li v-if="auth.isAuthenticated">
    {{ auth.fullName }}
  </li>
  <router-view />
</template>

<script setup>

import { authStore } from './stores/auth'
const auth = authStore()

</script>

<style lang="scss" scoped></style>
