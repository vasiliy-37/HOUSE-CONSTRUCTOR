import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: "Строительная компания" },
  coverImage: { type: String }, // URL или Base64 выбранного превью
  images: [{ type: String }],   // Массив всех фотографий альбома
  createdAt: { type: Date, default: Date.now }
});

export const Album = mongoose.model('Album', albumSchema);
