import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Check_Pwd from "../components/Check_Pwd";
import Course from "../components/Course";
import Detail from "../components/Detail";

Vue.use(Router)

export default new Router({
  routes: [
      {path: "/home" , component: Home},
      {path: "/login" , component: Login},
      {path: "/register" , component: Register},
      {path: "/course" , component: Course},
      {path: "/detail" , component: Detail},
      // {path: "/Check_Pwd" , component: Check_Pwd},
      {path: "/" , redirect: "home"},
      {path: "/*" , redirect: "home"},

  ]
})
