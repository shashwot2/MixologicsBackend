import express from 'express';
import { Recipe } from '../models/RecipesModel.js';
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ id: req.params.id });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const recipe = await Recipe.find();
        if (!recipe) {
            return res.status(404).json({ message: 'No Recipes  found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        res.status(400).send(error);
    }
});
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({ recipeId: req.params.recipeId });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router