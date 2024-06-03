<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">管理所有帳戶</h1>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2">用戶名</th>
            <th class="py-2">信箱</th>
            <th class="py-2">管理員</th>
            <th class="py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td class="py-2">{{ user.username }}</td>
            <td class="py-2">{{ user.email }}</td>
            <td class="py-2">{{ user.isAdmin ? '是' : '否' }}</td>
            <td class="py-2">
              <button @click="confirmDeleteUser(user._id)" class="bg-red-500 hover:bg-red-400 text-white py-1 px-4 rounded">
                刪除
              </button>
              <button @click="editUser(user)" class="bg-yellow-500 hover:bg-yellow-400 text-white py-1 px-4 rounded ml-2">
                修改
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="showEditDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded-lg shadow-lg text-center">
          <h2 class="text-xl mb-4">修改用戶</h2>
          <input v-model="editUserForm.username" class="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="用戶名" />
          <input v-model="editUserForm.email" class="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="信箱" />
          <input v-model="editUserForm.name" class="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="姓名" />
          <label class="block mt-2">
            <input type="checkbox" v-model="editUserForm.isAdmin" />
            管理員
          </label>
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
          <h2 class="text-xl mb-4">確定刪除此帳號嗎？</h2>
          <div class="mt-4">
            <button @click="deleteUser" class="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-lg shadow-md mr-2">
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
  
  export default {
    setup() {
      const users = ref([]);
      const showEditDialog = ref(false);
      const showDeleteDialog = ref(false);
      const editUserForm = ref({
        _id: '',
        username: '',
        email: '',
        name: '',
        isAdmin: false,
      });
      const deleteUserId = ref(null);
  
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:3000/admin/users', {
            headers: { Authorization: localStorage.getItem('token') },
          });
          users.value = response.data;
        } catch (error) {
          console.error('Failed to fetch users', error);
        }
      };
  
      const confirmDeleteUser = (id) => {
        deleteUserId.value = id;
        showDeleteDialog.value = true;
      };
  
      const deleteUser = async () => {
        try {
          await axios.delete(`http://localhost:3000/admin/users/${deleteUserId.value}`, {
            headers: { Authorization: localStorage.getItem('token') },
          });
          fetchUsers();
          showDeleteDialog.value = false;
        } catch (error) {
          console.error('Failed to delete user', error);
        }
      };
  
      const editUser = (user) => {
        editUserForm.value = { ...user };
        showEditDialog.value = true;
      };
  
      const saveUser = async () => {
        try {
          const { _id, username, email, name, isAdmin } = editUserForm.value;
          await axios.put(`http://localhost:3000/admin/users/${_id}`, {
            username, email, name, isAdmin
          }, {
            headers: { Authorization: localStorage.getItem('token') },
          });
          showEditDialog.value = false;
          fetchUsers();
        } catch (error) {
          console.error('Failed to save user', error);
        }
      };
  
      onMounted(fetchUsers);
  
      return {
        users,
        showEditDialog,
        showDeleteDialog,
        editUserForm,
        confirmDeleteUser,
        deleteUser,
        editUser,
        saveUser,
      };
    },
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
  