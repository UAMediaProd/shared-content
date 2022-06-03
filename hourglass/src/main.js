import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import 'vue-universal-modal/dist/index.css'
import VueUniversalModal from 'vue-universal-modal'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

createApp(App).use(router).use(FloatingVue)
    .use(VueUniversalModal, { teleportTarget: '#modals' })
    .mount('#app')

