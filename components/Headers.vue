<template>
  <a-layout-header
    style="background: #fff; padding: 0;display:flex;justify-content: space-between;"
  >
    <div>
      <a-icon
        class="trigger"
        v-show="auth"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="isCollapsed"
      />
      <a-button type="primary" v-show="auth" @click="showTodoModal">
        <a-icon type="flag" />今日の目標
      </a-button>
      <a-button type="primary" v-show="auth" @click="showPerformanceModal">
        <a-icon type="check-circle" />今日の実績
      </a-button>
    </div>
    <div :style="{ textAlign: 'right' }">
      <a-dropdown v-show="auth" style="margin-right:20px;">
        <a class="ant-dropdown-link" style="display:flex;" @click="e => e.preventDefault()">
          <!-- <img class="photo-to-circle" src="@/assets/img/no_photo.png" /> -->
          <div style="padding-top: 10px;margin-right:5px;">
            <div class="photo-to-circle"></div>
          </div>
          <span>{{ this.accountName }}</span>
          <a-icon type="down" style="margin-left:5px;padding-top: 27px;" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <a class="login-btn" @click="showAccountModal" :style="{color: 'black'}">アカウント</a>
          </a-menu-item>
          <a-menu-item>
            <a class="login-btn" @click="logout" :style="{color: 'black'}">ログアウト</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

      <nuxt-link class="login-btn" v-show="!auth" to="/" :style="{color: 'black'}">Log in</nuxt-link>
      <a-button type="danger" v-show="!auth" :style="{ padding:'5px 8px',margin:'0px 15px' }">
        <nuxt-link to="/signup">Sign up</nuxt-link>
      </a-button>
    </div>
    <todo-modal></todo-modal>
    <performance-modal></performance-modal>
    <account-modal v-if="isShowAccountModal"></account-modal>
  </a-layout-header>
</template>
<script>
import TodoModal from "@/components/TodoModal";
import PerformanceModal from "@/components/PerformanceModal";
import AccountModal from "@/components/AccountModal";
import { mapState, mapGetters } from "vuex";

const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  components: {
    TodoModal,
    PerformanceModal,
    AccountModal,
  },
  data() {
    return {};
  },
  props: ["collapsed"],
  methods: {
    isCollapsed() {
      this.$emit("isCollapsed", this.collapsed);
    },
    showTodoModal() {
      this.$store.commit("toggleTodoModal");
    },
    showPerformanceModal() {
      this.$store.commit("togglePerformanceModal");
    },
    showAccountModal() {
      this.$store.commit("toggleAccountModal");
    },
    logout() {
      Cookie.remove("auth");
      this.$store.commit("setAuth", null);
      this.$router.push("/");
    },
  },
  computed: {
    ...mapState(["auth", "accountName", "isShowAccountModal"]),
    ...mapGetters(["getUserId"]),
  },
  mounted: function () {
    this.$store.commit("setAccountName", Cookie.get("accountName"));

    let self = this;
    this.$http(process.env.userApiEndpoit)
      .get("/api/v1/user/account?user_id=" + this.getUserId)
      .then(function (response) {
        let account = response.data.account;
        if (account.account_img == null) {
          return;
        }

        var objects = document.querySelectorAll(".photo-to-circle");

        var reader = new FileReader();
        reader.onload = function (e) {
          Array.prototype.forEach.call(objects, (elm) => {
            elm.style.backgroundImage = "url(" + e.target.result + ")";
          });
        };

        var createPngFile4Base64 = function (base64, name) {
          var bin = atob(base64.replace(/^.*,/, ""));
          var buffer = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
          }
          return new File([buffer.buffer], name, { type: "image/png" });
        };

        let file = createPngFile4Base64(account.account_img, "tmp");

        // ファイル読み込みを実行
        reader.readAsDataURL(file);
      })
      .catch(function () {})
      .finally(function () {});
  },
};
</script>
<style scoped lang="scss">
.login-btn {
  display: inline-block;
  padding: 0px 25px;

  &:hover {
    background: #cececebd;
    transition: 0.6s;
    cursor: pointer;
  }
}
.photo-to-circle {
  background-image: url("../assets/img/no_photo.png");
  background-size: cover;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-position: left top;
  border: 2px solid #f3f3f3;
}
</style>