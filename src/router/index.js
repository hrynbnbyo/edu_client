import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";

Vue.use(Router)

export default new Router({
  routes: [
      {path: "/home" , component: Home},
      {path: "/login" , component: Login},
      {path: "/" , redirect: "home"},
      {path: "/*" , redirect: "home"},
      {path: "/register" , component: Register},
  ]
})
