import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useScroll, useSpring, useTransform } from 'motion/react'
import { RAIZ } from '../../content/textos'
import { SABORES } from '../../content/cardapio'
import { MENSAGENS } from '../../config/site'
import { GARRAFAS, PRATELEIRA } from '../../config/imagens'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import Revelar, { EASE, Titulo } from '../ui/Revelar'

/* Onde está a plaquinha "Raiz 4,00" na foto da prateleira (em unidades da foto, 2000 × 1398). */
const PLACA = { x: 998, y: 846 }
const ZOOM = 2.3

/** A prateleira inteira: abre como uma cortina ao rolar, com a plaquinha de preço circulada à mão. */
function Prateleira() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const abre = useTransform(scrollYProgress, [0, .38], [9, 0])
  const clipPath = useTransform(abre, v => `inset(${v}% ${v * .7}% ${v}% ${v * .7}% round 6px)`)
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const visto = useInView(ref, { once: true, amount: .45 })

  return <m.figure ref={ref} className="raiz-prateleira" style={reduced ? undefined : { clipPath }}>
    <m.div className="raiz-prateleira-movel" style={reduced ? undefined : { y, scale: 1.12 }}>
      <picture>
        <source type="image/avif" srcSet={PRATELEIRA.avif} sizes="min(100vw, 1400px)" />
        <img src={PRATELEIRA.src} srcSet={PRATELEIRA.webp} sizes="min(100vw, 1400px)" width={PRATELEIRA.largura} height={PRATELEIRA.altura}
          alt={RAIZ.fotoAlt} loading="lazy" decoding="async" />
      </picture>
      <svg className="raiz-circulo" viewBox={`0 0 ${PRATELEIRA.largura} ${PRATELEIRA.altura}`} aria-hidden="true">
        <m.path d={`M${PLACA.x - 6} ${PLACA.y - 92}c70-6 128 34 126 92-2 62-66 98-128 96-66-2-122-40-120-98 2-56 58-92 132-88 30 2 52 12 66 24`}
          initial={reduced ? false : { pathLength: 0 }} animate={visto || reduced ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.1, delay: .35, ease: [0.6, 0, 0.3, 1] }} />
        <m.path className="raiz-seta" d={`M${PLACA.x - 300} ${PLACA.y - 250}c40 70 100 110 168 128m-38-36 40 36-52 14`}
          initial={reduced ? false : { pathLength: 0 }} animate={visto || reduced ? { pathLength: 1 } : undefined}
          transition={{ duration: .7, delay: 1.25, ease: [0.6, 0, 0.3, 1] }} />
      </svg>
      <m.span className="raiz-nota mao" style={{ left: `${((PLACA.x - 300) / PRATELEIRA.largura) * 100}%`, top: `${((PLACA.y - 250) / PRATELEIRA.altura) * 100}%` }}
        initial={reduced ? false : { opacity: 0, y: 10, rotate: -6 }} animate={visto || reduced ? { opacity: 1, y: 0, rotate: -6 } : undefined}
        transition={{ duration: .6, delay: 1.5, ease: EASE }}>{RAIZ.anotacao}</m.span>
    </m.div>
  </m.figure>
}

/** Lista de sabores + foto das garrafas que dá zoom na garrafa escolhida (como uma lupa). */
function Sabores() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLDivElement>(null)
  const naTela = useInView(ref, { amount: .35 })
  const [atual, setAtual] = useState(-1)
  const [mexeu, setMexeu] = useState(false)

  /* Enquanto ninguém mexe, a lupa passeia sozinha pelas garrafas. */
  useEffect(() => {
    if (reduced || mexeu || !naTela) return
    const t = window.setInterval(() => setAtual(i => (i + 1) % SABORES.length), 2600)
    const t0 = window.setTimeout(() => setAtual(i => (i < 0 ? 0 : i)), 900)
    return () => { clearInterval(t); clearTimeout(t0) }
  }, [reduced, mexeu, naTela])

  const s = atual >= 0 ? SABORES[atual] : null
  const escala = s ? ZOOM : 1
  const clampa = (p: number) => Math.min(0, Math.max(1 - escala, .5 - (p / 100) * escala)) * 100
  const tx = s ? clampa(s.x) : 0
  const ty = s ? clampa(s.y) : 0
  const mola = { stiffness: 70, damping: 18, mass: 1 }
  const scale = useSpring(1, mola), x = useSpring(0, mola), y = useSpring(0, mola)
  useEffect(() => { scale.set(escala); x.set(tx); y.set(ty) }, [escala, tx, ty, scale, x, y])
  const xp = useTransform(x, v => `${v}%`), yp = useTransform(y, v => `${v}%`)

  const escolher = (i: number) => { setMexeu(true); setAtual(i) }

  return <div ref={ref} className="conteiner raiz-sabores">
    <div className="raiz-lista">
      <Revelar><h3 className="titulo-m">{RAIZ.saboresTitulo}</h3></Revelar>
      <Revelar delay={.05}><p className="raiz-dica">{RAIZ.saboresDica}</p></Revelar>
      <ul className="raiz-nomes">
        {SABORES.map((sab, i) => <Revelar as="li" key={sab.nome} delay={.08 + i * .05}>
          <button type="button" className="raiz-nome" aria-pressed={atual === i} aria-controls="raiz-lupa"
            onClick={() => escolher(i)} onPointerEnter={e => { if (e.pointerType === 'mouse') escolher(i) }}>
            <span>{sab.nome}</span>
          </button>
        </Revelar>)}
      </ul>
      <Revelar delay={.1}><p className="raiz-tambem">{RAIZ.tambem}</p></Revelar>
      <Revelar delay={.14}><p className="raiz-torneira">{RAIZ.torneira}</p></Revelar>
      <Revelar delay={.18} className="raiz-cta">
        <Botao href={waLink(MENSAGENS.raiz)} rotuloAcessivel={`${RAIZ.cta} pelo WhatsApp (abre em nova aba)`}>{RAIZ.cta}</Botao>
      </Revelar>
    </div>

    <div className="raiz-lupa-col">
      <div id="raiz-lupa" className="raiz-lupa">
        <m.div className="raiz-lupa-img" style={reduced ? { scale: escala, x: `${tx}%`, y: `${ty}%` } : { scale, x: xp, y: yp }}>
          <picture>
            <source type="image/avif" srcSet={`${GARRAFAS.avif} ${GARRAFAS.largura}w`} sizes="(min-width: 1024px) 40vw, 92vw" />
            <img src={GARRAFAS.webp} srcSet={`${GARRAFAS.webp} ${GARRAFAS.largura}w`} sizes="(min-width: 1024px) 40vw, 92vw" width={GARRAFAS.largura} height={GARRAFAS.altura}
              alt={RAIZ.closeAlt} loading="lazy" decoding="async" draggable={false} />
          </picture>
        </m.div>
        <div className="raiz-etiqueta-pos" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {s && <m.span key={s.nome} className="raiz-etiqueta mao"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, rotate: -10 }} animate={{ opacity: 1, y: 0, rotate: -4 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, rotate: 2 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
              {s.nome}
            </m.span>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
}

export default function Raiz() {
  return <section id="raiz" className="raiz secao cal" aria-labelledby="raiz-titulo">
    <div className="conteiner raiz-cabeca">
      <div className="titulo-caixa"><Titulo id="raiz-titulo" className="titulo" linhas={RAIZ.titulo} /></div>
      <Revelar delay={.1}><p className="lead">{RAIZ.texto}</p></Revelar>
    </div>
    <div className="conteiner"><Prateleira /></div>
    <Sabores />
  </section>
}
