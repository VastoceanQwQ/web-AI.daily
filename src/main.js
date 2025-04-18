import './assets/main.css'
import './assets/h.css'

import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VueGridLayout from 'vue-grid-layout';

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')


import MainFooter from './components/footer.vue'
app.component('main-footer', MainFooter)



