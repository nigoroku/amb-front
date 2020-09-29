<template>
  <a-modal
    title="今日の目標"
    :visible="isShowTodoModal"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    width="60%"
  >
    <a-form-model ref="todoForm" :model="todoForm" v-bind="formItemLayoutWithOutLabel">
      <a-form-model-item
        v-for="(todo, index) in todoForm.todos"
        :key="todo.key"
        v-bind="index === 0 ? formItemLayout : {}"
        :label="index === 0 ? '目標' : ''"
        :prop="'todos.' + index + '.content'"
        :rules="{
        required: true,
        message: '目標を設定してください',
        trigger: 'blur',
      }"
      >
        <a-input
          v-model="todo.content"
          placeholder="今日の目標は何にする？"
          style="width: 70%; margin-right: 8px"
        />
        <a-icon
          v-if="todoForm.todos.length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="todoForm.todos.length === 1"
          @click="removeTodo(index)"
        />
      </a-form-model-item>
      <a-form-model-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 70%" @click="addTodo">
          <a-icon type="plus" />Add Todo
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">キャンセル</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">登録する</a-button>
    </template>
  </a-modal>
</template>
<script>
import MultipleTagSelect from "@/components/MultipleTagSelect";
import InputField from "@/components/InputField";
import { mapState, mapGetters } from "vuex";

export default {
  name: "TodoModal",
  components: {
    MultipleTagSelect,
    InputField,
  },
  data() {
    return {
      confirmLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      todoForm: {
        todos: [
          {
            content: "",
            key: Date.now(),
          },
        ],
        user_id: "",
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeTodo(index) {
      this.todoForm.todos.splice(index, 1);
    },
    addTodo() {
      this.todoForm.todos.push({
        content: "",
        key: Date.now(),
      });
    },
    handleOk(e) {
      this.confirmLoading = true;
      const self = this;
      this.todoForm.user_id = this.getUserId;
      this.$http(process.env.todoApiEndpoit)
        .post("/api/v1/todo/create", this.todoForm)
        .then(function (response) {
          response.data.todos.forEach((ele) => {
            self.$store.commit("addTodo", {
              todo_detail_id: ele.todo_detail_id,
              content: ele.content,
              checked: false,
            });
          });
        })
        .catch(function () {})
        .finally(function () {
          self.handleCancel();
          self.confirmLoading = false;
        });
    },
    handleCancel() {
      this.$store.commit("toggleTodoModal");
    },
  },
  computed: {
    ...mapState(["isShowTodoModal"]),
    ...mapGetters(["getUserId"]),
  },
};
</script>
