<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">帳號設定</h1>
      <div class="bg-white p-4 rounded-lg shadow-lg text-center">
        <p class="mb-4">用戶名: {{ user.username }}</p>
        <p class="mb-4">信箱: {{ user.email }}</p>
        <p class="mb-4">姓名: {{ user.name }}</p>
        <button @click="showEditDialog = true" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md">
          修改資料
        </button>
        <button @click="confirmDeleteAccount" class="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-lg shadow-md mt-4">
          刪除帳號
        </button>
      </div>
      <div v-if="showEditDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded-lg shadow-lg text-center">
          <h2 class="text-xl mb-4">修改用戶資料</h2>
          <input v-model="editUserForm.username" class="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="用戶名" />
          <input v-model="editUserForm.email" class="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="信箱" />
          <input v-model="editUserForm.name" class="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="姓名" />
          <div class="mt-4">
            <button @click="saveUser" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md mr-2">
              保存
            </button>
            <button @click="showEditDialog = false" class="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded-lg shadow-md">
              取消
            </button>
          </div>
        </div>
      </div>
      <div v-if="showDeleteDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded-lg shadow-lg text-center">
          <h2 class="text-xl mb-4">確定刪除帳號嗎？</h2>
          <div class="mt-4">
            <button @click="deleteAccount" class="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-lg shadow-md mr-2">
              確定
            </button>
            <button @click="showDeleteDialog = false" class="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded-lg shadow-md">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const user = ref({});
      const showEditDialog = ref(false);
      const showDeleteDialog = ref(false);
      const editUserForm = ref({
        username: '',
        email: '',
        name: ''
      });
      const router = useRouter();
  
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: localStorage.getItem('token') }
          });
          user.value = response.data;
          editUserForm.value = { ...response.data };
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      };
  
      const saveUser = async () => {
        try {
          const { username, email, name } = editUserForm.value;
          const response = await axios.put('http://localhost:3000/user', {
            username, email, name
          }, {
            headers: { Authorization: localStorage.getItem('token') }
          });
          user.value = response.data;
          showEditDialog.value = false;
        } catch (error) {
          console.error('Failed to save user', error);
        }
      };
  
      const confirmDeleteAccount = () => {
        showDeleteDialog.value = true;
      };
  
      const deleteAccount = async () => {
        try {
          await axios.delete('http://localhost:3000/delete-account', {
            headers: { Authorization: localStorage.getItem('token') }
          });
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('isAdmin');
          router.push('/login');
        } catch (error) {
          console.error('Failed to delete account', error);
        }
      };
  
      onMounted(fetchUser);
  
      return {
        user,
        showEditDialog,
        showDeleteDialog,
        editUserForm,
        saveUser,
        confirmDeleteAccount,
        deleteAccount
      };
    }
  };
  </script>
  
  <style>
  .fixed {
    position: fixed;
  }
  .inset-0 {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .bg-black {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .flex {
    display: flex;
  }
  .items-center {
    align-items: center;
  }
  .justify-center {
    justify-content: center;
  }
  .bg-white {
    background-color: white;
  }
  .p-4 {
    padding: 1rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .shadow-lg {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  .text-center {
    text-align: center;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .mr-2 {
    margin-right: 0.5rem;
  }
  </style>
  