// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const Todo = require('./models/FormData'); // This file now defines a to-do item

// // Load environment variables (if any)
// dotenv.config();

// const app = express();

// // Middleware to parse JSON and enable CORS
// app.use(express.json());
// app.use(cors({
//   origin: '*', // Change '*' to your frontend URL in production
//   methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type']
// }));

// // Connect to MongoDB (replace with your URI or use an environment variable)
// mongoose
//   .connect(
//     process.env.MONGO_URI || 'mongodb+srv://bct02:bct02_mongopass@cluster0.hc5om.mongodb.net/TodoList'
//   )
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // GET: Retrieve all to-do items
// app.get('/todos', async (req, res) => {
//   try {
//     const todos = await Todo.find();
//     res.json(todos);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST: Create a new to-do item
// app.post('/todos', async (req, res) => {
//   const { text } = req.body;
//   if (!text || text.trim() === "") {
//     return res.status(400).json({ message: "Text is required" });
//   }

//   const todo = new Todo({ text });
//   try {
//     const newTodo = await todo.save();
//     res.status(201).json(newTodo);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // PATCH: Update a to-do item (e.g., toggle completion)
// app.patch('/todos/:id', async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) {
//       return res.status(404).json({ message: 'To-do item not found' });
//     }

//     // Update provided fields (text or completed)
//     if (req.body.text !== undefined) {
//       todo.text = req.body.text;
//     }
//     if (req.body.completed !== undefined) {
//       todo.completed = req.body.completed;
//     }

//     const updatedTodo = await todo.save();
//     res.json(updatedTodo);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE: Remove a to-do item
// app.delete('/todos/:id', async (req, res) => {
//   const { id } = req.params;

//   // Validate MongoDB ObjectId
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const todo = await Todo.findByIdAndDelete(id);
//     if (!todo) {
//       return res.status(404).json({ message: 'To-do item not found' });
//     }
//     res.json({ message: 'To-do item deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Start the server on port 5000
// // app.listen(5000, () => {
// //   console.log("Server listening on http://localhost:5000");
// // });

// // Start the server on port 5000
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
// });
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//Optional: check if env variables are loaded
console.log("Mongo URI:", process.env.MONGO_URI);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) //in mongodb mainly problem arises with username and password
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));



// Schema + Model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", todoSchema);

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Add new todo
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// Toggle todo
app.patch("/api/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
