import { useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { FAIXAS } from '../../content/textos'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useSceneActivity } from '../../hooks/useSceneActivity'

const envolve = (min: number, max: number, v: number) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

function Brilho() {
  return <svg className="fita-brilho" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0c.8 5.6 3.6 8.6 10 10-6.4 1.4-9.2 4.4-10 10C9.2 14.4 6.4 11.4 0 10c6.4-1.4 9.2-4.4 10-10Z" /></svg>
}

function Fita({ palavras, classe, x }: { palavras: readonly string[]; classe: string; x: MotionValue<string> }) {
  const metade = <span className="fita-metade">
    {palavras.map(p => <span key={p} className="fita-item"><span>{p}</span><Brilho /></span>)}
  </span>
  return <div className={`fita ${classe}`}>
    <m.div className="fita-trilho" style={{ x }}>{metade}{metade}</m.div>
  </div>
}

/**
 * Duas fitas cruzadas (como a faixa do logotipo), correndo em sentidos opostos.
 * Andam sozinhas, aceleram com a velocidade da rolagem e invertem o sentido quando a pessoa rola para cima.
 */
export default function Faixas() {
  const ref = useRef<HTMLElement>(null)
  const ativa = useSceneActivity(ref)
  const { reduced } = useMotionPreferences()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocidade = useVelocity(scrollY)
  const suave = useSpring(velocidade, { damping: 50, stiffness: 380 })
  const fator = useTransform(suave, [0, 1000], [0, 4], { clamp: false })
  const xA = useTransform(base, v => `${envolve(-50, 0, v)}%`)
  const xB = useTransform(base, v => `${envolve(-50, 0, -v * .8)}%`)
  const sentido = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (!ativa || reduced) return
    let passo = sentido.current * 1.25 * (Math.min(delta, 50) / 1000)
    const f = fator.get()
    if (f < -0.02) sentido.current = 1
    else if (f > 0.02) sentido.current = -1
    passo += sentido.current * Math.abs(passo) * Math.min(Math.abs(f), 6)
    base.set(base.get() + passo)
  })

  return <section ref={ref} className="faixas cal" aria-label="O que tem no bar">
    <p className="sr-only">{[...FAIXAS.clara, ...FAIXAS.ambar].join(', ')}.</p>
    <div aria-hidden="true">
      <Fita palavras={FAIXAS.ambar} classe="fita-ambar" x={xB} />
      <Fita palavras={FAIXAS.clara} classe="fita-clara" x={xA} />
    </div>
  </section>
}
