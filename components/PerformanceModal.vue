<template>
  <a-modal
    title="今日の実績"
    :visible="isShowPerformanceModal"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
    width="60%"
  >
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="目標達成状況">
        <section class="modal-card-body">
          <p v-if="todos.length == 0">まだ目標が登録されていません。</p>
          <a-form-model
            v-if="todos.length > 0"
            v-bind="{ wrapperCol: { offset: 1 } }"
          >
            <a-form-model-item>
              <a-row v-for="todo in todos" :key="String(todo.date)">
                <p style="margin-bottom: 0px">
                  {{ isTodayTodo(todo.date) ? "本日" : todo.date }}の目標
                </p>
                <div
                  v-for="td in todo.details"
                  :key="String(td.todo_detail_id)"
                >
                  <a-checkbox
                    :checked="td.checked"
                    :value="todo.date"
                    :id="String(td.todo_detail_id)"
                    @change="onChange"
                    >{{ td.content }}</a-checkbox
                  >
                </div>
              </a-row>
            </a-form-model-item>
          </a-form-model>
        </section>
        <div v-if="todos.length != 0">
          <a-button key="back" @click="handleCancel">キャンセル</a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="confirmLoading"
            @click="handleTodoOk"
            >更新する</a-button
          >
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="今日のInput">
        <section class="modal-card-body">
          <a-form-model
            ref="inputForm"
            :rules="rules"
            :model="inputForm"
            v-bind="formItemLayout2"
          >
            <a-form-model-item prop="category_ids" required label="カテゴリ">
              <multiple-tag-select
                :categories="categories"
                :default_categories="inputForm.default_categories"
                @select="setInputCategories"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="achievement.input_time"
              required
              label="所要時間"
            >
              <a-time-picker
                format="HH:mm"
                v-model="inputForm.achievement.input_time"
                placeholder="select time..."
              ></a-time-picker>
            </a-form-model-item>
            <a-form-model-item
              prop="achievement.reference_url"
              label="参考 URL"
            >
              <a-input
                placeholder="reference URL..."
                v-model="inputForm.achievement.reference_url"
                type="url"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="内容">
              <a-input
                type="textarea"
                v-model="inputForm.achievement.summary"
                :auto-size="{ minRows: 4, maxRows: 8 }"
              />
            </a-form-model-item>
          </a-form-model>
        </section>
        <div class="modal-footer">
          <a-button key="back" @click="handleCancel">キャンセル</a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="confirmLoading"
            @click="handleInputOk"
            >更新する</a-button
          >
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="今日のOutput" force-render>
        <section class="modal-card-body">
          <a-form-model
            ref="outputForm"
            :rules="rules"
            :model="outputForm"
            v-bind="formItemLayout2"
          >
            <a-form-model-item prop="category_ids" required label="カテゴリ">
              <multiple-tag-select
                :categories="categories"
                :default_categories="outputForm.default_categories"
                @select="setOutputCategories"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="achievement.output_time"
              required
              label="所要時間"
            >
              <a-time-picker
                format="HH:mm"
                v-model="outputForm.achievement.output_time"
                placeholder="select time..."
              ></a-time-picker>
            </a-form-model-item>
            <a-form-model-item
              prop="achievement.reference_url"
              label="参考 URL"
            >
              <a-input
                placeholder="reference URL..."
                v-model="outputForm.achievement.reference_url"
                type="url"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item label="内容">
              <a-input
                type="textarea"
                v-model="outputForm.achievement.summary"
                :auto-size="{ minRows: 4, maxRows: 8 }"
              />
            </a-form-model-item>
          </a-form-model>
        </section>
        <div class="modal-footer">
          <a-button key="back" @click="handleCancel">キャンセル</a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="confirmLoading"
            @click="handleOutputOk"
            >更新する</a-button
          >
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script>
import MultipleTagSelect from "@/components/MultipleTagSelect";
import InputField from "@/components/InputField";
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import _ from "lodash";

const horizontalLayout1 = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 },
};

const horizontalLayout2 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 12 },
};

export default {
  name: "PerformanceModal",
  components: {
    MultipleTagSelect,
    InputField,
  },
  data() {
    return {
      confirmLoading: false,
      categories: [],
      inputForm: {
        category_ids: [],
        default_categories: [],
        achievement: {
          input_time: null,
          reference_url: "",
          summary: "",
          user_id: "",
        },
      },
      outputForm: {
        category_ids: [],
        default_categories: [],
        achievement: {
          output_time: null,
          reference_url: "",
          summary: "",
          user_id: "",
        },
      },
      rules: {
        category_ids: [
          {
            type: "array",
            required: true,
            message: "カテゴリは必ず選択してください",
            trigger: "change",
          },
        ],
        "achievement.input_time": [
          {
            required: true,
            message: "所要時間は必ず入力してください",
            trigger: "change",
          },
        ],
        "achievement.output_time": [
          {
            required: true,
            message: "所要時間は必ず入力してください",
            trigger: "change",
          },
        ],
        "achievement.reference_url": [
          {
            type: "url",
            message: "正しい形式で入力してください",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    moment,
    getTodoList(self, userId) {
      this.$http(process.env.todoApiEndpoit)
        .get("/api/v1/todo/select?user_id=" + userId)
        .then(function (response) {
          self.$store.commit("initTodo", []);
          response.data.todos.forEach((ele) => {
            self.$store.commit("addTodo", {
              date: ele.date,
              details: ele.todos,
            });
          });
        })
        .catch(function () {});
    },
    setCategories(self) {
      this.$http(process.env.achievementApiEndpoit)
        .get("/api/v1/achievement/category")
        .then(function (response) {
          self.categories = response.data.categories;
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    setInputForm(self, userId) {
      this.$http(process.env.achievementApiEndpoit)
        .get("/api/v1/achievement/input?user_id=" + userId)
        .then(function (response) {
          let input = response.data.input;
          if (input == null) {
            return;
          }
          self.inputForm.achievement.input_time = self.toStrTimeFromMinutes(
            input.input_time
          );
          self.inputForm.achievement.reference_url = input.reference_url;
          self.inputForm.achievement.summary = input.summary;
          self.inputForm.achievement.user_id = input.user_id;
          let ct = response.data.categories;
          if (ct == null) {
            return;
          }
          let category_ids = ct.map((c) => {
            return String(c.category_id);
          });
          self.inputForm.default_categories = category_ids;
          self.inputForm.category_ids = category_ids;
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    setOutputForm(self, userId) {
      this.$http(process.env.achievementApiEndpoit)
        .get("/api/v1/achievement/output?user_id=" + userId)
        .then(function (response) {
          let output = response.data.output;
          if (output == null) {
            return;
          }
          self.outputForm.achievement.output_time = self.toStrTimeFromMinutes(
            output.output_time
          );
          self.outputForm.achievement.reference_url = output.reference_url;
          self.outputForm.achievement.summary = output.summary;
          self.outputForm.achievement.user_id = output.user_id;
          let ct = response.data.categories;
          if (ct == null) {
            return;
          }
          let category_ids = ct.map((c) => {
            return String(c.category_id);
          });
          self.outputForm.default_categories = category_ids;
          self.outputForm.category_ids = category_ids;
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    updateTodo() {
      const details = this.todos.flatMap((t) => t.details);
      this.$http(process.env.todoApiEndpoit)
        .post("/api/v1/todo/edit", details)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function () {});
    },
    updateInput(userId) {
      this.inputForm.achievement.user_id = userId;

      let submitForm = _.cloneDeep(this.inputForm);

      if (submitForm.achievement.input_time != null) {
        let timeStr = submitForm.achievement.input_time.format("HH:mm");
        // 分に変換して登録する
        submitForm.achievement.input_time = this.toMinutesFromTimeStr(timeStr);
      }
      console.log(submitForm);
      this.$http(process.env.achievementApiEndpoit)
        .post("/api/v1/achievement/input/register", submitForm)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function () {});
    },
    updateOutput(userId) {
      this.outputForm.achievement.user_id = userId;

      let submitForm = _.cloneDeep(this.outputForm);

      if (submitForm.achievement.output_time != null) {
        let timeStr = submitForm.achievement.output_time.format("HH:mm");
        // 分に変換して登録する
        submitForm.achievement.output_time = this.toMinutesFromTimeStr(timeStr);
      }
      this.$http(process.env.achievementApiEndpoit)
        .post("/api/v1/achievement/output/register", submitForm)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function () {});
    },
    isTodayTodo(date) {
      let now = moment(new Date());
      return now.format("YYYY/MM/DD") == date;
    },
    async handleTodoOk(e) {
      try {
        this.confirmLoading = true;
        let self = this;
        Promise.all([this.updateTodo()])
          .then((responses) => {})
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setTimeout(() => {
              self.confirmLoading = false;
              self.$store.commit("toggleAlert");
              setTimeout(() => {
                self.$store.commit("toggleAlert");
              }, 2500);
            }, 2000);
          });
      } catch {
        return;
      }
    },
    async handleInputOk(e) {
      try {
        // エラーチェック
        await this.$refs.inputForm.validate();
        // エラーがない場合
        this.confirmLoading = true;
        let self = this;
        Promise.all([this.updateInput(this.getUserId)])
          .then((responses) => {})
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setTimeout(() => {
              self.confirmLoading = false;
              self.$store.commit("toggleAlert");
              setTimeout(() => {
                self.$store.commit("toggleAlert");
              }, 2500);
            }, 2000);
          });
      } catch {
        return;
      }
    },
    async handleOutputOk(e) {
      try {
        // エラーチェック
        await this.$refs.outputForm.validate();
        // エラーがない場合
        this.confirmLoading = true;
        let self = this;
        Promise.all([this.updateOutput(this.getUserId)])
          .then((responses) => {})
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setTimeout(() => {
              self.confirmLoading = false;
              self.$store.commit("toggleAlert");
              setTimeout(() => {
                self.$store.commit("toggleAlert");
              }, 2500);
            }, 2000);
          });
      } catch {
        return;
      }
    },
    handleCancel(e) {
      this.$store.commit("togglePerformanceModal");
    },
    onChange(e) {
      this.$store.commit("checkTodo", {
        date: e.target.value,
        todo_detail_id: e.target.id,
        checked: e.target.checked,
      });
    },
    setInputCategories(val) {
      this.inputForm.category_ids = [];
      if (val.length == 0) {
        return;
      }
      val.split(",").forEach((v) => this.inputForm.category_ids.push(v));
    },
    setOutputCategories(val) {
      this.outputForm.category_ids = [];
      if (val.length == 0) {
        return;
      }
      val.split(",").forEach((v) => this.outputForm.category_ids.push(v));
    },
    // 「xx:xx」形式（文字列）→時間（数値）
    toMinutesFromTimeStr(timeStr) {
      if (timeStr == "" || timeStr.length < 5) {
        return 0;
      }
      let hour = timeStr.slice(0, 2);
      let min = timeStr.slice(-2);
      // 分に変換して登録する
      return Number(hour) * 60 + Number(min);
    },
    // 時間（数値）→「xx:xx」形式（文字列）
    toStrTimeFromMinutes(minutes) {
      if (minutes >= 24 * 60 || minutes < 0) {
        return "";
      }
      var h = (minutes / 60) | 0,
        m = minutes % 60 | 0;
      return moment.utc().hours(h).minutes(m);
    },
  },
  computed: {
    formItemLayout1() {
      return horizontalLayout1;
    },
    formItemLayout2() {
      return horizontalLayout2;
    },
    ...mapState(["isShowPerformanceModal", "todos", "auth"]),
    ...mapGetters(["getUserId"]),
  },
  mounted: function mounted() {
    const self = this;
    if (this.auth == null) {
      return;
    }
    // 並列実行
    Promise.all([
      this.getTodoList(self, this.getUserId),
      this.setInputForm(self, this.getUserId),
      this.setOutputForm(self, this.getUserId),
      this.setCategories(self),
    ])
      .then((responses) => {
        // responses.forEach((res) => console.log(res.data));
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {});
  },
};
</script>
<style lang="scss" scoped>
.modal-footer {
  width: 62.5%;
  text-align: right;
}
</style>
