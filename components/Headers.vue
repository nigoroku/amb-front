<template>
  <a-layout-header
    style="
      background: rgb(29 24 24);
      padding-left: 0px;
      padding-right: 5px;
      display: flex;
      justify-content: space-between;
    "
  >
    <div
      style="
        border-bottom: 1px solid rgb(29 24 24);
        display: flex;
        justify-content: space-between;
        width: 100%;
      "
    >
      <div class="top-menu-left">
        <img src="@/assets/img/logo.png" style="width: 140px; padding: 2px" />
        <a-menu mode="horizontal" v-show="auth">
          <a-menu-item key="4" @click="showTodoModal"
            ><font-awesome-icon icon="external-link-alt" /> 今日の目標を登録する
          </a-menu-item>
          <a-menu-item key="5" @click="showPerformanceModal"
            ><font-awesome-icon icon="external-link-alt" /> 今日の実績を登録する
          </a-menu-item>
        </a-menu>
      </div>
      <div class="top-menu-right">
        <a-menu mode="horizontal">
          <a-sub-menu>
            <span slot="title" class="submenu-title-wrapper"
              ><font-awesome-icon icon="users" /> 他の人のインプット /
              アウトプット</span
            >
            <a-menu-item key="1">
              <nuxt-link to="/inputList">インプットタイムライン</nuxt-link>
            </a-menu-item>
            <a-menu-item key="2">
              <nuxt-link to="/outputList">アウトプットタイムライン</nuxt-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
        <div v-show="auth">
          <a-dropdown style="padding-left: 25px; margin-right: 20px">
            <a
              class="ant-dropdown-link"
              style="display: flex"
              @click="(e) => e.preventDefault()"
            >
              <span>{{ this.accountName }}</span>
              <a-icon type="down" style="margin-left: 5px; padding-top: 27px" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item style="padding: 10px 20px">
                <nuxt-link to="/mypage"
                  ><font-awesome-icon icon="user" /> マイページ
                </nuxt-link>
              </a-menu-item>
              <a-menu-item style="padding: 10px 20px">
                <a class="login-btn" @click="logout"
                  ><font-awesome-icon icon="sign-out-alt" /> ログアウト</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <a-menu mode="horizontal" v-show="!auth">
          <a-menu-item>
            <nuxt-link to="/"
              ><font-awesome-icon icon="sign-in-alt" /> ログイン</nuxt-link
            >
          </a-menu-item>
        </a-menu>
        <a-menu mode="horizontal" v-show="!auth">
          <a-button type="danger" style="margin-top: 15px; margin-right: 20px">
            <nuxt-link to="/signup">Sign up</nuxt-link>
          </a-button>
        </a-menu>
      </div>
      <todo-modal></todo-modal>
      <performance-modal></performance-modal>
    </div>
  </a-layout-header>
</template>
<script>
import TodoModal from "@/components/TodoModal";
import PerformanceModal from "@/components/PerformanceModal";
import { mapState, mapGetters } from "vuex";

const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  components: {
    TodoModal,
    PerformanceModal,
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
    logout() {
      Cookie.remove("auth");
      this.$store.commit("setAuth", null);
      this.$router.push("/");
    },
  },
  computed: {
    ...mapState(["auth", "accountName"]),
    ...mapGetters(["getUserId"]),
  },
  mounted: function () {
    this.$store.commit("setAccountName", Cookie.get("accountName"));

    if (this.getUserId == null) {
      return;
    }

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

        var createPngFile4Base64 = function (base64, name, content_type) {
          var bin = atob(base64.replace(/^.*,/, ""));
          var buffer = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
          }
          return new File([buffer.buffer], name, { type: content_type });
        };

        let file = createPngFile4Base64(
          account.account_img,
          "tmp",
          account.content_type
        );

        // ファイル読み込みを実行
        reader.readAsDataURL(file);
      })
      .catch(function () {})
      .finally(function () {});
  },
};
</script>
<style scoped lang="scss">
.top-menu-left {
  display: flex;
  & .ant-menu-item,
  & .ant-menu-submenu {
    line-height: 60px;
  }
}
.top-menu-right {
  display: flex;
  & .ant-menu-item,
  & .ant-menu-submenu {
    line-height: 60px;
  }
}
ul.ant-menu {
  background: rgba(0, 0, 0, 0);
  border-bottom: none;
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