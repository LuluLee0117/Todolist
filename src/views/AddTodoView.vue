<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Add Todo</h1>
    <form @submit.prevent="addTodo" class="bg-gray-100 p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700">Text:</label>
        <input v-model="text" class="mt-1 p-2 border border-gray-300 rounded w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Date:</label>
        <input v-model="date" type="date" class="mt-1 p-2 border border-gray-300 rounded w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Category:</label>
        <input v-model="category" class="mt-1 p-2 border border-gray-300 rounded w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Time:</label>
        <input v-model="time" type="time" class="mt-1 p-2 border border-gray-300 rounded w-full" />
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md">Add Todo</button>
    </form>
  </div>
</template>

<script>
import { createTodo } from '@/services/todoService';

export default {
  data() {
    return {
      text: '',
      date: '',
      category: '',
      time: '',
    };
  },
  methods: {
    async addTodo() {
      await createTodo({
        text: this.text,
        date: this.date,
        category: this.category,
        time: this.time,
        completed: false,
      });
      this.text = '';
      this.date = '';
      this.category = '';
      this.time = '';
      this.$router.push('/');
    },
  },
};
</script>
