// src/main.js
import './assets/main.css'
import './assets/h.css'

import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VueGridLayout from 'vue-grid-layout'
import router from './router' // 确保路径正确

const app = createApp(App)
app.use(ElementPlus)
app.use(router) // 使用路由
app.mount('#app')