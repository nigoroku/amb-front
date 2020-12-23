const cookieparser = process.server ? require("cookieparser") : undefined;

export const state = () => ({
  currentPage: "1",
  isShowTodoModal: false,
  isShowPerformanceModal: false,
  isShowAlert: false,
  auth: null,
  accountName: "",
  locales: ["en", "ja"],
  locale: "ja",
  todos: [
    {
      date: "",
      details: []
    }
  ],
  publicUserId: "",
  loading: false
});

export const getters = {
  getUserId: state => {
    if (state.auth == null) {
      return null;
    }
    let payLoad = state.auth.accessToken.split(".")[1];
    return JSON.parse(atob(payLoad)).id;
  },
  getPublicUserId: state => {
    return state.publicUserId;
  },
  getLoading: state => {
    return state.loading;
  }
};

export const mutations = {
  setCurrentPage(state, payload) {
    state.currentPage = payload;
  },
  setAuth(state, auth) {
    state.auth = auth;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setAccountName(state, accountName) {
    state.accountName = accountName;
  },
  initTodo(state, todos) {
    state.todos = todos;
  },
  addTodo(state, { date, details }) {
    let dt = details.map(function(d) {
      return {
        todo_detail_id: d.todo_detail_id,
        content: d.content,
        checked: d.checked
      };
    });
    // 日付でソートする
    let sort = t => {
      t.sort(function(a, b) {
        if (a.date > b.date) {
          return -1;
        } else {
          return 1;
        }
      });
    };

    state.todos.forEach(t => {
      if (t.date == date) {
        t.detsils.push(dt);
        sort(state.todos);
        return;
      }
    });
    state.todos.push({
      date: date,
      details: dt
    });
    sort(state.todos);
  },
  checkTodo(state, { date, todo_detail_id, checked }) {
    state.todos.forEach(t => {
      if (t.date == date) {
        t.details.forEach(td => {
          if (td.todo_detail_id == todo_detail_id) {
            td.checked = checked;
          }
        });
      }
    });
  },
  toggleTodoModal(state, payload = null) {
    state.isShowTodoModal = !state.isShowTodoModal;
  },
  toggleAlert(state, payload = null) {
    state.isShowAlert = !state.isShowAlert;
  },
  togglePerformanceModal(state, payload = null) {
    state.isShowPerformanceModal = !state.isShowPerformanceModal;
  },
  setLang(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale;
    }
  },
  setPublicUserId(state, payload) {
    state.publicUserId = payload;
  }
};

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let auth = null;
    let accountName = null;
    console.log(req);
    if (typeof req === "undefined" || typeof req.headers === "undefined") {
      return;
    }
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
