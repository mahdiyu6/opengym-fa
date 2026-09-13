import { useStore, hasData } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import {
  webauthnOK,
  passkeyLogin,
  passkeyRegister,
  passwordLogin,
  passwordRegister,
  api,
  BIO
} from '../lib/api.js'
import { t } from '../lib/i18n.js'
import { DEMO, REPO } from '../lib/demo.js'
import { useState, useRef, useEffect } from 'react'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'

function RegisterSheet({ close }) {
  const { setUser, pushState, pullState } = useStore()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [inviteOnly, setInviteOnly] = useState(false)
  const [mode, setMode] = useState('passkey')
  const ref = useRef(null)

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 250)
  }, [])

  useEffect(() => {
    api('/api/config')
      .then(c => setInviteOnly(!!c.invite_only))
      .catch(() => {})
  }, [])

  const finish = async u => {
    setUser(u)
    close()

    if (hasData(useStore.getState().S)) {
      await pushState()
      useUI.getState().toast(
        t('Profile created — data from this device moved into it')
      )
    } else {
      await pullState()
      useUI.getState().toast(t('Welcome, {0}', u.name))
    }
  }

  const go = async () => {
    const n = name.trim()

    if (!n) {
      useUI.getState().toast(t('Enter a name'))
      return
    }

    if (inviteOnly && !code.trim()) {
      useUI.getState().toast(t('An invite code is required'))
      return
    }

    if (mode === 'password' && password.length < 8) {
      useUI.getState().toast('Password must be at least 8 characters')
      return
    }

    try {
      const u = mode === 'passkey'
        ? await passkeyRegister(n, code.trim())
        : await passwordRegister(n, password, code.trim())

      await finish(u)
    } catch (e) {
      if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
        useUI.getState().toast(e.message || t('Registration failed'))
      }
    }
  }

  return (
    <>
      <h3>{t('Create your profile')}</h3>

      <div className="muted small" style={{ marginBottom: 14 }}>
        {mode === 'passkey'
          ? t('Pick a name, then confirm with {0}.', BIO)
          : 'یک نام و رمز عبور حداقل ۸ کاراکتری انتخاب کن.'}
      </div>

      <input
        ref={ref}
        className="input"
        placeholder={t('Your name')}
        maxLength={40}
        value={name}
        onChange={e => setName(e.target.value)}
      />

      {mode === 'password' && (
        <>
          <div style={{ height: 10 }} />
          <input
            className="input"
            type="password"
            placeholder="Password — minimum 8 characters"
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </>
      )}

      {inviteOnly && (
        <>
          <div style={{ height: 10 }} />
          <input
            className="input"
            placeholder={t('Invite code')}
            maxLength={40}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            style={{
              letterSpacing: '.14em',
              fontWeight: 600,
              textAlign: 'center'
            }}
          />
        </>
      )}

      <div style={{ height: 12 }} />

      <Button variant="primary" onClick={go}>
        {mode === 'passkey'
          ? t('Create passkey')
          : 'Create profile with password'}
      </Button>

      <div style={{ height: 10 }} />

      <Button
        variant="ghost"
        onClick={() => {
          setMode(mode === 'passkey' ? 'password' : 'passkey')
          setPassword('')
        }}
      >
        {mode === 'passkey'
          ? 'Use password instead'
          : 'Use passkey instead'}
      </Button>
    </>
  )
}

function PasswordLoginSheet({ close }) {
  const { setUser, pullState } = useStore()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 250)
  }, [])

  const go = async () => {
    if (!name.trim() || !password) {
      useUI.getState().toast('Enter your name and password')
      return
    }

    try {
      const u = await passwordLogin(name.trim(), password)
      setUser(u)
      close()
      await pullState()
      useUI.getState().toast(t('Welcome back, {0}', u.name))
    } catch (e) {
      useUI.getState().toast(e.message || 'Sign-in failed')
    }
  }

  return (
    <>
      <h3>Sign in with password</h3>

      <input
        ref={ref}
        className="input"
        placeholder={t('Your name')}
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div style={{ height: 10 }} />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <div style={{ height: 12 }} />

      <Button variant="primary" onClick={go}>
        Sign in
      </Button>
    </>
  )
}

export default function Login() {
  const { setUser, pullState, setGuest } = useStore()

  const signIn = async () => {
    try {
      const u = await passkeyLogin()
      setUser(u)
      await pullState()
      useUI.getState().toast(t('Welcome back, {0}', u.name))
    } catch (e) {
      if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
        useUI.getState().toast(e.message || t('Sign-in failed'))
      }
    }
  }

  const head = (
    <>
      <div
        style={{
          fontSize: 54,
          display: 'flex',
          justifyContent: 'center',
          color: 'var(--acc)'
        }}
      >
        <Icon name="dumbbell" />
      </div>

      <h1
        style={{
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: '-.028em',
          margin: '10px 0 4px'
        }}
      >
        openGym
      </h1>
    </>
  )

  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '78vh',
    textAlign: 'center'
  }

  if (DEMO) {
    return (
      <div className="narrow" style={wrap}>
        {head}
        <div className="muted" style={{ marginBottom: 30 }}>
          {t('Live demo — everything stays in this browser.')}
        </div>

        <Button
          variant="primary"
          icon="sparkles"
          onClick={() => setGuest(true)}
        >
          {t('Start the demo')}
        </Button>
      </div>
    )
  }

  return (
    <div className="narrow" style={wrap}>
      {head}

      <div className="muted" style={{ marginBottom: 34 }}>
        {t('Your workouts. Your weights. Your profile.')}
      </div>

      {webauthnOK() && (
        <>
          <Button variant="primary" icon="person" onClick={signIn}>
            {t('Sign in with passkey')}
          </Button>

          <div style={{ height: 10 }} />

          <Button
            icon="lock"
            onClick={() =>
              useUI.getState().openSheet(close => (
                <PasswordLoginSheet close={close} />
              ))
            }
          >
            Sign in with password
          </Button>

          <div style={{ height: 10 }} />

          <Button
            icon="sparkles"
            onClick={() =>
              useUI.getState().openSheet(close => (
                <RegisterSheet close={close} />
              ))
            }
          >
            {t('Create new profile')}
          </Button>

          <div style={{ height: 10 }} />
        </>
      )}

      {!webauthnOK() && (
        <Button
          variant="primary"
          onClick={() =>
            useUI.getState().openSheet(close => (
              <PasswordLoginSheet close={close} />
            ))
          }
        >
          Sign in with password
        </Button>
      )}

      <Button
        variant="ghost"
        className="dim"
        onClick={() => setGuest(true)}
      >
        {t('Continue without account')}
      </Button>

      <div
        className="dim small"
        style={{ marginTop: 26, lineHeight: 1.5 }}
      >
        Passkeys use {BIO} — password login is also available.
        <br />
        Each profile keeps its own plan, workouts & body weight.
      </div>
    </div>
  )
}
