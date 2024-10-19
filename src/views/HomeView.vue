<template>
  <div class="home-view">
    <nav class="navbar">
      <div class="navbar-left">
        <h2>{{ userName }}</h2>
        <p>{{ userEmail }}</p>
      </div>
      <div class="navbar-right">
        <ul class="menu-list">
          <li><a href="#" @click.prevent="showComponent('reservationCalendar')">Calendário</a></li>
          <li><a href="#" @click.prevent="showComponent('reserveRoom')">Reservar Sala</a></li>
          <li>
            <a href="#" @click.prevent="showComponent('reservationsHistory')"
              >Histórico de Reservas</a
            >
          </li>
          <li>
            <a href="#" @click.prevent="logout" class="logout-button">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="main-content">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import ReservationCalendar from '../components/ReservationCalendar.vue'
import ReserveRoomComponent from '../components/ReserveRoom.vue'
import ReservationsHistoryComponent from '../components/ReservationsHistory.vue'

export default {
  data() {
    return {
      userName: '',
      userEmail: '',
      currentComponent: null
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
      if (component === 'reserveRoom') {
        this.currentComponent = ReserveRoomComponent
      } else if (component === 'reservationsHistory') {
        this.currentComponent = ReservationsHistoryComponent
      } else if (component === 'reservationCalendar') {
        this.currentComponent = ReservationCalendar
      } else {
        this.currentComponent = null
      }
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2c3e50;
  color: #ffffff;
  padding: 10px 20px;
}

.navbar-left h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.navbar-left p {
  font-size: 1rem;
  margin: 0;
}

.navbar-menu {
  flex-grow: 1;
  text-align: center;
}

.menu-list {
  list-style-type: none;
  display: flex;
  gap: 20px;
}

.menu-list li {
  display: inline;
}

.menu-list a {
  text-decoration: none;
  font-size: 1.2rem;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.menu-list a:hover {
  background-color: #34495e;
}

.navbar-right {
  margin-left: auto;
}

.logout-button {
  text-decoration: none;
  font-size: 1.2rem;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.logout-button:hover {
  background-color: #34495e;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f0f0f0;
}
</style>
