<template>
  <div class="wrapper">
    <div class="container">
      <img src="@/assets/img/logo_text_white.png" style="width: 400px" />
      <validation-observer ref="obs" v-slot="{ handleSubmit, invalid }">
        <form id="login-form" v-if="show" @submit.prevent="handleSubmit(login)">
          <validation-provider
            rules="required|email"
            :name="$t('login.email')"
            v-slot="slotProps"
          >
            <a-form-item
              hasFeedback
              :validateStatus="resolveState(slotProps)"
              :help="slotProps.errors[0]"
            >
              <a-input
                type="email"
                placeholder="enter your email address..."
                v-model="email"
              />
            </a-form-item>
          </validation-provider>
          <validation-provider
            v-slot="slotProps"
            rules="required|min:4"
            :name="$t('login.password')"
          >
            <a-form-item
              hasFeedback
              :validateStatus="resolveState(slotProps)"
              :help="slotProps.errors[0]"
            >
              <a-input
                type="password"
                placeholder="enter password..."
                v-model="password"
              />
            </a-form-item>
          </validation-provider>
          <button id="login-button" @click="login" :disabled="invalid">
            <font-awesome-icon icon="sign-in-alt" /> Log in
          </button>
          <hr :style="{ marginTop: '20px', marginBottom: '20px' }" />
          <button @click="gestLogin" id="gest-login-button">
            <font-awesome-icon icon="sign-in-alt" /> Gest Login
          </button>
        </form>
      </validation-observer>
    </div>
    <ul class="bg-bubbles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  layout: "top_page",
  middleware: "notAuthenticated",
  data: () => ({
    email: "",
    password: "",
    show: true,
  }),
  methods: {
    login() {
      const self = this;
      this.$http(process.env.userApiEndpoit)
        .post("/api/v1/user/login", {
          email: this.email,
          password: this.password,
        })
        .then(function (response) {
          console.log(response);
          if (response.status != "200") {
            return;
          }
          const auth = {
            accessToken: response.data.token,
          };

          let payLoad = auth.accessToken.split(".")[1];
          let account = JSON.parse(atob(payLoad));
          let userId = account.id;
          let accountName = account.accountName;
          self.$store.commit("setAuth", auth);
          self.$store.commit("setAccountName", accountName);
          Cookie.set("auth", auth);
          Cookie.set("accountName", accountName);

          self.$router.push("/mypage");
        })
        .catch(function (e) {
          console.log(e);
          alert("ログインに失敗しました");
        })
        .finally(function () {});
    },
    gestLogin() {
      var gestEmail = "guest01@gmail.com";
      const self = this;
      this.$http(process.env.userApiEndpoit)
        .post("/api/v1/user/find-or-create", {
          email: gestEmail,
        })
        .then(function (response) {
          console.log(response.data);
          // TODO:ログイン認証
          self.$login(gestEmail, response.data.password, self);

          self.$router.push("/mypage");
        })
        .catch(function (e) {
          alert("アカウントの登録に失敗しました");
        })
        .finally(function () {});
    },
    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }

      if (pending) {
        return "validating";
      }

      if (valid) {
        return "success";
      }

      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
// @import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:200, 300);

$prim: hsl(155, 72%, 61%);

.wrapper {
  background: #50a3a2;
  background: -webkit-linear-gradient(top left, #dadada 0%, #100f0f 100%);
  background: -moz-linear-gradient(top left, #dadada 0%, #100f0f 100%);
  background: -o-linear-gradient(top left, #dadada 0%, #100f0f 100%);
  background: linear-gradient(to bottom right, #dadada 0%, #100f0f 100%);

  width: 100%;
  height: 100%;
  overflow: hidden;

  &.form-success {
    .container {
      h1 {
        transform: translateY(85px);
      }
    }
  }
}

.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 180px 0;
  height: 550px;
  text-align: center;
  display: flex;
  align-items: center;
  transition: 0.5s;
  flex-flow: wrap;

  & > span {
    margin: auto;
  }

  & h1 {
    width: 400px;
    font-size: 40px;
    transition-duration: 1s;
    transition-timing-function: ease-in-put;
    font-weight: 200;
    margin-bottom: 0px;
  }
}

#login-form {
  padding: 20px 0;
  position: relative;
  z-index: 2;
  margin: auto;

  input {
    appearance: none;
    outline: 0;
    // border: 1px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.2);
    width: 350px;
    border-radius: 3px;
    padding: 21px 15px;
    margin: auto;
    text-align: center;
    font-size: 18px;
    color: white;
    transition-duration: 0.25s;
    font-weight: 300;

    &:hover {
      background-color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
      background-color: white;
      width: 400px;

      color: $prim;
    }

    &::placeholder {
      color: white;
    }
  }

  #login-button,
  #gest-login-button {
    appearance: none;
    outline: 0;
    background-color: #00000075;
    border: 1px solid #fff;
    color: #ffffff;
    border-radius: 3px;
    width: 350px;
    cursor: pointer;
    font-size: 18px;
    transition-duration: 0.25s;
    padding: 10px 15px;

    &:hover {
      color: #000;
      background-color: rgb(245, 247, 249);
    }

    & a {
      padding: 8px 15px;
      width: 100%;
      display: block;
      color: #53e3a6;
    }
  }
}

.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 1;

  li {
    position: absolute;
    list-style: none;
    display: block;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    bottom: -160px;

    -webkit-animation: square 25s infinite;
    animation: square 25s infinite;

    -webkit-transition-timing-function: linear;
    transition-timing-function: linear;

    &:nth-child(1) {
      left: 10%;
    }

    &:nth-child(2) {
      left: 20%;

      width: 80px;
      height: 80px;

      animation-delay: 2s;
      animation-duration: 17s;
    }

    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }

    &:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;

      animation-duration: 22s;

      background-color: rgba(255, 255, 255, 0.25);
    }

    &:nth-child(5) {
      left: 70%;
    }

    &:nth-child(6) {
      left: 80%;
      width: 120px;
      height: 120px;

      animation-delay: 3s;
      background-color: rgba(255, 255, 255, 0.2);
    }

    &:nth-child(7) {
      left: 32%;
      width: 160px;
      height: 160px;

      animation-delay: 7s;
    }

    &:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;

      animation-delay: 15s;
      animation-duration: 40s;
    }

    &:nth-child(9) {
      left: 25%;
      width: 10px;
      height: 10px;

      animation-delay: 2s;
      animation-duration: 40s;
      background-color: rgba(255, 255, 255, 0.3);
    }

    &:nth-child(10) {
      left: 90%;
      width: 160px;
      height: 160px;

      animation-delay: 11s;
    }
  }
}

@-webkit-keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-700px) rotate(600deg);
  }
}
@keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-700px) rotate(600deg);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}
.v-enter, .v-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.error {
  color: rgb(233, 59, 59);
}

.ant-form-item {
  margin-bottom: 14px;
}

.ant-form-item-with-help {
  margin-bottom: 5px !important ;
}

.has-error .ant-input {
  margin-bottom: 4px !important;
}
</style>
