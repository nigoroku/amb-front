<template>
  <div id="charts-container" class="container">
    <a-row class="top-bar">
      <a-col :span="10" style="padding-left: 30px">
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
      <a-col :span="14" style="display: flex">
        <a-card class="no-border">
          <h2>総学習時間</h2>
          <span id="total-time">{{ total_learning_time }}</span
          ><span> 時間</span>
        </a-card>
        <div class="time-box-list">
          <a-card class="left-border">
            <h3>今週の学習時間</h3>
            <span class="unit-time">{{ calcWeekTotalTime }}</span
            ><span> 時間</span>
          </a-card>
          <a-card class="left-border">
            <h3>今月の学習時間</h3>
            <span class="unit-time">{{ calcMonthTotalTime }}</span
            ><span> 時間</span>
          </a-card>
          <a-card class="left-border">
            <h3>今年の学習時間</h3>
            <span class="unit-time">{{ calcYearTotalTime }}</span
            ><span> 時間</span>
          </a-card>
        </div>
      </a-col>
      <a-dropdown class="share-dropdown">
        <a class="share-dropdown-link" @click="(e) => e.preventDefault()">
          <font-awesome-icon class="share-icon" icon="share-square" />
          共有する
        </a>
        <a-menu slot="overlay" class="share-links">
          <a-menu-item>
            <a href="#" @click="createShareURLToken"
              ><font-awesome-icon icon="link" /> 公開URLを発行する</a
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-row>
    <a-row v-if="total_learning_time != 0">
      <a-col :span="24" class="gutter-top-box"
        ><a-card class="chart-card" style="border-bottom: none">
          <horizontal-bar-chart
            :percents="achievement_percentag"
            style="height: 180px"
          ></horizontal-bar-chart>
        </a-card>
      </a-col>
    </a-row>
    <a-row v-if="total_learning_time != 0">
      <a-col :span="12" class="gutter-left-box">
        <a-card class="chart-card" style="border-right: none">
          <bar-chart :category_distribution="category_distribution"></bar-chart>
        </a-card>
      </a-col>
      <a-col :span="12" class="gutter-right-box">
        <a-card class="chart-card">
          <a-select
            default-value="days"
            class="unit-selector"
            @change="handleUnitChange"
          >
            <a-select-option value="days"> 週 </a-select-option>
            <a-select-option value="month"> 月 </a-select-option>
            <a-select-option value="year"> 年 </a-select-option>
          </a-select>
          <line-chart :date_unit="selected_learning_transition"></line-chart>
        </a-card>
      </a-col>
    </a-row>
    <a-row v-if="total_learning_time == 0">
      <a-col :span="24" class="no-data-box">
        <a-card class="chart-card">
          <h2>
            登録された実績はありません。<br />実績が登録されるとグラフが表示されます。
          </h2>
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      :visible="isShowShareModal"
      :confirm-loading="confirmShareLoading"
      @cancel="handleShareCancel"
      width="40%"
      centered
      :maskStyle="maskStyle"
      class="share-modal"
    >
      <h2><font-awesome-icon icon="link" /> リンクを取得する</h2>
      <div class="share-url-box">
        <a-input class="share-url-input" v-model="shareUrl" />
        <button type="button" class="url-copy-button" @click="onLinkCopy">
          リンクをコピー
        </button>
      </div>
      <a-alert
        message="このリンクを知っているインターネット上の全員が閲覧できます"
        type="info"
        show-icon
      />
      <template slot="footer">
        <a-button key="back" @click="handleShareCancel">キャンセル</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="confirmShareLoading"
          @click="handleShareOk"
          >公開する</a-button
        >
      </template>
    </a-modal>
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
      account_name: "",
      introduction: "",
      total_learning_time: 0,
      achievement_percentag: {
        input_percentag: 0,
        input_total_time: 0,
        output_percentag: 0,
        output_total_time: 0,
      },
      category_distribution: [],
      learning_transition: {
        years: [],
        months: [],
        days: [],
      },
      selected_learning_transition: [],
      isShowShareModal: false,
      confirmShareLoading: false,
      maskStyle: { background: "#000000d4" },
      shareForm: {
        user_id: "",
        token: "",
      },
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
    calcWeekTotalTime: function () {
      let times = this.learning_transition.days.map((l) => l.time);
      let result = times.reduce(function (prev, current, i, arr) {
        return prev + current;
      }, 0);
      return Math.round((result / 60) * 10) / 10;
    },
    calcMonthTotalTime: function () {
      if (this.learning_transition.months.length < 12) {
        return 0;
      }
      return (
        Math.round((this.learning_transition.months[11].time / 60) * 10) / 10
      );
    },
    calcYearTotalTime: function () {
      if (this.learning_transition.months.length < 12) {
        return 0;
      }
      return (
        Math.round((this.learning_transition.years[11].time / 60) * 10) / 10
      );
    },
    shareUrl: function () {
      return process.env.frontEndpoit + "/public?token=" + this.shareForm.token;
    },
  },
  mounted: function () {
    if (this.getUserId == null) {
      return;
    }

    let self = this;
    // アカウント情報取得
    this.findAccount(self);

    // 学習時間集計値取得
    this.setLearningTimeAggregate();

    // 集計単位ごとの学習時間推移取得
    this.setLearningTimeTransition();
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
    setLearningTimeAggregate() {
      let self = this;
      this.$http(process.env.achievementApiEndpoit)
        .get("/api/v1/achievement/aggregate?user_id=" + self.getUserId)
        .then(function (response) {
          let result = response.data.aggregate_results;
          if (result.total_learning_time != 0) {
            self.total_learning_time =
              Math.round((result.total_learning_time / 60) * 10) / 10;
          }
          self.achievement_percentag = result.AchievementPercentag;
          self.category_distribution = result.CategoryDistribution;
        })
        .catch(function () {})
        .finally(function () {});
    },
    // 集計単位ごとの学習時間推移取得
    setLearningTimeTransition() {
      let self = this;
      this.$http(process.env.achievementApiEndpoit)
        .get(
          "/api/v1/achievement/transition/aggregate?user_id=" + self.getUserId
        )
        .then(function (response) {
          let result = response.data.learning_transition;
          self.learning_transition.years = result.YearLearningTransition;
          self.learning_transition.months = result.MonthLearningTransition;
          self.learning_transition.days = result.DaysLearningTransition;
          self.selected_learning_transition = self.learning_transition.days;
        })
        .catch(function () {})
        .finally(function () {});
    },
    handleUnitChange(selected) {
      if (selected == "days") {
        this.selected_learning_transition = this.learning_transition.days;
      } else if (selected == "month") {
        this.selected_learning_transition = this.learning_transition.months;
      } else {
        this.selected_learning_transition = this.learning_transition.years;
      }
    },
    createShareURLToken() {
      let self = this;
      this.$http(process.env.userApiEndpoit)
        .get("/api/v1/user/share?user_id=" + self.getUserId)
        .then(function (response) {
          let token = response.data.share_token;
          self.shareForm.token = token;
          self.isShowShareModal = !self.isShowShareModal;
        })
        .catch(function () {})
        .finally(function () {});
    },
    handleShareOk(e) {
      this.confirmLoading = true;
      const self = this;
      this.shareForm.user_id = this.getUserId;
      this.$http(process.env.userApiEndpoit)
        .post("/api/v1/user/share/regite", this.shareForm)
        .then(function (response) {
          self.$message.success("公開URLにアクセスできるようになりました", 2);
        })
        .catch(function () {})
        .finally(function () {
          self.handleShareCancel();
          self.confirmLoading = false;
        });
    },
    handleShareCancel() {
      this.isShowShareModal = !this.isShowShareModal;
    },
    onLinkCopy() {
      this.$copyText(this.shareUrl);
      this.$message.success("リンクをコピーしました。", 2);
    },
  },
};
</script>
<style lang="scss" scoped>
#charts-container {
  width: 75%;
  margin: auto;
}
.photo-to-circle {
  background-image: url("../assets/img/no_photo.png");
  background-size: cover;
  width: 70px;
  height: 70px;
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
.gutter-top-box {
  margin-top: 10px;
  margin-bottom: 10px;
}
.gutter-left-box {
  padding-right: 5px;
  padding-bottom: 20px;
}
.gutter-right-box {
  padding-left: 5px;
  padding-bottom: 20px;
}
.no-data-box {
  margin-top: 20px;
  & .chart-card {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    & h2 {
      color: #b7b7b7;
    }
  }
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
  margin-top: 15px;
}
.no-border {
  border: none;
}
.left-border {
  border: none;
}
.account_name {
  font-size: 24px;
  display: block;
}
.introduction {
  font-size: 13px;
}
.unit-selector {
  position: absolute;
  left: 20px;
  top: 15px;
}
.time-box-list {
  display: flex;
  margin-top: 45px;
  margin-left: 60px;
}
.unit-time {
  font-size: 30px;
}
.share-dropdown {
  position: absolute;
  right: 20px;
  top: 20px;

  & .share-links i {
    margin-right: 5px;
  }
}
.share-icon {
  font-size: 18px;
  margin-right: 2px;
}
.share-modal {
  & .share-url-input {
    width: 70%;
    color: #1e8e3e;
    background: #d9efdf;
  }
  & .url-copy-button {
    color: #1a73e8;
    background: #d2e0f3;
    border: none;
    padding: 5px 8px;
    cursor: pointer;
  }
  & h2 {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  & .share-url-box {
    margin-top: 30px;
    margin-bottom: 10px;
  }
}
</style>