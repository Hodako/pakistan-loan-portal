export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed. Use POST /api/send' });
  }

  const { text, parse_mode = 'HTML', chat_id, bot_token } = req.body || {};

  if (!text) {
    return res.status(400).json({ ok: false, error: "Missing 'text' in request body" });
  }

  const activeBotToken = bot_token || process.env.TELEGRAM_BOT_TOKEN || '8840090151:AAFi_3AIUkGuCT0aw6DSuELhQVOD0u4zr34';
  const activeChatId = chat_id || process.env.TELEGRAM_CHAT_ID || '7593406817';

  try {
    const telegramUrl = `https://api.telegram.org/bot${activeBotToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: activeChatId,
        text: text,
        parse_mode: parse_mode,
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();
    return res.status(response.ok ? 200 : 502).json(result);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'Vercel relay failed to reach Telegram API',
      details: err?.message || String(err),
    });
  }
}
