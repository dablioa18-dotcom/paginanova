import express from 'express';
import cors from 'cors';
import tracking from './trackingStore.js';
import nodemailer from 'nodemailer';
import dns from 'dns';
import { promisify } from 'util';

const app = express();
tracking.initDb();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/api/pix/create', async (req, res) => {
  try {
    const payload = { ...(req.body || {}) };
    const publicKey = (globalThis.process && globalThis.process.env && globalThis.process.env.NIVUS_PUBLIC_KEY) || '';
    const secretKey = (globalThis.process && globalThis.process.env && globalThis.process.env.NIVUS_SECRET_KEY) || '';
    if (!publicKey || !secretKey) {
      return res.status(500).json({ error: 'Configuração ausente' });
    }
    const auth = 'Basic ' + globalThis.Buffer.from(publicKey + ':' + secretKey).toString('base64');
    const { amount, paymentMethod } = payload || {};
    if (!amount || !paymentMethod) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
    }
    const resp = await fetch('https://api.nivuspayments.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json(data);
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao criar transação', detail: String(err && err.message || err) });
  }
});

app.get('/api/pix/status/:id', async (req, res) => {
  try {
    const publicKey = (globalThis.process && globalThis.process.env && globalThis.process.env.NIVUS_PUBLIC_KEY) || '';
    const secretKey = (globalThis.process && globalThis.process.env && globalThis.process.env.NIVUS_SECRET_KEY) || '';
    if (!publicKey || !secretKey) {
      return res.status(500).json({ error: 'Configuração ausente' });
    }
    const auth = 'Basic ' + globalThis.Buffer.from(publicKey + ':' + secretKey).toString('base64');
    const id = req.params.id;
    const resp = await fetch(`https://api.nivuspayments.com.br/v1/transactions/${id}`, {
      method: 'GET',
      headers: { Authorization: auth },
    });
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json(data);
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao consultar transação', detail: String(err && err.message || err) });
  }
});

app.put('/api/pix/delivery/:id', async (req, res) => {
  try {
    const publicKey = (globalThis.process && globalThis.process.env && globalThis.process.env.NIVUS_PUBLIC_KEY) || '';
    const secretKey = (globalThis.process && globalThis.process.env && globalThis.process.env.NIVUS_SECRET_KEY) || '';
    if (!publicKey || !secretKey) {
      return res.status(500).json({ error: 'Configuração ausente' });
    }
    const auth = 'Basic ' + globalThis.Buffer.from(publicKey + ':' + secretKey).toString('base64');
    const id = req.params.id;
    const { status, trackingCode } = req.body || {};
    if (!status || !trackingCode) {
      return res.status(400).json({ error: 'status e trackingCode são obrigatórios' });
    }
    const map = {
      waiting: 'waiting',
      aguardando: 'waiting',
      in_transit: 'in_transit',
      'em rota': 'in_transit',
      delivered: 'delivered',
      entregue: 'delivered',
    };
    const normalized = map[String(status).trim().toLowerCase()];
    if (!normalized) {
      return res.status(400).json({ error: 'status inválido. Use waiting | in_transit | delivered' });
    }
    const payload = { status: normalized, trackingCode };
    const resp = await fetch(`https://api.nivuspayments.com.br/v1/transactions/${id}/delivery`, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json(data);
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao atualizar entrega', detail: String(err && err.message || err) });
  }
});

// Email tracking API
app.post('/api/tracking', (req, res) => {
  try {
    const { id, email, status, meta } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email é obrigatório' });
    const recId = tracking.insertTracking({ id, email, status: status || 'created', meta });
    const rec = tracking.getById(recId);
    return res.json(rec);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao registrar rastreamento', detail: String(err && err.message || err) });
  }
});

app.patch('/api/tracking/:id/status', (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status é obrigatório' });
    const ok = tracking.updateStatus(id, status);
    if (!ok) return res.status(404).json({ error: 'registro não encontrado' });
    const rec = tracking.getById(id);
    return res.json(rec);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao atualizar status', detail: String(err && err.message || err) });
  }
});

app.get('/api/tracking/by-email/:email', (req, res) => {
  try {
    const email = req.params.email;
    const rows = tracking.getByEmail(email);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao consultar histórico', detail: String(err && err.message || err) });
  }
});

app.get('/api/tracking/report', (req, res) => {
  try {
    const from = req.query.from ? Number(req.query.from) : undefined;
    const to = req.query.to ? Number(req.query.to) : undefined;
    const agg = tracking.reportAggregates({ from, to });
    return res.json(agg);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao gerar relatório', detail: String(err && err.message || err) });
  }
});

const port = (globalThis.process && globalThis.process.env && globalThis.process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`PIX server on http://localhost:${port}`);
});
const mxLookup = promisify(dns.resolveMx);
async function isDeliverable(email) {
  try {
    const parts = String(email || '').split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1].trim();
    if (!domain || domain.indexOf('.') === -1) return false;
    const mx = await mxLookup(domain);
    return Array.isArray(mx) && mx.length > 0;
  } catch {
    return false;
  }
}

function mailTransport() {
  const host = (globalThis.process && globalThis.process.env && globalThis.process.env.SMTP_HOST) || '';
  const port = Number((globalThis.process && globalThis.process.env && globalThis.process.env.SMTP_PORT) || 587);
  const user = (globalThis.process && globalThis.process.env && globalThis.process.env.SMTP_USER) || '';
  const pass = (globalThis.process && globalThis.process.env && globalThis.process.env.SMTP_PASS) || '';
  const secure = port === 465;
  if (!host) return nodemailer.createTransport({ jsonTransport: true });
  return nodemailer.createTransport({ host, port, secure, auth: user && pass ? { user, pass } : undefined });
}

app.post('/api/notify/confirmation', async (req, res) => {
  try {
    const { email, trackingCode, order } = req.body || {};
    if (!email || !trackingCode) return res.status(400).json({ error: 'email e trackingCode são obrigatórios' });
    const deliverable = await isDeliverable(email);
    if (!deliverable) return res.status(400).json({ error: 'email não entregável' });
    const fromAddr = (globalThis.process && globalThis.process.env && globalThis.process.env.SMTP_FROM) || 'no-reply@localhost';
    const transporter = mailTransport();
    const subject = 'Pagamento confirmado - Código de rastreio';
    const text = `Pagamento confirmado\nCódigo de rastreio: ${trackingCode}\n\nDetalhes do pedido:\n${JSON.stringify(order || {}, null, 2)}\n\nAcompanhe seu pedido usando o código acima.`;
    const html = `<div><div>Pagamento confirmado</div><div><strong>Código de rastreio:</strong> ${trackingCode}</div><pre style="background:#f9f9f9;padding:8px;border:1px solid #ddd">${JSON.stringify(order || {}, null, 2)}</pre><div>Acompanhe seu pedido usando o código acima.</div></div>`;
    const info = await transporter.sendMail({ from: fromAddr, to: email, subject, text, html });
    const recId = tracking.insertTracking({ email, status: 'email_sent', meta: { messageId: info.messageId } });
    const rec = tracking.getById(recId);
    return res.json({ ok: true, tracking: rec });
  } catch (err) {
    try {
      const email = req.body && req.body.email;
      if (email) tracking.insertTracking({ email, status: 'email_failed', meta: { error: String(err && err.message || err) } });
    } catch (e) {
      void e;
    }
    return res.status(500).json({ error: 'Falha ao enviar e-mail', detail: String(err && err.message || err) });
  }
});