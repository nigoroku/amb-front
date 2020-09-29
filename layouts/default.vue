<template>
  <a-layout id="components-layout-demo-custom-trigger" style="height: 100%;">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <!-- <div class="system-logo">
        <img src="~assets/img/logo.png" />
      </div>-->
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1">
          <nuxt-link to="/userProfile">
            <a-icon type="user" />
            <span>Output Board</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera" />
          <span>Input Board</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="upload" />
          <span>Analytics</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="upload" />
          <span>AI Advisor</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <transition name="top" mode="out-in">
        <a-alert
          v-show="isShowAlert"
          message="本日の実績を登録しました！"
          description="明日もまたがんばりましょう！"
          type="success"
          closable
          show-icon
          class="alert-message"
        />
      </transition>
      <headers @isCollapsed="collapsed = !collapsed"></headers>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', display:'table' }"
      >
        <Nuxt />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import Headers from "@/components/Headers";
import { mapState } from "vuex";

export default {
  components: {
    Headers,
  },
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    ...mapState(["isShowAlert"]),
  },
};
</script>
<style lang="less">
#__nuxt {
  height: 100%;
}
#__layout {
  height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.system-logo {
  background: bottom;
  img {
    width: 190px;
    padding: 10px 20px 10px 20px;
  }
}

.alert-message {
  position: fixed;
  width: 80%;
  left: 240px;
  top: 55px;
  z-index: 100;
}

.top-enter-active,
.top-leave-active {
  transform: translate(0px, 0px);
  transition: transform 500ms cubic-bezier(0, 0, 0.2, 1) 500ms;
}

.top-enter,
.top-leave-to {
  transform: translateY(-100vh) translateY(0px);
}
</style>
