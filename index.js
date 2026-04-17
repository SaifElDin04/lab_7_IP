const express = require("express");
const app = express();

// Middleware to parse the JSON payload of the request
app.use(express.json());

// In-memory storage
const posts = []; 
let nextPostId = 1; 
let nextCommentId = 1; // Added a counter for comment IDs

// 1. POST /posts
app.post("/posts", (req, res) => {
    const post = { 
        id: nextPostId++, 
        title: req.body.title, 
        content: req.body.content,
        comments: [] // Initialize an empty comments array for each new post
    };
    
    posts.push(post);
    res.status(201).json(post); 
});

// 2. GET /posts
app.get("/posts", (req, res) => {
    res.status(200).json(posts);
});

// 3. GET /posts/:id
app.get("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id); 
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// 4. PUT /posts/:id
app.put("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        posts[postIndex].title = req.body.title || posts[postIndex].title;
        posts[postIndex].content = req.body.content || posts[postIndex].content;
        
        res.status(200).json(posts[postIndex]);
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// 5. DELETE /posts/:id
app.delete("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        res.status(200).json({ message: "Post deleted successfully" });
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// 6. POST /posts/:id/comments
app.post("/posts/:id/comments", (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (post) {
        const comment = {
            id: nextCommentId++,
            text: req.body.text // Assuming the comment payload has a 'text' field
        };
        post.comments.push(comment);
        res.status(201).json(comment);
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// 7. GET /posts/:id/comments
app.get("/posts/:id/comments", (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.status(200).json(post.comments);
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});