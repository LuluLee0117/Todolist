<template>
  <div class="container mx-auto p-4 flex">
    <!-- 左側導航列 -->
    <div class="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Sort By</h2>
      <button @click="sortOption = 'category'" class="w-full text-left py-2 px-4 mb-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md">Category</button>
      <button @click="sortOption = 'date'" class="w-full text-left py-2 px-4 mb-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md">Date</button>
      <button @click="showAll" class="w-full text-left py-2 px-4 mb-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md">All</button>
      <div v-if="sortOption === 'category'" class="mt-4">
        <h3 class="text-lg font-bold mb-2">Categories</h3>
        <button v-for="category in uniqueCategories" :key="category" @click="filterCategory = category" class="w-full text-left py-2 px-4 mb-2 bg-green-500 hover:bg-green-400 text-white rounded-lg shadow-md">
          {{ category }}
        </button>
      </div>
      <div v-if="sortOption === 'date'" class="mt-4">
        <h3 class="text-lg font-bold mb-2">Dates</h3>
        <button v-for="date in uniqueDates" :key="date" @click="filterDate = date" class="w-full text-left py-2 px-4 mb-2 bg-green-500 hover:bg-green-400 text-white rounded-lg shadow-md">
          {{ formatDate(date) }}
        </button>
      </div>
    </div>
    <!-- 主要內容區 -->
    <div class="w-3/4 p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">Todo List</h1>
      <div v-if="sortOption === 'category'">
        <div v-for="(todos, category) in groupedTodos" :key="category" class="mb-6">
          <h2 class="text-xl font-bold mb-4">{{ category }}</h2>
          <ul class="space-y-4">
            <li v-for="todo in todos" :key="todo._id" class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
              <div class="flex items-center">
                <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo._id)" class="mr-4">
                <span :class="{ 'line-through': todo.completed }" class="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM3 5a1 1 0 011-1h12a1 1 0 011 1v2a2 2 0 002 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 002-2V5zm12 5H5a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1v-6a1 1 0 00-1-1z"/>
                  </svg>
                  {{ todo.text }} - {{ formatDate(todo.date) }} - {{ todo.time }}
                </span>
              </div>
              <div>
                <button @click="editTodo(todo)" class="ml-2 bg-yellow-500 hover:bg-yellow-400 text-white py-1 px-2 rounded">Edit</button>
                <button @click="removeTodo(todo._id)" class="ml-2 bg-red-500 hover:bg-red-400 text-white py-1 px-2 rounded">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="sortOption === 'date'">
        <div v-for="todo in sortedTodosByDate" :key="todo._id" class="mb-6">
          <ul class="space-y-4">
            <li class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
              <div class="flex items-center">
                <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo._id)" class="mr-4">
                <span :class="{ 'line-through': todo.completed }" class="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM3 5a1 1 0 011-1h12a1 1 0 011 1v2a2 2 0 002 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 002-2V5zm12 5H5a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1v-6a1 1 0 00-1-1z"/>
                  </svg>
                  {{ todo.text }} - {{ formatDate(todo.date) }} - {{ todo.category }} - {{ todo.time }}
                </span>
              </div>
              <div>
                <button @click="editTodo(todo)" class="ml-2 bg-yellow-500 hover:bg-yellow-400 text-white py-1 px-2 rounded">Edit</button>
                <button @click="removeTodo(todo._id)" class="ml-2 bg-red-500 hover:bg-red-400 text-white py-1 px-2 rounded">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <div v-for="todo in todos" :key="todo._id" class="mb-6">
          <ul class="space-y-4">
            <li class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
              <div class="flex items-center">
                <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo._id)" class="mr-4">
                <span :class="{ 'line-through': todo.completed }" class="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM3 5a1 1 0 011-1h12a1 1 0 011 1v2a2 2 0 002 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 002-2V5zm12 5H5a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1v-6a1 1 0 00-1-1z"/>
                  </svg>
                  {{ todo.text }} - {{ formatDate(todo.date) }} - {{ todo.category }} - {{ todo.time }}
                </span>
              </div>
              <div>
                <button @click="editTodo(todo)" class="ml-2 bg-yellow-500 hover:bg-yellow-400 text-white py-1 px-2 rounded">Edit</button>
                <button @click="removeTodo(todo._id)" class="ml-2 bg-red-500 hover:bg-red-400 text-white py-1 px-2 rounded">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <router-link to="/addtodo" class="mt-6 inline-block bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md">Add Todo</router-link>
    </div>

    <div v-if="editingTodo" class="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Edit Todo</h2>
      <form @submit.prevent="updateTodo">
        <div class="mb-4">
          <label class="block text-gray-700">Text:</label>
          <input v-model="editingTodo.text" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Date:</label>
          <input v-model="editingTodo.date" type="date" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Category:</label>
          <input v-model="editingTodo.category" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Time:</label>
          <input v-model="editingTodo.time" type="time" class="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <button type="submit" class="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded">Update Todo</button>
        <button @click="cancelEdit" class="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded ml-2">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getTodos, deleteTodo, updateTodo, toggleTodoCompleted } from '@/services/todoService';

export default {
  data() {
    return {
      todos: [],
      editingTodo: null,
      sortOption: 'category',
      filterCategory: null,
      filterDate: null,
    };
  },
  computed: {
    uniqueCategories() {
      const categories = this.todos.map(todo => todo.category || 'Uncategorized');
      return [...new Set(categories)];
    },
    uniqueDates() {
      const dates = this.todos.map(todo => todo.date);
      return [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));
    },
    groupedTodos() {
      let filteredTodos = this.todos;
      if (this.filterCategory) {
        filteredTodos = filteredTodos.filter(todo => todo.category === this.filterCategory);
      }
      return filteredTodos.reduce((groups, todo) => {
        const category = todo.category || 'Uncategorized';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(todo);
        return groups;
      }, {});
    },
    sortedTodosByDate() {
      let filteredTodos = this.todos;
      if (this.filterDate) {
        filteredTodos = filteredTodos.filter(todo => todo.date === this.filterDate);
      }
      return [...filteredTodos].sort((a, b) => new Date(a.date) - new Date(b.date));
    },
  },
  async created() {
    this.todos = await getTodos();
  },
  methods: {
    showAll() {
      this.filterCategory = null;
      this.filterDate = null;
      this.sortOption = 'all';
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async removeTodo(id) {
      await deleteTodo(id);
      this.todos = this.todos.filter(todo => todo._id !== id);
    },
    editTodo(todo) {
      this.editingTodo = { ...todo };
    },
    cancelEdit() {
      this.editingTodo = null;
    },
    async updateTodo() {
      const updatedTodo = await updateTodo(this.editingTodo._id, this.editingTodo);
      const index = this.todos.findIndex(todo => todo._id === this.editingTodo._id);
      this.todos[index] = updatedTodo;
      this.editingTodo = null;
    },
    async toggleCompleted(id) {
      const updatedTodo = await toggleTodoCompleted(id);
      const index = this.todos.findIndex(todo => todo._id === id);
      this.todos[index] = updatedTodo;
    },
  },
};
</script>
