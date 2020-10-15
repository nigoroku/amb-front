<template>
  <a-modal
    title="今日の実績"
    :visible="isShowPerformanceModal"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    width="60%"
  >
    <section class="modal-card-body">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="目標達成状況">
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
                <hr />
              </a-row>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="今日のInput">
          <a-form-model
            ref="inputForm"
            :model="inputForm"
            v-bind="formItemLayout2"
          >
            <a-form-model-item label="カテゴリ">
              <multiple-tag-select
                :categories="categories"
                :default_categories="inputForm.default_categories"
                @select="setInputCategories"
              />
            </a-form-model-item>
            <a-form-model-item label="所要時間">
              <a-time-picker
                :default-open-value="moment('00:00', 'HH:mm')"
                format="HH:mm"
                v-model="inputForm.achievement.input_time"
                placeholder="select time..."
              ></a-time-picker>
            </a-form-model-item>
            <a-form-model-item label="参考 URL">
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
        </a-tab-pane>
        <a-tab-pane key="3" tab="今日のOutput" force-render>
          <a-form-model
            ref="outputForm"
            :model="outputForm"
            v-bind="formItemLayout2"
          >
            <a-form-model-item label="カテゴリ" :categories="categories">
              <multiple-tag-select
                :categories="categories"
                :default_categories="outputForm.default_categories"
                @select="setOutputCategories"
              />
            </a-form-model-item>
            <a-form-model-item label="所要時間">
              <a-time-picker
                :default-open-value="moment('00:00', 'HH:mm')"
                format="HH:mm"
                v-model="outputForm.achievement.output_time"
                placeholder="select time..."
              ></a-time-picker>
            </a-form-model-item>
            <a-form-model-item label="参考 URL">
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
        </a-tab-pane>
      </a-tabs>
    </section>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">キャンセル</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk"
        >更新する</a-button
      >
    </template>
  </a-modal>
</template>
<script>
import MultipleTagSelect from "@/components/MultipleTagSelect";
import InputField from "@/components/InputField";
import { mapState, mapGetters } from "vuex";
import moment from "moment";

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
          input_time: "",
          reference_url: "",
          summary: "",
          user_id: "",
        },
      },
      outputForm: {
        category_ids: [],
        default_categories: [],
        achievement: {
          output_time: "",
          reference_url: "",
          summary: "",
          user_id: "",
        },
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
          self.inputForm.achievement.input_time = input.input_time;
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
          self.outputForm.achievement.output_time = output.output_time;
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
      console.log("inppppppp");
      console.log(this.inputForm);
      this.$http(process.env.achievementApiEndpoit)
        .post("/api/v1/achievement/input/register", this.inputForm)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function () {});
    },
    updateOutput(userId) {
      this.outputForm.achievement.user_id = userId;
      console.log("outttttt");
      console.log(this.outputForm);
      this.$http(process.env.achievementApiEndpoit)
        .post("/api/v1/achievement/output/register", this.outputForm)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function () {});
    },
    isTodayTodo(date) {
      let now = moment(new Date());
      return now.format("YYYY/MM/DD") == date;
    },
    handleOk(e) {
      this.confirmLoading = true;
      let self = this;
      Promise.all([
        this.updateTodo(),
        this.updateInput(this.getUserId),
        this.updateOutput(this.getUserId),
      ])
        .then((responses) => {})
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setTimeout(() => {
            self.confirmLoading = false;
            self.$store.commit("togglePerformanceModal");
            self.$store.commit("toggleAlert");
            setTimeout(() => {
              self.$store.commit("toggleAlert");
            }, 3500);
          }, 2000);
        });
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
      val.split(",").forEach((v) => this.inputForm.category_ids.push(v));
    },
    setOutputCategories(val) {
      this.outputForm.category_ids = [];
      val.split(",").forEach((v) => this.outputForm.category_ids.push(v));
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
