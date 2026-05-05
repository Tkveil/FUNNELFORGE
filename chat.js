export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: system,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map((c) => c.text || '').join('') || 'Something went wrong.';
    res.status(200).json({ text });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Error connecting to AI.' });
  }
}
