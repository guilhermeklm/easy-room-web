import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import "qalendar/dist/style.css";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { VueSpinner } from 'vue3-spinners'
import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog'
import Button from "primevue/button"
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import moment from 'moment-timezone'
moment.tz.setDefault('America/Sao_Paulo')

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.fake-dark-selector'
    }
  }
});
app.component(Dialog, 'PVDialog')
app.component(Button, 'PVButton')
app.component(VueSpinner)
app.component(VueDatePicker)

app.mount('#app')