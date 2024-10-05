<template>
  <div class="home-view">
    <div class="barra-lateral">
      <div class="user-info">
        <h2>{{ userName }}</h2>
        <p>{{ userEmail }}</p>
      </div>
      <div class="menu-container">
        <ul class="menu-list">
          <li><a href="#" @click.prevent="showComponent('reservationCalendar')">Calendário</a></li>
          <li><a href="#" @click.prevent="showComponent('reserveRoom')">Reservar Sala</a></li>
          <li><a href="#" @click.prevent="showComponent('reservationsHistory')">Histórico de Reservas</a></li>
        </ul>
      </div>
      <div class="logout-container">
        <a href="#" @click.prevent="logout" class="logout-button">Logout</a>
      </div>
    </div>
    <div class="main-content">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import ReservationCalendar from '../components/ReservationCalendar.vue';
import ReserveRoomComponent from '../components/ReserveRoom.vue';
import ReservationsHistoryComponent from '../components/ReservationsHistory.vue';

export default {
  data() {
    return {
      userName: '',
      userEmail: '',
      currentComponent: null
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.userName = user.name;
      this.userEmail = user.email;
    }
  },
  methods: {
    showComponent(component) {
      if (component === 'reserveRoom') {
        this.currentComponent = ReserveRoomComponent;
      } else if (component === 'reservationsHistory') {
        this.currentComponent = ReservationsHistoryComponent;
      } else if (component === 'reservationCalendar') {
        this.currentComponent = ReservationCalendar;
      } else {
        this.currentComponent = null;
      }
    },
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
}

.barra-lateral {
  width: 300px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.user-info {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 20px;
  text-align: center;
  border-top-right-radius: 10px;
}

.user-info h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.user-info p {
  font-size: 1rem;
  margin-top: 0;
}

.menu-container {
  background-color: #f5f5f5;
  flex-grow: 1;
  padding: 10px;
  border-bottom-right-radius: 10px;
}

.menu-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin: 10px 0;
}

.menu-list a {
  text-decoration: none;
  font-size: 1.2rem;
  color: #2c3e50;
  padding: 10px 15px;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.menu-list a:hover {
  background-color: #2c3e50;
  color: #ffffff;
}

.logout-container {
  margin-top: auto;
  text-align: center;
  padding: 10px 0;
}

.logout-button {
  text-decoration: none;
  font-size: 1.2rem;
  color: #2c3e50;
  padding: 10px 15px;
  display: inline-block;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.logout-button:hover {
  background-color: #2c3e50;
  color: #ffffff;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f0f0f0;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
