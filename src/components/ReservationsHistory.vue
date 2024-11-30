<template>
  <div class="container-reservations-history">
    <div class="box-filters">
      <Accordion value="0">
        <AccordionPanel value="0">
          <AccordionHeader>Filtros</AccordionHeader>
          <AccordionContent>
            <PvMultiSelect
              v-model="selectedRooms"
              :options="roomOptions"
              optionLabel="_name"
              placeholder="Selectione as salas"
              :maxSelectedLabels="3"
              class="w-full md:w-30rem room-filter"
              :filter="true"
              :invalid="invalidRoomFilter"
              :disabled="loading"
            />
            <div v-if="invalidRoomFilter" class="error-message">
              {{ 'Filtro obrigatorio' }}
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
    <div class="box-table">
      <DataTable
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20]"
        :loading="loading"
        :value="reservations"
        tableStyle="min-width: 30px"
      >
        <Column class="column-title" field="title" header="Titulo"></Column>
        <Column class="column-description" field="description" header="Descricao"></Column>
        <Column class="colunm-date" field="startDateTime" header="Data hora inicio"></Column>
        <Column class="colunm-date" field="endDateTime" header="Data hora fim"></Column>
        <Column class="column-room" field="roomName" header="Sala"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useAuthStore } from '@/stores/auth'
import axiosInstance from '@/services/http'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import PvMultiSelect from 'primevue/multiselect'

export default {
  components: {
    DataTable,
    Column,
    PvMultiSelect,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent
  },
  data() {
    return {
      reservations: [],
      loading: true,
      roomOptions: [],
      selectedRooms: null,
      invalidRoomFilter: false
    }
  },
  async created() {
    await this.loadRooms()
    await this.loadOldReservations()
  },
  methods: {
    async loadOldReservations() {
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
    },
    async loadRooms() {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken().value

        const response = await axiosInstance.get('/v1/rooms', {
          headers: {
            Authorization: token
          }
        })

        if (response.data) {
          this.roomOptions = response.data.data
          this.selectedRooms = [this.roomOptions[0]]
        }
      } catch (error) {
        this.visible = true
        this.errorMessage =
          'Erro ao carregar as opções de salas. Por favor, tente novamente mais tarde.'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
.container-reservations-history {
  display: flex;
  justify-content: center;
}

.box-table {
  width: 1320px;
}

.box-filters {
  width: 250px;
}

.colunm-date {
  width: 15%;
}

.column-room {
  width: 15%;
}

.column-title {
  width: 25%;
}

.column-description {
  width: 30%;
}
</style>