'use client'

import { useId, useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { useJourney } from '../journey-provider'
import { AscendButton, DisplayTitle, Frame, StageShell, SystemLabel } from '../ui/primitives'

type Mode = 'register' | 'login'

/**
 * MOCK AUTH — no credentials leave the browser.
 * Replace `dispatch({ type: 'signIn' })` with a real auth call later.
 */
export function AuthStage() {
  const { dispatch } = useJourney()
  const [mode, setMode] = useState<Mode>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'register' && name.trim().length < 2) return setError('Designation must be at least 2 characters.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.')
    if (password.length < 8) return setError('Access key must be at least 8 characters.')
    setError(null)
    const resolvedName = mode === 'register' ? name.trim() : email.split('@')[0]
    dispatch({ type: 'signIn', user: { name: resolvedName, email: email.trim() } })
  }

  return (
    <StageShell>
      <div className="w-full max-w-md">
        <div className="rise-in mb-8 text-center">
          <SystemLabel tone="crimson">{'Access // Gateway'}</SystemLabel>
          <DisplayTitle className="mt-4 text-2xl sm:text-3xl">
            {mode === 'register' ? 'Create Identity' : 'Resume Session'}
          </DisplayTitle>
        </div>

        <Frame className="rise-in clip-corner p-6 sm:p-8" style={{ '--delay': '0.15s' } as React.CSSProperties}>
          <div role="tablist" aria-label="Authentication mode" className="mb-8 grid grid-cols-2 border border-border">
            {(['register', 'login'] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                type="button"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m)
                  setError(null)
                }}
                className={cn(
                  'min-h-11 font-mono text-[11px] uppercase tracking-[0.3em] transition-colors',
                  mode === m ? 'bg-crimson/15 text-foreground shadow-[inset_0_-1px_0_var(--crimson)]' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {m === 'register' ? 'Register' : 'Login'}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            {mode === 'register' && (
              <Field label="Name" value={name} onChange={setName} autoComplete="name" placeholder="How the Grid knows you" />
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="operator@domain.com" />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              placeholder="Minimum 8 characters"
            />

            <p role="alert" aria-live="polite" className="min-h-4 font-mono text-[11px] uppercase tracking-[0.2em] text-crimson">
              {error}
            </p>

            <AscendButton type="submit" className="w-full">
              {mode === 'register' ? 'Initialize Identity' : 'Authenticate'}
            </AscendButton>
          </form>
        </Frame>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
          Prototype — no data leaves this device
        </p>
      </div>
    </StageShell>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  placeholder?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 border-0 border-b border-steel/60 bg-transparent px-0 py-2 text-base text-foreground placeholder:text-muted-foreground/40 transition-colors focus:border-crimson focus:outline-none"
      />
    </div>
  )
}
