<template>
  <div class="wrapper">
    <div class="container">
      <validation-observer ref="obs" v-slot="{ handleSubmit, invalid }">
        <h1 key="title1" class="title">
          <font-awesome-icon icon="user" /> Sign up
        </h1>
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
          <a-button
            type="danger"
            :disabled="invalid"
            id="signup-button"
            @click="createUser"
            >Sign up</a-button
          >
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
    createUser() {
      const self = this;
      this.$http(process.env.userApiEndpoit)
        .post("/api/v1/user/create", {
          email: this.email,
          password: this.password,
        })
        .then(function (response) {
          if (
            response.status == "200" &&
            typeof response.data.errorMessage != "undefined" &&
            response.data.errorMessage != ""
          ) {
            alert(response.data.errorMessage);
            return;
          }
          // ログイン認証
          self
            .$http(process.env.userApiEndpoit)
            .post("/api/v1/user/login", {
              email: self.email,
              password: self.password,
            })
            .then(function (res) {
              if (res.status != "200") {
                alert("code:" + res.status + " ログインに失敗しました");
                return;
              }
              const auth = {
                accessToken: res.data.token,
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
            })
            .finally(function () {});
        })
        .catch(function (e) {})
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
.title {
  color: white;
  font-size: 50px !important;
}

.lp-image {
  width: 50%;
  height: 100%;
  background-image: url("~assets/img/top_cover.jpg");
  background-size: cover;
  float: left;
}

.wrapper {
  background: -webkit-linear-gradient(top left, #2b2b2b 0%, #100f0f 100%);
  background: -moz-linear-gradient(top left, #2b2b2b 0%, #100f0f 100%);
  background: -o-linear-gradient(top left, #2b2b2b 0%, #100f0f 100%);
  background: linear-gradient(to bottom right, #a7873f 0%, #681e7d 100%);

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
  padding: 120px 0;
  height: 550px;
  text-align: center;
  display: flex;
  align-items: center;
  transition: 0.5s;
  flex-flow: wrap;

  h1 {
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

      color: #31312d;
    }

    &::placeholder {
      color: white;
    }
  }

  #signup-button {
    width: 350px;
    cursor: pointer;
    font-size: 18px;
    line-height: 0px;
    padding: 20px 15px;
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
