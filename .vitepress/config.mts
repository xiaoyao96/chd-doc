import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "chd-wind",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "快速开始", link: "/start" },
    ],

    sidebar: [
      {
        items: [{ text: "快速开始", link: "/start" }],
      },
      {
        text: "礼赞相关",
        items: [
          { text: "礼赞自动抽取", link: "/lizan/main" },
          { text: "礼赞编码下载", link: "/lizan/code" },
          { text: "礼赞模拟器", link: "http://1.117.4.161:8181" },
        ],
      },
      {
        text: "其他",
        items: [
          { text: "等级补完自动购买", link: "/other/djbw" },
          
        ],
      },
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
  base: "./"
});
