const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const SECRET_KEY = 'your_secret_key'; // 替換為你的實際密鑰

// 定義 User 模型
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  name: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model('User', UserSchema);

// 定義 Todo 模型
const TodoSchema = new mongoose.Schema({
  text: String,
  date: String,
  category: String,
  time: String,
  completed: Boolean,
  userId: mongoose.Schema.Types.ObjectId,
});
const Todo = mongoose.model('Todo', TodoSchema);

// 連接到 MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(async () => {
    console.log('Connected to MongoDB');

    // 檢查是否存在管理員帳戶
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin_password', 10); // 替換為你想要的管理員密碼
      const admin = new User({
        email: 'admin@example.com',
        username: 'admin',
        name: 'Admin User',
        password: hashedPassword,
        isAdmin: true,
      });
      await admin.save();
      console.log('Admin user created with username: admin and password: admin_password'); // 請替換密碼
    } else {
      console.log('Admin user already exists');
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

// 中間件
app.use(cors());
app.use(express.json());

// 註冊路由
app.post('/register', async (req, res) => {
  const { email, username, name, password } = req.body;
  console.log('Register request:', req.body);
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const errorMessage = existingUser.email === email ? '信箱已被使用' : '用戶名已被使用';
      return res.status(400).send({ message: errorMessage });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, name, password: hashedPassword });
    await user.save();
    res.send({ message: '用戶註冊成功' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send({ message: '註冊失敗', error });
  }
});

// 登入路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login request:', req.body);
  const user = await User.findOne({ username });
  if (!user) {
    console.log('User not found');
    return res.status(401).send({ message: '無效的憑證' });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    console.log('Password does not match');
    return res.status(401).send({ message: '無效的憑證' });
  }
  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET_KEY);
  console.log('Login successful:', { token, username: user.username, isAdmin: user.isAdmin });
  res.send({ token, username: user.username, isAdmin: user.isAdmin });
});

// 認證中間件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: '未提供令牌' });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch {
    res.status(401).send({ message: '無效的令牌' });
  }
};

// 管理員認證中間件
const authenticateAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).send({ message: '需要管理員權限' });
  }
};

// 設置待辦事項路由
app.get('/todos', authenticate, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.send(todos);
});

// 登入路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login request:', req.body);
  const user = await User.findOne({ username });
  if (!user) {
    console.log('User not found');
    return res.status(401).send({ message: '無效的憑證' });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    console.log('Password does not match');
    return res.status(401).send({ message: '無效的憑證' });
  }
  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET_KEY);
  console.log('Login successful:', { token, username: user.username, isAdmin: user.isAdmin, name: user.name });
  res.send({ token, username: user.username, isAdmin: user.isAdmin, name: user.name });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.send({ message: '待辦事項已刪除' });
});

app.put('/todos/:id', authenticate, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.send(todo);
});

app.patch('/todos/:id/completed', authenticate, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
  todo.completed = !todo.completed;
  await todo.save();
  res.send(todo);
});

// 刪除帳號路由
app.delete('/delete-account', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    await Todo.deleteMany({ userId: req.userId });
    res.send({ message: '帳號已刪除' });
  } catch (error) {
    res.status(500).send({ message: '刪除帳號失敗', error });
  }
});

// 獲取用戶信息路由
app.get('/user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username email name');
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: '獲取用戶信息失敗', error });
  }
});

// 更新用戶資料路由
app.put('/user', authenticate, async (req, res) => {
  try {
    const { username, email, name } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { username, email, name }, { new: true });
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: '更新用戶資料失敗', error });
  }
});

// 管理員功能路由
app.get('/admin/users', authenticate, authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select('username email name isAdmin');
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: '獲取用戶信息失敗', error });
  }
});

app.put('/admin/users/:id', authenticate, authenticateAdmin, async (req, res) => {
  try {
    const { username, email, name, isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { username, email, name, isAdmin }, { new: true });
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: '更新帳號失敗', error });
  }
});

app.delete('/admin/users/:id', authenticate, authenticateAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Todo.deleteMany({ userId: req.params.id });
    res.send({ message: '帳號已刪除' });
  } catch (error) {
    res.status(500).send({ message: '刪除帳號失敗', error });
  }
});

app.listen(port, () => {
  console.log(`服務器運行在 http://localhost:${port}`);
});
