<template>
  <div class="home-view">
    <header>
      <div class="login-bar">
        <span class="user-name">{{ userName }}</span>
        <button class="logout-btn" @click="logout">Sair</button>
      </div>

      <nav>
        <a href="#" class="logo">
          <img src="../assets/logo-er.png" alt="" class="logo-er" />
        </a>
        <input type="checkbox" class="toggle" id="toggle" />
        <label for="toggle"> <font-awesome-icon size="xl" :icon="['fa-solid', 'fa-bars']" /></label>
        <div class="menu">
          <ul>
            <li>
              <a @click.prevent="showComponent('reservationCalendar')" href="#calendario"
                >Calendário</a
              >
            </li>
            <li>
              <a @click.prevent="showComponent('reservationsHistory')" href="#historico"
                >Histórico de Reservas</a
              >
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <div>
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>


<script>
import ReservationCalendar from '../components/ReservationCalendar.vue'
import ReservationsHistoryComponent from '../components/ReservationsHistory.vue'

export default {
  data() {
    return {
      userName: '',
      userEmail: '',
      currentComponent: ReservationCalendar,
      isMenuOpen: false
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.userName = user.name
      this.userEmail = user.email
    }
  },
  methods: {
    showComponent(component) {
      if (component === 'reservationCalendar') {
        this.currentComponent = ReservationCalendar
      } else if (component === 'reservationsHistory') {
        this.currentComponent = ReservationsHistoryComponent
      } else {
        this.currentComponent = ReservationCalendar
      }
      this.isMenuOpen = false
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
}
</script>

<style lang="css" scoped src="../assets/homeview.css"></style>