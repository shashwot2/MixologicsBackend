import express from 'express';
import { Post } from '../models/Post.js';
const router = express.Router();

router.post('/', async (req, res) => {
    const post = new Post({
      ...req.body,
      userId: req.user._id, 
    });
  
    try {
      const savedPost = await post.save();
      res.status(201).send(savedPost);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      post.likesCount++;
      await post.save();
      res.send(post);
    } else {
      res.status(400).send({ message: 'You have already liked this post.' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        if (!user) {
            return res.status(404).json({ message: 'No Users found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:postId', async (req, res) => {
  const comment = new Comment({
    ...req.body,
    postId: req.params.postId,
    userId: req.user._id,
  });

  try {
    const savedComment = await comment.save();
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentsCount: 1 } });
    res.status(201).send(savedComment);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router