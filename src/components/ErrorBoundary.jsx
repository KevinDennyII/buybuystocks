import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '2rem',
          margin: '2rem auto',
          maxWidth: '800px',
          background: '#1b2d4a',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e8edf7',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h2 style={{ color: '#ef4444', marginTop: 0 }}>Something went wrong</h2>
          <pre style={{
            background: '#0f1729',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.8rem',
            whiteSpace: 'pre-wrap',
          }}>
            {this.state.error?.toString()}
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
