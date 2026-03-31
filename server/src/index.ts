import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Step } from './models/Step.js';
import { Project } from './models/Project.ts';
import { Album } from './models/Album.ts';
import { Landing } from './models/Landing.ts';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/house_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('DB Connection Error:', err));

// --- КОНФИГУРАТОР (STEPS) ---

app.get('/api/steps', async (_req, res) => {
  try {
    const steps = await Step.find().sort({ order: 1 });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

app.post('/api/steps', async (req, res) => {
  try {
    const { stepName, order, cards } = req.body;
    const step = await Step.findOneAndUpdate(
      { stepName }, 
      { stepName, order, cards }, 
      { upsert: true, new: true }
    );
    res.json(step);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при сохранении' });
  }
});

// Роут для удаления этапа целиком (нужен для админки)
app.delete('/api/steps/:name', async (req, res) => {
  try {
    await Step.findOneAndDelete({ stepName: req.params.name });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении этапа' });
  }
});

// --- ГАЛЕРЕЯ (PROJECTS & ALBUMS) ---

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при сохранении' });
  }
});

app.get('/api/albums', async (req, res) => {
  const albums = await Album.find().sort({ createdAt: -1 });
  res.json(albums);
});

app.post('/api/albums', async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (e) {
    res.status(400).json({ error: 'Ошибка создания' });
  }
});

app.put('/api/albums/:id', async (req, res) => {
  await Album.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

app.delete('/api/albums/:id', async (req, res) => {
  await Album.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// --- КОНТЕНТ ЛЕНДИНГА ---

app.get('/api/landing-content', async (req, res) => {
  try {
    const content = await Landing.findOne();
    res.json(content || {}); 
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера при получении контента' });
  }
});

app.post('/api/landing-content', async (req, res) => {
  try {
    const updated = await Landing.findOneAndUpdate({}, req.body, { 
      upsert: true, 
      new: true 
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при сохранении контента' });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
