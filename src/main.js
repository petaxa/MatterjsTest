import { createApp, h } from 'vue'
import './style.css'
import App from './App.vue'

// Vue.config.productionTip = false

const app = createApp(App)
app.component('anchored-heading', {
    render() {
        return h(App, {ref: 'root'})
    }
})
app.mount('#app')
