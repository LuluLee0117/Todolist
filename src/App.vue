<template>
  <div>
    <nav class="bg-gray-800 p-4 text-white flex justify-between">
      <div>
        <router-link v-if="!isAdmin" to="/" class="mr-4">首頁</router-link>
        <router-link v-if="!isAdmin" to="/addtodo" class="mr-4">添加待辦事項</router-link>
        <router-link v-if="isLoggedIn && !isAdmin" to="/account" class="mr-4">帳號設定</router-link>
        <router-link v-if="isAdmin" to="/admin" class="mr-4">管理員頁面</router-link>
      </div>
      <div>
        <div v-if="isLoggedIn">
          <span class="mr-4">你好，{{ username }}</span>
          <button @click="logout" class="bg-red-500 hover:bg-red-400 text-white py-1 px-4 rounded">登出</button>
        </div>
        <div v-else>
          <router-link to="/login" class="mr-4">登入</router-link>
          <router-link to="/register">註冊</router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { reactive, provide, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      username: localStorage.getItem('username') || '',
      token: localStorage.getItem('token') || '',
      isAdmin: localStorage.getItem('isAdmin') === 'true',
      name: localStorage.getItem('name') || ''
    });

    const setLogin = (token, username, isAdmin, name) => {
      state.token = token;
      state.username = username;
      state.isAdmin = isAdmin;
      state.name = name;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('isAdmin', isAdmin);
      localStorage.setItem('name', name);
    };

    const logout = () => {
      state.token = '';
      state.username = '';
      state.isAdmin = false;
      state.name = '';
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('name');
      router.push('/login'); // 導航到登入頁面
    };

    provide('state', state);
    provide('setLogin', setLogin);
    provide('logout', logout);

    return {
      username: state.username,
      name: state.name,
      isLoggedIn: computed(() => !!state.token),
      isAdmin: computed(() => state.isAdmin),
      logout,
    };
  },
};
</script>

<style>
nav a {
  color: white;
  text-decoration: none;
  margin-right: 15px;
}
nav a.router-link-exact-active {
  font-weight: bold;
}
</style>
