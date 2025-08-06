import { defineConfig } from 'vitepress'
import { generateSidebar } from './utils/sidebar-generator';
import path from 'path';

// 生成側邊欄配置 - 使用相對路徑指向 doc 資料夾
const sidebarConfig = generateSidebar('./doc');
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/Tims33-Blog/',

  title: "Tims33 Blog",
  description: "use Vitepress build blog",
  // 頁面頂部的logo
  head: [
    ['style', {}, `
      .VPNavBarTitle .logo,
      .VPNavBarTitle img {
        border-radius: 5px !important;
      }
    `]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 頁面頂部的logo
    logo: 'icon/cute.jpg',
    //頁面頂部的標題(預設false為不顯示)
    siteTitle: 'Tim33部落格',
    nav: [
      { text: '主頁', link: '/' },

      { text: '文章',
        items: [
          {text: '伏羲八卦', link: '/doc/Bagua/home' },
        ],
      },
      { text: '銘謝', link: '/markdown-examples' },
      { text: '關於我', link: '/doc/about' },

    ],

    // 使用 sidebar-config.json 內容作為側邊欄配置
    sidebar: sidebarConfig,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Tim0320' },
      { icon: 'instagram', link: 'https://google.com' },
      { icon: 'discord', link: 'https://discord.gg/yourserver' }
    ],
    //搜尋功能
    search: {
       provider: 'local',
        options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜尋文章',
                buttonAriaLabel: '搜尋文章'
              },
              modal: {
                noResultsText: '無法找到結果',
                resetButtonTitle: '清除查詢條件',
                footer: {
                  selectText: '選擇',
                  navigateText: '切換',
                  closeText: '關閉搜尋'
                }
              }
            }
          }
        }
      }
    },
    // 頁面底部顯示最後更新日期
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    //多語言功能
    locales: {
    root: {
      label: '繁體中文',
      lang: 'tw'
    }
  },

  }
})
