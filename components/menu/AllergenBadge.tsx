'use client'
import { useState, useRef } from 'react'
import { ALLERGENS, type AllergenId } from '@/store/allergens'

interface Props {
  allergenIds: AllergenId[]
  size?: 'sm' | 'md'
}

export function AllergenBadge({ allergenIds, size = 'sm' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  if (allergenIds.length === 0) return null

  const iconSize = size === 'sm' ? '14px' : '18px'

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        onBlur={(e) => {
          if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false)
        }}
        className="flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 transition-colors"
        style={{ backgroundColor: 'rgba(255,160,0,0.10)', border: '1px solid rgba(255,160,0,0.25)' }}
        aria-label={`Allergènes : ${allergenIds.map((id) => ALLERGENS[id].name).join(', ')}`}
        title={allergenIds.map((id) => ALLERGENS[id].name).join(' · ')}
      >
        <span className="text-orange-500 font-bold mr-0.5" style={{ fontSize: '9px' }}>⚠</span>
        {allergenIds.map((id) => (
          <span key={id} style={{ fontSize: iconSize }} role="img" aria-label={ALLERGENS[id].name}>
            {ALLERGENS[id].icon}
          </span>
        ))}
      </button>

      {/* Popover détaillé */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 rounded-xl p-3 shadow-xl min-w-44"
          style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010', whiteSpace: 'nowrap' }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-bold mb-2" style={{ color: '#d4a843' }}>
            ⚠️ Allergènes présents
          </p>
          <ul className="flex flex-col gap-1">
            {allergenIds.map((id) => {
              const a = ALLERGENS[id]
              return (
                <li key={id} className="flex items-start gap-2">
                  <span style={{ fontSize: '13px' }}>{a.icon}</span>
                  <div>
                    <span className="text-xs font-semibold" style={{ color: '#fdf6ec' }}>{a.name}</span>
                    <span className="text-xs ml-1" style={{ color: '#6b5040' }}>— {a.description}</span>
                  </div>
                </li>
              )
            })}
          </ul>
          <div
            className="absolute left-3 -bottom-1.5 w-3 h-3 rotate-45"
            style={{ backgroundColor: '#1a0e06', borderRight: '1px solid #3a2010', borderBottom: '1px solid #3a2010' }}
          />
        </div>
      )}
    </div>
  )
}

/** Version inline (pour les pages admin et récapitulatif commande) */
export function AllergenInline({ allergenIds }: { allergenIds: AllergenId[] }) {
  if (allergenIds.length === 0) return null
  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs"
      style={{ backgroundColor: 'rgba(255,160,0,0.10)', border: '1px solid rgba(255,160,0,0.25)', color: '#9a7c4e' }}
      title={allergenIds.map((id) => ALLERGENS[id].name).join(' · ')}
    >
      <span className="text-orange-500">⚠</span>
      {allergenIds.map((id) => (
        <span key={id} role="img" aria-label={ALLERGENS[id].name} style={{ fontSize: '13px' }}>
          {ALLERGENS[id].icon}
        </span>
      ))}
    </span>
  )
}

/** Section allergènes pour récapitulatif / email */
export function AllergenSection({ allergenIds }: { allergenIds: AllergenId[] }) {
  if (allergenIds.length === 0) return null
  return (
    <div
      className="rounded-xl p-3"
      style={{ backgroundColor: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.25)' }}
    >
      <p className="text-xs font-bold mb-2" style={{ color: '#e07b00' }}>
        ⚠️ Allergènes présents dans cette commande
      </p>
      <div className="flex flex-wrap gap-2">
        {allergenIds.map((id) => {
          const a = ALLERGENS[id]
          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(255,140,0,0.12)', color: '#c06000' }}
            >
              {a.icon} {a.name}
            </span>
          )
        })}
      </div>
    </div>
  )
}
