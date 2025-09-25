export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const templates = {
    'classic': {
      'name': 'Classic',
      'description': 'Traditional book styling with serif fonts'
    },
    'modern': {
      'name': 'Modern',
      'description': 'Clean, contemporary design with sans-serif fonts'
    },
    'elegant': {
      'name': 'Elegant',
      'description': 'Sophisticated typography with elegant spacing'
    },
    'scifi': {
      'name': 'Sci-Fi',
      'description': 'Futuristic styling perfect for science fiction'
    }
  };

  res.status(200).json(templates);
}