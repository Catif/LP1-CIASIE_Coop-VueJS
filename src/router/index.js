import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from "@/stores/session";

import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/views/LogoutView.vue"),
    },
    {
      path: "/members",
      name: "members",
      component: () => import("@/views/member/MembersView.vue"),
    },
    {
      path: "/conversations",
      name: "conversations",
      component: () => import("@/views/conversation/ConversationsView.vue"),
    },
    {
      path: "/conversation/:id",
      name: "conversation",
      component: () => import("@/views/conversation/ShowConversationView.vue"),
    },
    {
      path: "/create-conversation",
      name: "create-conversation",
      component: () => import("@/views/conversation/CreateConversationView.vue"),
    },
    {
      path: "/profile/:id?",
      name: "profile",
      component: () => import("@/views/member/ProfileView.vue"),
    },
  ],
});


router.beforeEach(async (from, to, next) => {
  const Session = useSessionStore();

  //? _-== Test redirection Role Access ==-_

  // console.log("====================================")
  // console.log(!["/", "/register", "/login"].includes(from.path))
  // console.log(!(await Session.isValid()))
  // console.log("====================================")
  if (!["/", "/register", "/login"].includes(from.path) && !(await Session.isValid())) {
    next('/login')
    return
  }
  next()
});

export default router;
