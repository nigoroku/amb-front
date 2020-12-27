const envPath = `.env.${process.env.NODE_ENV || "production"}`;
require("dotenv").config({ path: envPath });

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "spa",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  env: {
    frontEndpoit: process.env.VUE_APP_FRONT_ENDPOIT || "http://localhost:3000",
    userApiEndpoit:
      process.env.VUE_APP_USER_API_ENDPOIT || "http://localhost:8081",
    todoApiEndpoit:
      process.env.VUE_APP_TODO_API_ENDPOIT || "http://localhost:8082",
    achievementApiEndpoit:
      process.env.VUE_APP_ACHIEVEMENT_API_ENDPOIT || "http://localhost:8083",
    boadListApiEndpoit:
      process.env.VUE_APP_BOADLIST_API_ENDPOIT || "http://localhost:8084"
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
    { src: "~/plugins/init-client.js", ssr: false },
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
  modules: ["nuxt-fontawesome", "@nuxtjs/dotenv", "nuxt-clipboard2"],
  dotenv: {
    filename: envPath
  },
  axios: {
    baseURL: process.env.VUE_APP_USER_API_ENDPOIT,
    credentials: true
  },
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
  },
  fontawesome: {
    imports: [
      {
        set: "@fortawesome/free-solid-svg-icons",
        icons: ["fas"]
      }
    ]
  },
  router: {
    trailingSlash: true,
    extendRoutes(routes, resolve) {
      routes.forEach(route => {
        if (route.name === "inputList") {
          route.meta = { page_id: "1" };
        }
        if (route.name === "outputList") {
          route.meta = { page_id: "2" };
        }
        if (route.name === "analytics") {
          route.meta = { page_id: "3" };
        }
        if (route.name === "mypage") {
          route.meta = { page_id: "4" };
        }
        if (route.name === "public") {
          route.meta = { page_id: "5" };
        }
      });
    }
  },
  loading: "@/components/Loading.vue"
};
