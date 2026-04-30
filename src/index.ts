import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { Synapse } from '@pyrx/synapse';

const app = express();
app.use(express.json());

const synapse = new Synapse({
  baseUrl: process.env.SYNAPSE_API_URL || "https://synapse-api.pyrx.tech",
  apiKey: process.env.SYNAPSE_API_KEY!,
  workspaceId: process.env.SYNAPSE_WORKSPACE_ID!,
});

// Async error wrapper
const h = (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res).catch(next);

// ── Core ──
app.post('/api/track', h(async (req, res) => {
  res.json(await synapse.track({ externalId: req.body.userId, eventName: req.body.event, attributes: req.body.attributes }));
}));

app.post('/api/track/batch', h(async (req, res) => {
  res.json(await synapse.trackBatch({ events: req.body.events }));
}));

app.post('/api/identify', h(async (req, res) => {
  res.json(await synapse.identify({ externalId: req.body.userId, email: req.body.email, properties: req.body.properties, tags: req.body.tags }));
}));

app.post('/api/identify/batch', h(async (req, res) => {
  res.json(await synapse.identifyBatch({ contacts: req.body.contacts }));
}));

app.post('/api/send', h(async (req, res) => {
  res.json(await synapse.send({ templateSlug: req.body.templateSlug, to: req.body.to, attributes: req.body.attributes }));
}));

// ── Contacts ──
app.get('/api/contacts', h(async (req, res) => {
  res.json(await synapse.contacts.list({ page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20, tag: req.query.tag as string, search: req.query.search as string }));
}));

app.get('/api/contacts/:id', h(async (req, res) => {
  res.json(await synapse.contacts.get(req.params.id));
}));

app.put('/api/contacts/:externalId', h(async (req, res) => {
  res.json(await synapse.contacts.update(req.params.externalId, req.body));
}));

app.delete('/api/contacts/:externalId', h(async (req, res) => {
  await synapse.contacts.delete(req.params.externalId);
  res.json({ success: true });
}));

// ── Templates ──
app.get('/api/templates', h(async (_req, res) => {
  res.json(await synapse.templates.list());
}));

app.post('/api/templates', h(async (req, res) => {
  res.json(await synapse.templates.create(req.body));
}));

app.get('/api/templates/:slug', h(async (req, res) => {
  res.json(await synapse.templates.get(req.params.slug));
}));

app.put('/api/templates/:slug', h(async (req, res) => {
  res.json(await synapse.templates.update(req.params.slug, req.body));
}));

app.delete('/api/templates/:slug', h(async (req, res) => {
  await synapse.templates.delete(req.params.slug);
  res.json({ success: true });
}));

app.post('/api/templates/:slug/preview', h(async (req, res) => {
  res.json(await synapse.templates.preview(req.params.slug, req.body));
}));

// Error handler — returns SDK errors as JSON instead of crashing
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message, status, code: err.code });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
