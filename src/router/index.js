import { useUserStore } from "@/store/UserStore";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    // component: HomeView,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HomeFinalView.vue"),
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
      import(/* webpackChunkName "register" */ "@/views/ProfileFinalView.vue"),
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
      import(/* webpackChunkName "register" */ "@/views/EditProfileFinalView.vue"),
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
  {
    path: "/post/:id",
    name: "postDetail",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/PostDetailView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/:username/:follow",
    name: "showFollows",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ShowFollowsView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/messages",
    name: "messages",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ChatsView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/messages/:targetId",
    name: "privateMessages",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/PrivateChatView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/users/explore",
    name: "exploreUssers",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ExploreUsersView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/newEvent",
    name: "newEvent",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/NewEventView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/events/:eventId",
    name: "showEvent",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ShowEventView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: true,
      userAuth: true,
    }
  },
  {
    path: "/events/:eventId/assistants",
    name: "assistants",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ShowEventAssistantsView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/events/explore",
    name: "exploreEvents",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ExploreEventsView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/events/edit/:eventId",
    name: "editEvent",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/EditEventView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/NotificationsView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/help/newTicket",
    name: "newTicket",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/NewTicketView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/admin/dashboard",
    name: "adminDashboard",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/AdminDashboardView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: true,
      userAuth: false,
    }
  },
  {
    path: "/admin/tickets",
    name: "ticketManagement",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/TicketManagementView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: true,
      userAuth: false,
    }
  },
  {
    path: "/help/myTickets",
    name: "userTicketManagement",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/TicketManagementView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: false,
      userAuth: true,
    }
  },
  {
    path: "/help/tickets/:ticketId",
    name: "ticketDetail",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/TicketDetailView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: true,
      userAuth: true,
    }
  },
  {
    path: "/admin/manage/content",
    name: "contentManagement",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/ContentManagementView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: true,
      userAuth: false,
    }
  },
  {
    path: "/admin/manage/users/:userId?",
    name: "userManagement",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/UserManagementView.vue"),
    meta: {
      requiresAuth: true,
      adminAuth: true,
      userAuth: false,
    }
  },
  {
    path: "/help",
    name: "help",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/HelpView.vue"),
    meta: {
      requiresAuth: false,
      adminAuth: true,
      userAuth: true,
    }
  },
  {
    path: "/admin/operations",
    name: "adminOperations",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/AdminOperationsView.vue"),
    meta: {
      requiresAuth: false,
      adminAuth: true,
      userAuth: false,
    }
  },
  {
    path: "/test",
    name: "test",
    component: () =>
      import(/* webpackChunkName "register" */ "@/views/Test.vue"),
    meta: {
      requiresAuth: false,
      adminAuth: true,
      userAuth: false,
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
  if(sRole) { 
    if(sRole.toLowerCase() === "user" && (to.name === "login" || to.name === "register")) {
      router.push({path: '/timeline'})
    }
    
    if(sRole.toLowerCase() === "admin" && (to.name === "login" || to.name === "register")) {
      router.push({path: '/admin/dashboard'})
    }
  }


  if(to.meta.requiresAuth) {
    if(!sRole) {
      router.push({path: '/'});
    } else {
      if(to.meta.adminAuth && to.meta.userAuth) {
        return next();
      } else if(to.meta.adminAuth) {
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
