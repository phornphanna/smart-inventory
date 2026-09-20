import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/css/bootstrap.css'
import './assets/css/main.css';
import 'flatpickr/dist/flatpickr.css'



import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_HOST;

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
