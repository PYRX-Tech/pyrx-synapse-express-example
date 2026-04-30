import 'dotenv/config';
import express from 'express';
import { Synapse } from '@pyrx/synapse';

const app = express();
app.use(express.json());

const synapse = new Synapse({ baseUrl: process.env.SYNAPSE_API_URL || "https://synapse-api.pyrx.tech",
  apiKey: process.env.SYNAPSE_API_KEY!,
  workspaceId: process.env.SYNAPSE_WORKSPACE_ID!,
});

// ── Core ──
app.post('/api/track', async (req, res) => {
  const r = await synapse.track({ externalId: req.body.userId, eventName: req.body.event, attributes: req.body.attributes });
  res.json(r);
});

app.post('/api/track/batch', async (req, res) => {
  const r = await synapse.trackBatch({ events: req.body.events });
  res.json(r);
});

app.post('/api/identify', async (req, res) => {
  const r = await synapse.identify({ externalId: req.body.userId, email: req.body.email, properties: req.body.properties, tags: req.body.tags });
  res.json(r);
});

app.post('/api/identify/batch', async (req, res) => {
  const r = await synapse.identifyBatch({ contacts: req.body.contacts });
  res.json(r);
});

app.post('/api/send', async (req, res) => {
  const r = await synapse.send({ templateSlug: req.body.templateSlug, to: req.body.to, attributes: req.body.attributes });
  res.json(r);
});

// ── Contacts ──
app.get('/api/contacts', async (req, res) => {
  const r = await synapse.contacts.list({ page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20, tag: req.query.tag as string, search: req.query.search as string });
  res.json(r);
});

app.get('/api/contacts/:id', async (req, res) => {
  const r = await synapse.contacts.get(req.params.id);
  res.json(r);
});

app.put('/api/contacts/:externalId', async (req, res) => {
  const r = await synapse.contacts.update(req.params.externalId, req.body);
  res.json(r);
});

app.delete('/api/contacts/:externalId', async (req, res) => {
  await synapse.contacts.delete(req.params.externalId);
  res.json({ success: true });
});

// ── Templates ──
app.get('/api/templates', async (_req, res) => {
  const r = await synapse.templates.list();
  res.json(r);
});

app.post('/api/templates', async (req, res) => {
  const r = await synapse.templates.create(req.body);
  res.json(r);
});

app.get('/api/templates/:slug', async (req, res) => {
  const r = await synapse.templates.get(req.params.slug);
  res.json(r);
});

app.put('/api/templates/:slug', async (req, res) => {
  const r = await synapse.templates.update(req.params.slug, req.body);
  res.json(r);
});

app.delete('/api/templates/:slug', async (req, res) => {
  await synapse.templates.delete(req.params.slug);
  res.json({ success: true });
});

app.post('/api/templates/:slug/preview', async (req, res) => {
  const r = await synapse.templates.preview(req.params.slug, { attributes: req.body.attributes });
  res.json(r);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
