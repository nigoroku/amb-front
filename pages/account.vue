<template>
  <div class="container">
    <section class="account-model">
      <a-form-model :model="accountForm" v-bind="formItemLayout">
        <input
          type="file"
          @change="onChange"
          accept=".jpg, .jpeg, .png"
          v-show="false"
          ref="img_inp"
          id="accountImg"
        />
        <div class="photo">
          <div id="photo-to-circle" class="photo-to-circle">
            <div>
              <a-icon
                class="camera-icon"
                @click="openFile"
                type="camera"
                :style="{ fontSize: '30px', color: '#fff' }"
              />
            </div>
          </div>
        </div>
        <a-form-model-item class="dark-item-label" label="アカウント名">
          <a-input
            placeholder="account name..."
            v-model="accountForm.account_name"
            type="text"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item class="dark-item-label" label="email">
          <a-input
            placeholder="email..."
            v-model="accountForm.email"
            type="email"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item class="dark-item-label" label="紹介文">
          <a-input
            type="textarea"
            v-model="accountForm.introduction"
            :auto-size="{ minRows: 6, maxRows: 8 }"
          />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
          <a-button
            key="submit"
            type="primary"
            :loading="confirmLoading"
            @click="handleOk"
            style="margin-right: 10px"
            ><font-awesome-icon icon="check" style="margin-right: 5px" />
            更新する</a-button
          >
          <a-button key="back" @click="handleCancel">キャンセル</a-button>
        </a-form-model-item>
      </a-form-model>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  data() {
    return {
      confirmLoading: false,
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 10 },
      },
      accountForm: {
        account_name: "",
        email: "",
        introduction: "",
        user_id: "",
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleOk(e) {
      var formData = new FormData();
      var account = this.accountForm;
      formData.append("image", this.$refs.img_inp.files[0]);
      formData.append("account_name", account.account_name);
      formData.append("email", account.email);
      formData.append("introduction", account.introduction);
      formData.append("user_id", account.user_id);

      this.confirmLoading = true;
      const self = this;
      this.$http(process.env.userApiEndpoit)
        .post("/api/v1/user/edit", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          Cookie.set("accountName", account.account_name);
          self.$router.push("/mypage/");
        })
        .catch(function () {})
        .finally(function () {
          self.handleCancel();
          self.confirmLoading = false;
        });
    },
    handleCancel() {
      this.$router.push("/mypage/");
    },
    openFile() {
      var clickImg = document.getElementById("accountImg");
      clickImg.click();
    },
    onChange(e) {
      if (e.target.files.length == 0) {
        return;
      }
      var fileData = e.target.files[0];
      var object = document.getElementById("photo-to-circle");

      var reader = new FileReader();

      reader.onload = function (e) {
        object.style.backgroundImage = "url(" + e.target.result + ")";
      };

      // ファイル読み込みを実行
      reader.readAsDataURL(fileData);
    },
  },
  computed: {
    ...mapState(["auth"]),
    ...mapGetters(["getUserId"]),
  },
  mounted: function () {
    if (this.auth == null) {
      return;
    }
    let self = this;
    this.$http(process.env.userApiEndpoit)
      .get("/api/v1/user/account?user_id=" + this.getUserId)
      .then(function (response) {
        let account = response.data.account;
        self.accountForm.user_id = account.user_id;
        self.accountForm.account_name = account.account_name;
        self.accountForm.introduction = account.introduction;
        self.accountForm.email = account.email;

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
<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 60px;
  height: 1000px;
}
.photo {
  display: flex;
  justify-content: center;
}
.photo-to-circle {
  background-image: url("../assets/img/no_photo.png");
  background-size: cover;
  width: 170px;
  height: 170px;
  margin-bottom: 20px;
  border-radius: 50%;
  background-position: left top;
  border: 4px solid #f3f3f3;
  & .camera-icon {
    height: 170px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
  }
}
</style>