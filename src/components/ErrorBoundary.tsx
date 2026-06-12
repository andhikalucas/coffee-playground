import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { resetVault } from '../lib/storage'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Last line of defense — deliberately context-free and styled inline so it
 * can render no matter what fell over. "Start fresh" clears the vault for
 * the (hopefully never) case where saved data is what's crashing us.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('coffee playground spilled:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div
        role="alert"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'grid',
          placeContent: 'center',
          justifyItems: 'center',
          gap: 14,
          background: '#f6eedd',
          color: '#2a1b10',
          fontFamily: "'Patrick Hand', 'Segoe Print', cursive",
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div style={{ fontSize: '3rem' }}>☕💥</div>
        <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', margin: 0 }}>
          well… the cup tipped over
        </h1>
        <p style={{ maxWidth: 420, margin: 0 }}>
          something crashed. trying again usually works — if it keeps happening, your saved data may be the
          culprit.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              font: 'inherit',
              padding: '8px 20px',
              border: '2.5px solid #2a1b10',
              borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
              background: '#e0341e',
              color: '#fff9ef',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #2a1b10',
            }}
          >
            try again
          </button>
          <button
            type="button"
            onClick={() => {
              resetVault()
              window.location.reload()
            }}
            style={{
              font: 'inherit',
              padding: '8px 20px',
              border: '2px dashed #2a1b10',
              borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px',
              background: 'transparent',
              color: '#2a1b10',
              cursor: 'pointer',
            }}
          >
            start fresh (clears saved cards)
          </button>
        </div>
      </div>
    )
  }
}
