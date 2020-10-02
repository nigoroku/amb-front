const cookieparser = process.server ? require("cookieparser") : undefined;

export const state = () => ({
  currentPage: "1",
  isShowTodoModal: false,
  isShowPerformanceModal: false,
  isShowAccountModal: false,
  isShowAlert: false,
  auth: null,
  accountName: "",
  locales: ["en", "ja"],
  locale: "ja",
  todos: []
});

export const getters = {
  getUserId: state => {
    if (state.auth == null) {
      return null;
    }
    let payLoad = state.auth.accessToken.split(".")[1];
    return JSON.parse(atob(payLoad)).id;
  }
};

export const mutations = {
  setCurrentPage(state, payload) {
    state.currentPage = payload;
  },
  setAuth(state, auth) {
    state.auth = auth;
  },
  setAccountName(state, accountName) {
    state.accountName = accountName;
  },
  initTodo(state, todos) {
    state.todos = todos;
  },
  addTodo(state, { todo_detail_id, content, checked }) {
    state.todos.push({
      todo_detail_id: todo_detail_id,
      content: content,
      checked: checked
    });
  },
  checkTodo(state, { todo_detail_id, checked }) {
    state.todos.forEach(t => {
      if (t.todo_detail_id == todo_detail_id) {
        t.checked = checked;
      }
    });
  },
  toggleTodoModal(state, payload = null) {
    state.isShowTodoModal = !state.isShowTodoModal;
  },
  toggleAlert(state, payload = null) {
    state.isShowAlert = !state.isShowAlert;
  },
  toggleAccountModal(state, payload = null) {
    state.isShowAccountModal = !state.isShowAccountModal;
  },
  togglePerformanceModal(state, payload = null) {
    state.isShowPerformanceModal = !state.isShowPerformanceModal;
  },
  setLang(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale;
    }
  }
};

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let auth = null;
    let accountName = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        auth = JSON.parse(parsed.auth);
        let payLoad = auth.accessToken.split(".")[1];
        let account = JSON.parse(atob(payLoad));
        accountName = account.accountName;
      } catch (err) {
        // No valid cookie found
      }
    }
    commit("setAuth", auth);
    commit("setAccountName", accountName);
  }
};
