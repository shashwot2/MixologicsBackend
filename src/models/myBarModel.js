import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    id: { type: String, required: true },
    drinkName: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: false }
}, { _id: false });

const mybarSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    spirits: [itemSchema],
    mixers: [itemSchema],
    fruits: [itemSchema],
    herbs: [itemSchema],
    flavorings: [itemSchema],
});

export const myBarModel = mongoose.model('MyBar', mybarSchema);
