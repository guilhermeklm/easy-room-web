import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import "qalendar/dist/style.css";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment-timezone'
moment.tz.setDefault('America/Sao_Paulo')

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.component(VueDatePicker)

app.mount('#app')