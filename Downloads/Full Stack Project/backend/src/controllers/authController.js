const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const Post = require('../models/Post');

const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = signupSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input data', errors: err.errors });
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      res.status(400).json({ message: 'Username or email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
};

exports.getPosts = async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching posts' });
    }
  };

exports.login = async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
  
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  };