<template>
  <h2>Historico de reservas</h2>
  <DataTable :loading="loading" :value="reservations" tableStyle="min-width: 30px">
    <Column field="title" header="Titulo"></Column>
    <Column field="description" header="Descricao"></Column>
    <Column field="startDateTime" header="Data hora inicio"></Column>
    <Column field="endDateTime" header="Data hora fim"></Column>
    <Column field="roomName" header="Sala"></Column>
  </DataTable>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useAuthStore } from '@/stores/auth'
import axiosInstance from '@/services/http'

export default {
  components: { DataTable, Column },
  data() {
    return {
      reservations: [],
      loading: true,
    }
  },
  async created() {
    try {
      const authStore = useAuthStore()
      const token = authStore.getToken().value

      const response = await axiosInstance.get('/v1/history/reservations', {
        headers: {
          Authorization: token
        }
      })

      if (response.data) {
        this.reservations = response.data
      }
    } catch (error) {
      this.errorMessage =
        'Erro ao carregar o historico de reservas. Por favor, tente novamente mais tarde.'
      console.error(error)
    } finally {
      this.loading = false
    }
  }
}
</script>