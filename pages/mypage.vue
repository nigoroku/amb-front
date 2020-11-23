<template>
  <div id="charts-container" class="container">
    <a-row class="top-bar">
      <a-col :span="8" style="padding-left: 30px">
        <a-card class="no-border top-card">
          <div style="padding-top: 10px; margin-right: 5px">
            <div class="photo-to-circle"></div>
          </div>
          <div class="account-info">
            <div style="margin-top: 8px">
              <nuxt-link to="/account"
                ><font-awesome-icon icon="edit" /> 編集する</nuxt-link
              >
            </div>
            <span class="account_name">{{ account_name }}</span>
            <p class="introduction">{{ introduction }}</p>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="no-border">
          <h2>総学習時間</h2>
          <span id="total-time">{{ total_study_time }}</span
          ><span> 時間</span>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" class="gutter-box"
        ><a-card class="chart-card" style="border-bottom: none">
          <horizontal-bar-chart style="height: 250px"></horizontal-bar-chart>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12" class="gutter-box">
        <a-card class="chart-card" style="border-right: none">
          <bar-chart></bar-chart>
        </a-card>
      </a-col>
      <a-col :span="12" class="gutter-box">
        <a-card class="chart-card">
          <line-chart></line-chart>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart";
import BarChart from "@/components/BarChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import ChartWithAnnotation from "@/components/ChartWithAnnotation";
import { mapGetters } from "vuex";

export default {
  middleware: "authenticated",
  components: {
    ChartWithAnnotation,
    LineChart,
    BarChart,
    HorizontalBarChart,
  },
  data() {
    return {
      total_study_time: 154,
      account_name: "",
      introduction: "",
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
  },
  mounted: function () {
    if (this.getUserId == null) {
      return;
    }

    let self = this;
    // アカウント情報取得
    this.findAccount(self);

    // 学習時間集計値取得
  },
  methods: {
    // アカウント情報取得
    findAccount(self) {
      self
        .$http(process.env.userApiEndpoit)
        .get("/api/v1/user/account?user_id=" + self.getUserId)
        .then(function (response) {
          let account = response.data.account;
          self.account_name = account.account_name;
          let introduction = account.introduction;
          if (introduction.length > 60) {
            introduction = introduction.substring(0, 60) + "...";
          }
          self.introduction = introduction;

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
    // 学習時間集計値取得
    findLearningTimeAggregate(self) {
      self
        .$http(process.env.userApiEndpoit)
        .get("/api/v1/achievement/account?user_id=" + self.getUserId)
        .then(function (response) {})
        .catch(function () {})
        .finally(function () {});
    },
  },
};
</script>
<style lang="scss" scoped>
.photo-to-circle {
  background-image: url("../assets/img/no_photo.png");
  background-size: cover;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-position: left top;
  border: 2px solid #f3f3f3;
}
.total-time-box {
  padding: 20px;
  & h2 {
    margin-bottom: 0px;
  }
}
.gutter-box {
  padding: 15px;
}
#total-time {
  font-size: 60px;
}
.chart-card {
  padding: 0px 15px 10px 15px;
  border: 1px solid #dcdcdc;
}
.account-info {
  margin-left: 8px;
  margin-top: 10px;
}
.top-bar {
  background: #fff;
  border-bottom: 1px solid #dcdcdc;
}
.no-border {
  border: none;
}
.account_name {
  font-size: 24px;
  display: block;
}
.introduction {
  font-size: 13px;
}
</style>