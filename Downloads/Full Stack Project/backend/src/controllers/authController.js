const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');

// Define a Zod schema for input validation
const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

exports.signup = async (req, res) => {
  try {
    // Validate request body against the schema
    const { username, email, password } = signupSchema.parse(req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Send success response with token
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    // Handle validation errors
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input data', errors: err.errors });
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      // Handle duplicate key error (username/email already exists)
      res.status(400).json({ message: 'Username or email already exists' });
    } else {
      // Handle other errors
      console.error(err);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
};
