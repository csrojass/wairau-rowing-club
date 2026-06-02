/**
 * Wairau Rowing Club — forms relay Worker
 *
 * Routes:
 *   POST /forms/contact     — General contact form
 *   POST /forms/membership  — Membership enquiry
 *
 * Behaviour:
 *   - Accepts form-encoded or multipart body.
 *   - Honeypot field (`_hp`) silently drops bots.
 *   - Emails the submission to the configured TO_EMAIL via Resend.
 *   - Redirects to /thanks on success.
 *
 * Env (set with `wrangler secret put`):
 *   RESEND_API_KEY, TO_EMAIL, FROM_EMAIL, SITE_ORIGIN
 */

const FORMS = {
  contact: {
    subject: 'Wairau RC website — Contact form',
    label: 'Contact enquiry',
    fields: ['name', 'email', 'subject', 'message'],
  },
  membership: {
    subject: 'Wairau RC website — Membership enquiry',
    label: 'Membership enquiry',
    fields: ['firstName', 'lastName', 'email', 'phone', 'program', 'message'],
  },
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get('origin') || env.SITE_ORIGIN || '';

    // Quick CORS preflight
    if (req.method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }), origin, env);
    }

    if (req.method !== 'POST') {
      return cors(json({ error: 'Method not allowed' }, 405), origin, env);
    }

    const match = url.pathname.match(/^\/forms\/(contact|membership)\/?$/);
    if (!match) return cors(json({ error: 'Not found' }, 404), origin, env);

    const form = FORMS[match[1]];
    let data;
    try {
      data = await parseBody(req);
    } catch (err) {
      return cors(json({ error: 'Could not parse body' }, 400), origin, env);
    }

    // Honeypot
    if (data._hp) {
      // Pretend success so bots don't retry
      return cors(redirectOrJson(req, origin, env), origin, env);
    }

    // Build email
    const lines = form.fields
      .map((f) => {
        const val = (data[f] || '').toString().trim();
        if (!val) return null;
        const label = f.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
        return `${label}: ${val}`;
      })
      .filter(Boolean);

    if (lines.length === 0) {
      return cors(json({ error: 'Empty submission' }, 400), origin, env);
    }

    const submittedAt = new Date().toISOString();
    const textBody = [
      `New ${form.label} from the Wairau Rowing Club website`,
      '',
      ...lines,
      '',
      `— submitted ${submittedAt}`,
      `Reply-to: ${data.email || data['email'] || '(no email provided)'}`,
    ].join('\n');

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: env.TO_EMAIL,
          reply_to: data.email || undefined,
          subject: form.subject,
          text: textBody,
        }),
      });
      if (!r.ok) {
        const errTxt = await r.text();
        console.error('Resend error', r.status, errTxt);
        return cors(json({ error: 'Email send failed', detail: errTxt.slice(0, 200) }, 502), origin, env);
      }
    } catch (err) {
      console.error('Send exception', err);
      return cors(json({ error: 'Email send threw' }, 502), origin, env);
    }

    return cors(redirectOrJson(req, origin, env), origin, env);
  },
};

async function parseBody(req) {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return await req.json();
  }
  // multipart/form-data or application/x-www-form-urlencoded
  const fd = await req.formData();
  const obj = {};
  for (const [k, v] of fd.entries()) obj[k] = typeof v === 'string' ? v : v.name;
  return obj;
}

function cors(res, origin, env) {
  const allowed = (env.SITE_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  const allow = allowed.includes(origin) ? origin : allowed[0] || '*';
  res.headers.set('Access-Control-Allow-Origin', allow);
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  res.headers.set('Vary', 'Origin');
  return res;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function redirectOrJson(req, origin, env) {
  const accept = req.headers.get('accept') || '';
  if (accept.includes('application/json')) {
    return json({ ok: true });
  }
  const target = `${env.SITE_ORIGIN?.split(',')[0]?.trim() || origin || ''}/thanks`;
  return Response.redirect(target, 303);
}
