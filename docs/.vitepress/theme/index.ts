import DefaultTheme from 'vitepress/theme'
import { useLive2d } from 'vitepress-theme-website'
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
        useLive2d({
            model: {
                url: 'https://raw.githubusercontent.com/iCharlesZ/vscode-live2d-models/master/model-library/bilibili-22/index.json',
            },
            display: {
                position: 'right',
                width: '150px',
                height: '300px',
                xOffset: '35px',
                yOffset: '5px'
            },
            mobile: {
                show: true
            },
            react: {
                opacity: 0.8
            }
        })

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