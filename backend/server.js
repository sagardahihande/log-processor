require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Queue, Worker } = require('bullmq');
const { createClient } = require('@supabase/supabase-js');
const { Server } = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const redisOptions = { connection: { host: 'localhost', port: 6379 } };
const logQueue = new Queue('log-processing-queue', redisOptions);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const upload = multer({ dest: 'uploads/' });

// WebSocket Server
const wss = new Server({ noServer: true });
app.server = require('http').createServer(app);

app.server.on('upgrade', (req, socket, head) => wss.handleUpgrade(req, socket, head, (ws) => {
  ws.send(JSON.stringify({ message: 'Connected to WebSocket' }));
}));

// Upload API
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const job = await logQueue.add('process-log', { filePath: req.file.path });
  res.json({ jobId: job.id });
});

// Fetch Log Stats
app.get('/api/stats', async (req, res) => {
  const { data, error } = await supabase.from('log_stats').select('*');
  res.json(data);
});

// Worker for Log Processing
new Worker('log-processing-queue', async (job) => {
  const { filePath } = job.data;
  const fs = require('fs');
  const readline = require('readline');

  const stats = { errors: 0, keywords: 0, uniqueIPs: new Set() };
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream });

  for await (const line of rl) {
    if (line.includes('ERROR')) stats.errors++;
    if (line.includes('CRITICAL')) stats.keywords++;
    const ipMatch = line.match(/"ip":\s*"(\d+\.\d+\.\d+\.\d+)"/);
    if (ipMatch) stats.uniqueIPs.add(ipMatch[1]);
  }

  await supabase.from('log_stats').insert({
    errors: stats.errors,
    keywords: stats.keywords,
    unique_ips: Array.from(stats.uniqueIPs)
  });

  wss.clients.forEach((client) => client.send(JSON.stringify({ update: 'Job Completed' })));

}, redisOptions);

// Start Server
app.server.listen(5000, () => console.log('Backend running on port 5000'));
