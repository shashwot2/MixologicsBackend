import mongoose from 'mongoose';
const stepSchema = new mongoose.Schema({
    stepNumber: Number,
    description: String,
    image: String  
});

const recipeSchema = new mongoose.Schema({
    recipeId: { type: String , required: true , unique: true},
    name: { type: String, required: true },
    base: String,
    category: { type: String, required: true },
    servings: Number,
    steps: [stepSchema],
    ingredients: [String],
    image: String  // Storing the path to the image
});

export const Recipe = mongoose.model('recipes', recipeSchema);