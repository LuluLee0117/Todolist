import { createRouter, createWebHistory } from 'vue-router';
import TodoListView from '@/views/TodoListView.vue';
import AddTodoView from '@/views/AddTodoView.vue';
import Register from '@/views/RegisterView.vue';
import Login from '@/views/LoginView.vue';
import Account from '@/views/AccountView.vue';
import AdminView from '@/views/AdminView.vue'; // 新增的

const routes = [
  { path: '/', component: TodoListView, meta: { requiresAuth: true } },
  { path: '/addtodo', component: AddTodoView, meta: { requiresAuth: true } },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/account', component: Account, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } }, // 新增的
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ path: '/login' });
    } else {
      const user = JSON.parse(atob(token.split('.')[1]));
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (user.isAdmin) {
          next();
        } else {
          next({ path: '/' });
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
