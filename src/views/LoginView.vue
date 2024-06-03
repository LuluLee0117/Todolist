<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">登入</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">用戶名:</label>
          <input v-model="username" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">密碼:</label>
          <input
            :type="passwordFieldType"
            v-model="password"
            class="mt-1 p-2 border border-gray-300 rounded w-full pr-10"
          />
          <img
            src="@/assets/eye.png"
            @mousedown="showPassword"
            @mouseup="hidePassword"
            @mouseleave="hidePassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            alt="Show Password"
          />
        </div>
        <button type="submit" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md">
          登入
        </button>
      </form>
      <div v-if="errorMessage" class="mt-4 p-2 bg-red-500 text-white rounded">
          {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script>
  import { inject, ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const setLogin = inject('setLogin');
      const username = ref('');
      const password = ref('');
      const errorMessage = ref('');
      const passwordFieldType = ref('password');
      const router = useRouter();
  
      const login = async () => {
        try {
          console.log('Login attempt:', { username: username.value, password: password.value });
          const response = await axios.post('http://localhost:3000/login', {
            username: username.value,
            password: password.value,
          });
          console.log('Login successful:', response.data);
          setLogin(response.data.token, response.data.username, response.data.isAdmin, response.data.name);
          if (response.data.isAdmin) {
            router.push('/admin'); // 跳轉到管理員頁面
          } else {
            router.push('/'); // 跳轉到首頁
          }
        } catch (error) {
          console.error('Login error:', error.response ? error.response.data : error);
          errorMessage.value = '登入失敗，請檢查您的用戶名和密碼';
        }
      };
  
      const showPassword = () => {
        passwordFieldType.value = 'text';
      };
  
      const hidePassword = () => {
        passwordFieldType.value = 'password';
      };
  
      return {
        username,
        password,
        errorMessage,
        passwordFieldType,
        login,
        showPassword,
        hidePassword,
      };
    },
  };
  </script>
  
  <style>
  /* 添加適當的 CSS 樣式來確保圖標在輸入框內垂直居中 */
  img {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  </style>
  