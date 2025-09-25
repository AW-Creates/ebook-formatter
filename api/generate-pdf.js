export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { text, template_name, title, author } = req.body;

  if (!text) {
    res.status(400).json({ error: 'No text provided' });
    return;
  }

  // Simulate processing time
  setTimeout(() => {
    res.status(200).json({
      success: true,
      message: 'PDF generation complete',
      filename: `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
      note: 'This is a demo response. In production, actual PDF file would be generated.'
    });
  }, 2000);
}