import Vue from "vue";
import Router from "vue-router";
import mainland from "./components/mainland.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "mainland",
      component: mainland
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/auth/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/login.vue")
    },
    {
      path: "contact",
      name: "contact",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/contact.vue")
    },
    {
      path: "/auth/register",
      name: "register",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/register.vue")
    },
    {
      path: "/profile/:user",
      name: "profile",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/profile.vue")
    },
    {
      path: "/likedposts",
      name: "likedposts",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/likedposts.vue")
    }
  ]
});
