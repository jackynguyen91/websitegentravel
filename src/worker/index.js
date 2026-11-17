import { Hono } from 'hono';

const app = new Hono();

// Lớp Proxy chuyển tiếp mọi request bắt đầu bằng /api sang Base44
app.all('/api/*', async (c) => {
  const url = new URL(c.req.url);
  const targetPath = url.pathname.replace('/api', '');
  const base44Url = `${c.env.BASE44_API_BASE_URL}${targetPath}${url.search}`;

  const headers = new Headers(c.req.raw.headers);
  
  if (c.env.BASE44_API_KEY) {
    headers.set('Authorization', `Bearer ${c.env.BASE44_API_KEY}`);
    headers.set('apikey', c.env.BASE44_API_KEY);
  }

  try {
    const base44Response = await fetch(base44Url, {
      method: c.req.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : await c.req.raw.arrayBuffer()
    });

    return new Response(base44Response.body, {
      status: base44Response.status,
      headers: base44Response.headers
    });
  } catch (error) {
    return c.json({ error: 'Không thể kết nối đến hệ thống Base44', details: error.message }, 500);
  }
});

export default app;