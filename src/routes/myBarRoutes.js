import express from 'express';
import { myBarModel } from '../models/myBarModel.js';
const router = express.Router();

router.get('/:userName', async (req, res) => {
  try {
    // Use findOne to search by name
    const myBar = await myBarModel.findOne({ userName: req.params.userName });
    if (!myBar) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.json(myBar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/', async (req, res) => {
  const { userName, ...otherData } = req.body;  
  try {
    const options = { upsert: true, new: true, runValidators: true };
    const updatedDocument = await myBarModel.findOneAndUpdate(
      { userName: userName }, 
      { $set: { ...otherData } }, 
      options  
    );
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;