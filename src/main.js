// src/main.js
import './assets/main.css'
import './assets/h.css'

import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './router' 
import eventBus from './eventBus'


const app = createApp(App)
app.config.globalProperties.$bus = eventBus
app.use(ElementPlus)
app.use(router) 
app.mount('#app')