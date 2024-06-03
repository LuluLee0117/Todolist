<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">註冊</h1>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-700">信箱:</label>
          <input v-model="email" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">用戶名:</label>
          <input v-model="username" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">姓名:</label>
          <input v-model="name" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">密碼:</label>
          <input type="password" v-model="password" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <button type="submit" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md">
          註冊
        </button>
      </form>
      <div v-if="errorMessage" class="mt-4 p-2 bg-red-500 text-white rounded">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mt-4 p-2 bg-green-500 text-white rounded">
        {{ successMessage }}
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const username = ref('');
      const name = ref('');
      const password = ref('');
      const errorMessage = ref('');
      const successMessage = ref('');
      const router = useRouter();
  
      const register = async () => {
        try {
          const response = await axios.post('http://localhost:3000/register', {
            email: email.value,
            username: username.value,
            name: name.value,
            password: password.value,
          });
          console.log('Registration successful:', response.data);
          errorMessage.value = '';
          successMessage.value = '註冊成功！將跳轉到登入頁面...';
  
          // 等待2秒後跳轉到登入頁面
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } catch (error) {
          console.error('Registration error:', error.response ? error.response.data : error);
          errorMessage.value = error.response ? error.response.data.message : '註冊失敗，請稍後再試';
        }
      };
  
      return {
        email,
        username,
        name,
        password,
        errorMessage,
        successMessage,
        register,
      };
    },
  };
  </script>
  
  <style>
  /* 添加適當的 CSS 樣式來確保訊息框美觀 */
  .mt-4 {
    margin-top: 1rem;
  }
  .p-2 {
    padding: 0.5rem;
  }
  .bg-red-500 {
    background-color: #f56565;
  }
  .bg-green-500 {
    background-color: #48bb78;
  }
  .text-white {
    color: #fff;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  </style>
  
  