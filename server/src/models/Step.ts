import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    pros: [String],
    cons: [String],
    nextStepId: String,
    pricePerMeter: { type: Number, default: 0 } 
});

const stepSchema = new mongoose.Schema({
    stepName: { type: String, unique: true, required: true }, 
    order: Number,
    cards: [cardSchema]
});

export const Step = mongoose.model('Step', stepSchema);
