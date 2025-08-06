// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 確保在客戶端執行
    // 這樣可以避免在服務端渲染時出現錯誤

    if (typeof window !== 'undefined') {
      // 動態插入 Font Awesome CDN
      if (!document.getElementById('fa-cdn')) {
        const link = document.createElement('link')
        link.id = 'fa-cdn'
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
        document.head.appendChild(link)
      }

      // 目錄動畫函數 - 只處理目錄項目，不包含標題
      const addOutlineAnimation = () => {
        setTimeout(() => {
          // 只為目錄項目添加點擊動畫
          const outlineLinks = document.querySelectorAll('.VPDocAsideOutline .outline-link')
          outlineLinks.forEach(link => {
            link.addEventListener('click', function() {
              this.style.transform = 'scale(0.98)'
              setTimeout(() => {
                this.style.transform = ''
              }, 100)
            })
          })
        }, 500)
      }

      // 初次載入
      addOutlineAnimation()
      
      // 路由變化時重新綁定
      router.onAfterRouteChanged = () => {
        addOutlineAnimation()
      }
    }
  },
  
} satisfies Theme
