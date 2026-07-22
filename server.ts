import express from 'express';
import path from 'path';
import { geminiRouter } from './src/server/geminiApi';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use('/api/gemini', geminiRouter);

// Serve static assets in production
app.use(express.static(path.resolve('dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
