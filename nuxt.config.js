export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  env: {
    userApiEndpoit: "http://localhost:8081",
    todoApiEndpoit: "http://localhost:8082",
    achievementApiEndpoit: "http://localhost:8083",
    boadListApiEndpoit: "http://localhost:8084"
    // process.env.VUE_APP_REST_API_ENDPOINT || "http://localhost:8080/api/v1"
  },
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Global CSS
   */
  css: [
    { src: "ant-design-vue/dist/antd.less", lang: "less" },
    { src: "@/assets/less/style.less", lang: "less" }
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    "@/plugins/antd-ui",
    "@/plugins/http",
    "@/plugins/constants",
    "@/plugins/vee-validate",
    "@/plugins/i18n"
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  build: {
    loaders: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#2cbe4e",
            "font-family":
              '"Yu Gothic Medium", "游ゴシック Medium", "YuGothic", "游ゴシック体", "ヒラギノ角ゴ Pro W3", "メイリオ", sans-serif'
          },
          javascriptEnabled: true
        }
      }
    },
    transpile: ["vee-validate/dist/rules"]
  }
};
