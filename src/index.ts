import 'dotenv/config';
import express from 'express';
import { Synapse } from '@pyrx/synapse';

const app = express();
app.use(express.json());

const synapse = new Synapse({
  apiKey: process.env.SYNAPSE_API_KEY!,
  workspaceId: process.env.SYNAPSE_WORKSPACE_ID!,
});

app.post('/api/track', async (req, res) => {
  const { userId, event, attributes } = req.body;
  await synapse.track({ externalId: userId, eventName: event, attributes });
  res.json({ success: true });
});

app.post('/api/identify', async (req, res) => {
  const { userId, email, properties } = req.body;
  await synapse.identify({ externalId: userId, email, properties });
  res.json({ success: true });
});

app.post('/api/send', async (req, res) => {
  const { templateSlug, userId, email, attributes } = req.body;
  await synapse.send({ templateSlug, to: { userId, email }, attributes });
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
