import { Component } from 'react'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      failed: true,
      message: error?.message || String(error)
    }
  }

  componentDidCatch(err) {
    console.error('openGym render error:', err)
  }

  render() {
    if (!this.state.failed) return this.props.children

    const active = useStore.getState().S.active

    return (
      <div className="narrow">
        <div className="empty" style={{ marginTop: '18vh' }}>
          <div className="ico"><Icon name="info" /></div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {t('Something went wrong')}
          </div>
          {t('This screen could not be drawn. Your data is safe on this device.')}
          <pre style={{
            direction: 'ltr',
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            fontSize: 12,
            marginTop: 16,
            padding: 12,
            borderRadius: 8,
            background: 'var(--bg-soft, #eee)',
            color: 'var(--text, #222)'
          }}>
            {this.state.message}
          </pre>
        </div>

        <Button variant="primary" icon="reset" onClick={() => location.reload()}>
          {t('Reload openGym')}
        </Button>

        {active && <>
          <div style={{ height: 8 }} />
          <Button variant="danger" icon="trash" onClick={() => {
            useStore.getState().update(s => { s.active = null })
            location.reload()
          }}>
            {t('Discard the running workout')}
          </Button>
        </>}
      </div>
    )
  }
}
