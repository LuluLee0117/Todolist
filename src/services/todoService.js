import axios from 'axios';

const API_URL = 'http://localhost:3000/todos';

// 獲取身份驗證標頭
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: token },
  };
};

export const getTodos = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await axios.post(API_URL, todo, getAuthHeaders());
  return response.data;
};

export const deleteTodo = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};

export const updateTodo = async (id, todo) => {
  const response = await axios.put(`${API_URL}/${id}`, todo, getAuthHeaders());
  return response.data;
};

export const toggleTodoCompleted = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/completed`, {}, getAuthHeaders());
  return response.data;
};
