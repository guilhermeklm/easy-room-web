<template>
  <div class="home-view">
    <div class="mini-navbar">
      <div class="user-info">
        <span>{{ userName }}</span>
        <button class="logout-button" @click="logout">Logout</button>
      </div>
    </div>

    <nav class="navbar">
      <div class="navbar-left">
        <h2>{{ userName }}</h2>
        <p>{{ userEmail }}</p>
      </div>
      <div class="navbar-right">
        <ul class="menu-list">
          <li>
            <a href="#" @click.prevent="showComponent('reservationCalendar')">Calendário</a>
          </li>
          <li>
            <a href="#" @click.prevent="showComponent('reservationsHistory')"
              >Histórico de Reservas</a
            >
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
import ReservationsHistoryComponent from '../components/ReservationsHistory.vue'

export default {
  data() {
    return {
      userName: '',
      userEmail: '',
      currentComponent: ReservationCalendar
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

.mini-navbar {
  display: flex;
  justify-content: flex-end;
  background-color: #333;
  color: #ffffff;
  padding: 5px 20px;
  font-size: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-button {
  background-color: #e74c3c;
  color: #ffffff;
  font-size: 1rem;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c0392b;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #4e54c8, #8f94fb);
  color: #ffffff;
  padding: 10px 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid #34495e;
}

.navbar-left h2 {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: #ffffff;
}

.navbar-left p {
  font-size: 1rem;
  margin: 5px 0 0;
  color: #d1d5db;
}

.menu-list {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
}

.menu-list li {
  font-size: 1.2rem;
  font-weight: 500;
}

.menu-list a {
  text-decoration: none;
  color: #ffffff;
  padding: 8px 15px;
  border-radius: 20px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.menu-list a:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
  }

  .navbar-left {
    text-align: center;
    width: 100%;
    margin-bottom: 10px;
  }

  .menu-list {
    justify-content: center;
    width: 100%;
  }
}
</style>
