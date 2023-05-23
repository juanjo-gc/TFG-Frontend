import { useUserStore } from "@/store/UserStore";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: false,
      adminAuth: false,
      userAuth: false,
    }
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: true,
      userAuth: false,
    }
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName "login" */ "@/views/LoginView.vue"),
    meta: {
      requiresAuth: false,
      adminAuth: false,
      userAuth: false,
    }
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/RegisterView.vue"),
    meta: {
      requiresAuth: false,
      adminAuth: false,
      userAuth: false,
    }
  },
  {
    path: "/profile/:username",
    name: "profile",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ProfileView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/editProfile",
    name: "editProfile",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/EditProfileView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/photos/:username",
    name: "photos",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/UserPhotosView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/timeline",
    name: "timeline",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/TimelineView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const sRole = userStore.person._sRole;

  if(sRole && (to.name === "login" || to.name === "register")) {
    router.push({path: '/profile'})
  }

  if(to.meta.requiresAuth) {
    if(!sRole) {
      router.push({path: '/'});
    } else {
      if(to.meta.adminAuth) {
        if(sRole === "Admin") {
          return next();
        } else {
          router.push({path: '/login'});
        }
      } else if(to.meta.userAuth) {
        if(sRole === "User") {
          return next();
        } else {
          router.push({path: '/login'});
        }
      }
    }
  } else {
    return next();
  }
});


export default router;
