import decode from "jwt-decode";
import moment from "moment";
import auth0 from "auth0-js";
import Router from "vue-router";
import LocalStorage from "@/utils/model/LocalStorage";
const ID_TOKEN_KEY = "id_token";
const ACCESS_TOKEN_KEY = "access_token";

const CLIENT_ID = "{AUTH0_CLIENT_ID}";
const CLIENT_DOMAIN = "{AUTH0_DOMAIN}";
// const REDIRECT = "YOUR_CALLBACK_URL";
// const SCOPE = "{SCOPE}";
// const AUDIENCE = "AUDIENCE_ATTRIBUTE";

export class StaticAuth {
  static loggedIn = false;
  // auth
  static auth = new auth0.WebAuth({
    clientID: CLIENT_ID,
    domain: CLIENT_DOMAIN
  });

  // Route
  static router = new Router({
    mode: "history"
  });

  // SetAuthHeader
  static getToken() {
    let loginSession = "";
    let token = "foobar";
    const tmpLoginSession = window.localStorage.getItem(
      LocalStorage.saveLoginSession
    );
    if (tmpLoginSession != null && tmpLoginSession != undefined) {
      loginSession = tmpLoginSession;
    }
    if (loginSession != "") {
      const sessionData = JSON.parse(loginSession);
      token = sessionData.session_key;
    }
    alert(token);
    return token;
  }

  // checkLogined
  static checkLogined() {
    let loginSession = "";
    const tmpLoginSession = window.localStorage.getItem(
      LocalStorage.saveLoginSession
    );
    if (tmpLoginSession != null && tmpLoginSession != undefined) {
      loginSession = tmpLoginSession;
    }
    if (loginSession == "") return false;
    const sessionData = JSON.parse(loginSession);
    const expireNowUnix = moment().unix();
    // expire
    if (sessionData.expire_unix < expireNowUnix) {
      alert("Session is timeout!");
      this.logout();
    }

    this.loggedIn = true;
    return this.loggedIn;
  }

  // login
  static login() {
    this.loggedIn = true;
    // TODO
    /*
    this.auth.authorize({
      responseType: "token id_token",
      redirectUri: REDIRECT,
      audience: AUDIENCE,
      scope: SCOPE
    });
    */
  }

  // logout
  static logout() {
    this.loggedIn = false;
    window.localStorage.removeItem(LocalStorage.saveLoginSession);

    // TODO
    /*
    this.clearIdToken();
    this.clearAccessToken();
    this.router.push({ path: "/" });
    */
  }

  // requireAuth
  static requireAuth() {
    //
    this.router.beforeEach((to, from, next) => {
      if (
        to.matched.some(record => record.meta.requiresAuth) &&
        !this.loggedIn
      ) {
        next({ path: "/", query: { redirect: to.fullPath } });
      } else {
        next();
      }
    });

    // TODO
    /*
    if (!this.isLoggedIn()) {
      next({
        path: "/",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
    */
  }

  // updateSessionTime
  static updateSessionTime() {
    let loginSession = "";
    const tmpLoginSession = window.localStorage.getItem(
      LocalStorage.saveLoginSession
    );
    if (tmpLoginSession != null && tmpLoginSession != undefined) {
      loginSession = tmpLoginSession;
    }
    if (loginSession == "") return false;
    const sessionData = JSON.parse(loginSession);
    sessionData.expire_unix = moment()
      .add("minutes", LocalStorage.localStorageExpire)
      .unix();
    window.localStorage.setItem(
      LocalStorage.saveLoginSession,
      JSON.stringify(sessionData)
    );
  }

  static getIdToken() {
    return localStorage.getItem(ID_TOKEN_KEY);
  }

  static getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static clearIdToken() {
    localStorage.removeItem(ID_TOKEN_KEY);
  }

  static clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  // access_token / id_token
  static getParameterByName(name) {
    let match = RegExp("[#&]" + name + "=([^&]*)").exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
  }

  // access_token
  static setAccessToken() {
    let accessToken = this.getParameterByName("access_token");
    var checkAccessToken = accessToken == null ? "" : accessToken;
    localStorage.setItem(ACCESS_TOKEN_KEY, checkAccessToken);
  }

  // id_token
  static setIdToken() {
    let idToken = this.getParameterByName("id_token");
    var checkIdToken = idToken == null ? "" : idToken;
    localStorage.setItem(ID_TOKEN_KEY, checkIdToken);
  }

  // isLoggedIn
  static isLoggedIn() {
    const idToken = this.getIdToken();
    return !!idToken && !this.isTokenExpired(idToken);
  }

  // getTokenExpirationDate
  static getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(token.exp);
    return date;
  }

  static isTokenExpired(token) {
    const expirationDate = this.getTokenExpirationDate(token);
    if (expirationDate == null) return false;
    return expirationDate < new Date();
  }
}
