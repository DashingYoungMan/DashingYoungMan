import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "个人博客",
  description: "个人博客",
  base: '/DashingYoungMan/',
  lang: 'zh-CN',
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'Vscode插件开发', link: '/page02' },
      {
        text: 'Java笔记', items: [
          { text: 'cglib动态代理', link: '/java/page01' },
          { text: '定时任务', link: '/java/page02' },
          { text: 'IO', link: '/java/page03' },
          { text: '网络编程', link: '/java/page04' },
          { text: 'JDBC', link: '/java/page05' },
        ]
      }
    ],

    // 侧边栏
    sidebar: [
      {
        text: '目录',
        // 允许折叠
        // collapsed: true,
        items: [
          { text: '快速开始', link: '/page01' },
          { text: 'Vscode插件开发', link: '/page02' },
          { text: 'Git的使用', link: '/page03' },
          {
            text: 'Java笔记', items: [
              { text: 'cglib动态代理', link: '/java/page01' },
              { text: '定时任务', link: '/java/page02' },
              { text: 'IO', link: '/java/page03' },
              { text: '网络编程', link: '/java/page04' },
              { text: 'JDBC', link: '/java/page05' },
            ]
          },
        ]
      }
    ],

    // 右侧的大纲
    outline: {
      // 显示2-4级标题
      level: [2, 4],
      label: '当前页大纲'
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DashingYoungMan' }
    ],

    // 本地搜索
    search: {
      provider: 'local'
    },

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Da'
    },

    //返回顶部文字修改
    returnToTopLabel: '返回顶部'
  },
  markdown: {
    // 代码显示行号
    lineNumbers: true,
    image: {
      // 开启图片懒加载
      lazyLoading: true
    }
  }
})
