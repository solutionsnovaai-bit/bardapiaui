import type { CSSProperties } from 'react'

/* Estrela de preço, desenhada com pontas irregulares (como a plaquinha recortada à mão do bar). */
const PONTAS = 18
const caminho = (() => {
  const pts: string[] = []
  for (let i = 0; i < PONTAS * 2; i++) {
    const ang = (i / (PONTAS * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? 100 - ((i * 37) % 11) : 74 + ((i * 23) % 7)
    pts.push(`${(Math.cos(ang) * r).toFixed(1)} ${(Math.sin(ang) * r).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
})()

/** Plaquinha amarela de preço, escrita à mão. */
export default function Estrela({ linha1, linha2, className = '', style, rotulo }: { linha1: string; linha2: string; className?: string; style?: CSSProperties; rotulo?: string }) {
  return <span className={`estrela ${className}`} style={style} role="img" aria-label={rotulo ?? `${linha1} ${linha2}`}>
    <svg viewBox="-104 -104 208 208" aria-hidden="true">
      <path d={caminho} className="estrela-fundo" />
      <path d={caminho} className="estrela-borda" transform="scale(.9)" />
    </svg>
    <span className="estrela-texto mao" aria-hidden="true"><span>{linha1}</span><span>{linha2}</span></span>
  </span>
}
