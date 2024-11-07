<template>
  <div class="is-light-mode calendar-wrapper">
    <Qalendar
      :events="events"
      :config="config"
      :is-loading="loading"
      @edit-event="handleEditEvent"
      @delete-event="handleDeleteEvent"
    />
  </div>
</template>

<script>
import { Qalendar } from 'qalendar'
import axiosInstance from '@/services/http'
import { useAuthStore } from '@/stores/auth'

export default {
  components: {
    Qalendar
  },
  data() {
    return {
      reservations: [],
      events: [],
      loading: true,
      config: {
        week: {
          startsOn: 'monday',
          nDays: 7,
          scrollToHour: 5
        },
        defaultMode: 'week',
        showCurrentTime: true,
        locale: 'pt-BR'
      }
    }
  },
  async created() {
    await this.loadEvents()
  },
  methods: {
    async loadEvents() {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken().value

        const response = await axiosInstance.get('/v1/reservations', {
          headers: {
            Authorization: token
          }
        })

        if (response.data) {
          this.events = response.data.map((reservation) => ({
            id: reservation.id,
            title: reservation.title,
            description: reservation.description,
            location: `${reservation.roomName} - ${reservation.locationAddress}`,
            color: 'blue',
            isEditable: true,
            time: {
              start: reservation.startDateTime,
              end: reservation.endDateTime
            }
          }))
        }
      } catch (error) {
        console.error(error)
        this.errorMessage =
          'Erro ao carregar as opções de salas. Por favor, tente novamente mais tarde.'
      } finally {
        this.loading = false
      }
    },
    async handleEditEvent(event) {
      console.log('Editando evento:', event)
    },
    async handleDeleteEvent(event) {
      try {
        console.log('Deletando evento:', event)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.calendar-wrapper {
  max-width: 100%;
  height: 90vh;
  padding: 0 10px;
  overflow: auto;
}
</style>
