import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import MyButton from './components/MyButton.vue'
import './style/index.css'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('MyButton', MyButton)
    },
    setup() {
        
        const route = useRoute()
        
        const initZoom = () => {
            // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
            // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
            mediumZoom('.main img', { background: 'var(--vp-c-bg)' }) 
        }
        
        onMounted(() => {
            initZoom()
        })

        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        )
    }
}