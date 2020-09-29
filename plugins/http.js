import Vue from "vue";
import axios from "axios";

const http = apiEndpoit =>
  axios.create({
    baseURL: apiEndpoit,
    timeout: 10000
  });

Vue.prototype.$http = http;

export default Vue.prototype.$http;
