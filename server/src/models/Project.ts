import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Сюда будем класть URL или Base64
  category: { type: String, default: "Строительная компания" }
});

export const Project = mongoose.model('Project', projectSchema);
