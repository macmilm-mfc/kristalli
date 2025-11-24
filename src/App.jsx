import { useState } from 'react'

function App() {
  return (
    <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
      <header style={{ textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem' }}>Kristalli</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}>
          A premium React experience.
        </p>
      </header>
      
      <main style={{ marginTop: '4rem' }}>
        <div style={{ 
          padding: '2rem', 
          background: 'var(--color-bg-secondary)', 
          borderRadius: '1rem', 
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <p>Welcome to your new app.</p>
        </div>
      </main>
    </div>
  )
}

export default App
