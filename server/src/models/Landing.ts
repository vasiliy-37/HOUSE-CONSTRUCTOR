import mongoose from 'mongoose';

const LandingSchema = new mongoose.Schema({
  // Hero
  heroTitle: { type: String, required: true },
  heroSub: { type: String, required: true },
  heroImg: { type: String }, // Base64 или URL
  experienceYears: { type: String },
  
  // About
  aboutBadge: { type: String },
  aboutTitle: { type: String },
  aboutText1: { type: String },
  aboutText2: { type: String },
  statYears: { type: String },
  statProjects: { type: String },
  aboutImg: { type: String }
}, { timestamps: true });

export const Landing = mongoose.model('Landing', LandingSchema);
