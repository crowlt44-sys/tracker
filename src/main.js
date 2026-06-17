import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { createGoeyToastPlugin } from 'goey-toast-vue'
import 'vue-sonner/style.css' // Base styling for fixed positioning
import 'goey-toast-vue/styles.css'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const app = createApp(App)

// Menyembunyikan harmless warning dari internal package goey-toast-vue
app.config.warnHandler = (msg, instance, trace) => {
  if (msg.includes('Extraneous non-emits event listeners (closeToast)')) return;
  console.warn(`[Vue warn]: ${msg}\n${trace}`);
}

app.use(router)
app.use(createGoeyToastPlugin())
app.mount('#app')
