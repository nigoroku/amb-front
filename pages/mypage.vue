<template>
  <div id="charts-container" class="container">
    <a-row>
      <a-col :span="6">
        <a-card class="chart-card-dark">
          <div style="padding-top: 10px; margin-right: 5px">
            <div class="photo-to-circle"></div>
          </div>
          <div style="margin-top: 8px">
            <nuxt-link to="/account"
              ><font-awesome-icon icon="edit" /> 編集する</nuxt-link
            >
          </div>
          <span class="account_name">{{ account_name }}</span>
          <p class="introduction">{{ introduction }}</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="chart-card-dark">
          <h2>総学習時間</h2>
          <span id="total-time">{{ total_study_time }}</span
          ><span> 時間</span>
        </a-card>
      </a-col>
      <a-col :span="12"
        ><a-card class="chart-card-dark" style="border-bottom: none">
          <horizontal-bar-chart style="height: 250px"></horizontal-bar-chart>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-card class="chart-card-dark" style="border-right: none">
          <bar-chart></bar-chart>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="chart-card-dark">
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
    this.$http(process.env.userApiEndpoit)
      .get("/api/v1/user/account?user_id=" + this.getUserId)
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
};
</script>
<style lang="scss" scoped>
.photo-to-circle {
  background-image: url("../assets/img/no_photo.png");
  background-size: cover;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-position: left top;
  border: 2px solid #f3f3f3;
}
.total-time-box {
  padding: 20px;
  color: #fff;
  & h2 {
    margin-bottom: 0px;
    color: #fff;
  }
}
#total-time {
  font-size: 60px;
  color: #fff;
}
.chart-card {
  padding: 0px 15px 10px 15px;
  margin: 10px;
  border-radius: 10px;
}
.chart-card-dark {
  background: #444c57;
  border: none;
  padding: 0px 15px 10px 15px;
  margin: 10px;
  border-radius: 10px;

  & h2 {
    color: #fff;
  }

  & span {
    color: #fff;
  }
}
.account_name {
  font-size: 24px;
  display: block;
  color: #fff;
}
.introduction {
  color: #fff;
  font-size: 13px;
}
</style>