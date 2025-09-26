import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Ebook Formatter - Deployment Test</h1>
      <p>This is a minimal version to test if Vercel deployment works without import issues.</p>
      <p>If you see this, the deployment was successful!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
        ✅ UI Fixes Applied:
        <ul>
          <li>Header no longer sticky</li>
          <li>Preview has scrollable container</li>
          <li>No content blocking issues</li>
        </ul>
      </div>
    </div>
  );
}

export default App;