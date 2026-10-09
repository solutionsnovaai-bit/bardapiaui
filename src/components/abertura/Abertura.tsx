import { useLayoutEffect, useRef } from 'react'
import { animate } from 'motion/react'
import { LOGO, CERVEJA, TAMANHOS_LOGO } from '../../config/imagens'
import { LINHAS } from './linhas'

export type ModoAbertura = 'completa' | 'rapida' | 'nenhuma'

export function modoAbertura(): ModoAbertura {
  const m = document.documentElement.dataset.abertura
  return m === 'rapida' || m === 'nenhuma' ? m : 'completa'
}

type Props = {
  /** O logotipo começou a voar: o topo do site entra. */
  onSaida: () => void
  /** O logotipo pousou no lugar: a abertura sai de cena. */
  onFim: () => void
}

const espera = (s: number) => new Promise<void>(r => window.setTimeout(r, s * 1000))
const decodifica = (img: HTMLImageElement | null) =>
  img ? (img.complete && img.naturalWidth ? Promise.resolve() : img.decode().catch(() => undefined)) : Promise.resolve()

/* Centro da taça no desenho do logotipo (fração da largura e da altura). */
const TACA = { x: 626 / 1254, y: 581 / 1254 }

/*
  Abertura (1ª visita ~4 s; ao voltar ~1,5 s).
  1. No escuro, um traço cor de palha desenha o logotipo, da taça para fora.
  2. A taça enche de cerveja conforme o site carrega (é a barra de carregamento).
  3. A luz abre a partir da taça e revela o logotipo de verdade, na parede caiada.
  4. O logotipo voa até o lugar dele no topo do site.
  Tudo o que se move é transform, opacity, clip-path ou máscara: nada de layout durante a animação.
*/
export default function Abertura({ onSaida, onFim }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const breu = useRef<HTMLDivElement>(null)
  const cal = useRef<HTMLDivElement>(null)
  const lugar = useRef<HTMLDivElement>(null)
  const vooX = useRef<HTMLDivElement>(null)
  const vooY = useRef<HTMLDivElement>(null)
  const caixa = useRef<HTMLDivElement>(null)
  const linhas = useRef<SVGSVGElement>(null)
  const logo = useRef<HTMLImageElement>(null)
  const cerveja = useRef<HTMLImageElement>(null)
  const cervejaCaixa = useRef<HTMLDivElement>(null)
  const legenda = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const modo = modoAbertura()
    if (modo === 'nenhuma') { onSaida(); onFim(); return }
    const completa = modo === 'completa'
    try { sessionStorage.setItem('piaui-abertura', '1') } catch { /* navegação privada */ }

    let cancelado = false
    let voando = false
    const alvo = () => document.querySelector<HTMLElement>('[data-alvo-logo]')

    /* O logotipo da abertura tem o tamanho final (o do topo) e começa reduzido no centro; fica nítido no voo. */
    const medir = () => {
      const l = lugar.current, c = caixa.current, x = vooX.current, y = vooY.current
      if (!l || !c || !x || !y) return null
      const a = alvo()
      const P = l.getBoundingClientRect()
      const R = a?.getBoundingClientRect() ?? P
      const s0 = P.height / R.height
      c.style.width = `${R.width}px`
      c.style.height = `${R.height}px`
      if (!voando) {
        x.style.transform = `translateX(${P.left}px)`
        y.style.transform = `translateY(${P.top}px) scale(${s0})`
      }
      const unidadesPorPx = LINHAS.w / (R.width * s0)
      linhas.current?.querySelectorAll('path').forEach(p => p.setAttribute('stroke-width', (2 * unidadesPorPx).toFixed(2)))
      return { R, P, s0 }
    }
    let medida = medir()
    const aoRedimensionar = () => { if (!voando) medida = medir() }
    window.addEventListener('resize', aoRedimensionar)

    /* Carregamento real: fontes, logotipo e cerveja. */
    const tarefas = [document.fonts?.ready ?? Promise.resolve(), decodifica(logo.current), decodifica(cerveja.current)]
    let feitas = 0
    let encher = false
    const nivel = (dur = .9) => {
      if (!encher || !cervejaCaixa.current) return
      const f = Math.max(.12, feitas / tarefas.length) * .86
      animate(cervejaCaixa.current, { clipPath: `inset(${((1 - f) * 100).toFixed(1)}% 0% 0% 0%)` }, { duration: dur, ease: [0.3, 0, 0.2, 1] })
    }
    const carregado = Promise.race([
      Promise.all(tarefas.map(t => Promise.resolve(t).then(() => { feitas++; nivel() }))),
      espera(7),
    ])

    const roda = async () => {
      const paths = Array.from(linhas.current?.querySelectorAll('path') ?? [])
      const E = [0.22, 1, 0.36, 1] as const

      if (completa) {
        /* 1. O traço desenha o logotipo, da taça para fora. */
        paths.forEach((p, i) => {
          const d = .08 + i * .04
          animate(p, { strokeDashoffset: [1, 0], opacity: [0, 1] }, {
            strokeDashoffset: { duration: 1.25, delay: d, ease: [0.45, 0, 0.15, 1] },
            opacity: { duration: .2, delay: d },
          })
        })
        animate(legenda.current!, { opacity: [0, 1], y: [8, 0] }, { duration: .7, delay: .5, ease: E })
        /* 2. A taça começa a encher. */
        await espera(.55)
        if (cancelado) return
        encher = true
        nivel(1.1)
        await Promise.all([espera(1.25), carregado])
        if (cancelado) return
        await animate(cervejaCaixa.current!, { clipPath: 'inset(0% 0% 0% 0%)' }, { duration: .55, ease: [0.3, 0, 0.2, 1] }).finished
        if (cancelado) return
        /* a espuma assenta */
        animate(cerveja.current!, { scaleY: [1, 1.018, 1] }, { duration: .5, ease: 'easeOut' })
        animate(legenda.current!, { opacity: 0 }, { duration: .35 })
        /* 3. A luz abre a partir da taça e revela o logotipo de verdade. */
        medida = medir()
        if (medida) {
          breu.current!.style.setProperty('--cx', `${medida.P.left + medida.P.width * TACA.x}px`)
          breu.current!.style.setProperty('--cy', `${medida.P.top + medida.P.height * TACA.y}px`)
        }
        breu.current!.classList.add('is-abrindo')
        animate(breu.current!, { '--raio': ['-10vmax', '160vmax'] } as never, { duration: 1.25, ease: [0.6, 0, 0.25, 1] })
        animate(logo.current!, { opacity: [0, 1] }, { duration: .7, delay: .15, ease: 'easeOut' })
        animate(linhas.current!, { opacity: 0 }, { duration: .6, delay: .2 })
        animate(cervejaCaixa.current!, { opacity: 0 }, { duration: .3, delay: .8 })
        await espera(1.05)
      } else {
        animate(logo.current!, { opacity: [0, 1], scale: [.96, 1] }, { duration: .6, ease: E })
        await Promise.all([espera(.45), carregado])
      }
      if (cancelado) return

      /* 4. Voo: o logotipo vai para o lugar dele no topo, numa curva (x e y com tempos diferentes). */
      medida = medir()
      voando = true
      const destino = alvo()?.getBoundingClientRect()
      raiz.current?.classList.remove('is-bloqueando')
      onSaida()
      if (!medida || !destino) {
        await animate(raiz.current!, { opacity: 0 }, { duration: .5 }).finished
        if (!cancelado) onFim()
        return
      }
      const dur = completa ? 1.15 : .95
      animate(cal.current!, { opacity: 0 }, { duration: .7, delay: .1, ease: 'easeOut' })
      animate(breu.current!, { opacity: 0 }, { duration: .3 })
      const vx = animate(vooX.current!, { x: [medida.P.left, destino.left] }, { duration: dur, ease: [0.72, 0, 0.22, 1] })
      const vy = animate(vooY.current!, { y: [medida.P.top, destino.top], scale: [medida.s0, destino.height / medida.R.height] }, { duration: dur, ease: [0.5, 0, 0.18, 1] })
      await Promise.all([vx.finished, vy.finished])
      if (!cancelado) onFim()
    }

    roda().catch(() => { if (!cancelado) { onSaida(); onFim() } })
    return () => { cancelado = true; window.removeEventListener('resize', aoRedimensionar) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const c = CERVEJA.caixa
  return <div ref={raiz} className="abertura is-bloqueando" aria-hidden="true">
    <div ref={cal} className="ab-cal cal" />
    <div ref={breu} className="ab-breu" />
    <div className="ab-palco">
      <div ref={lugar} className="ab-lugar" />
      <p ref={legenda} className="ab-legenda mao">enchendo o copo…</p>
    </div>
    <div ref={vooX} className="ab-voo-x">
      <div ref={vooY} className="ab-voo-y">
        <div ref={caixa} className="ab-logo">
          <svg ref={linhas} className="ab-linhas" viewBox={`0 0 ${LINHAS.w} ${LINHAS.h}`}>
            {LINHAS.paths.map((d, i) => <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} opacity={0} />)}
          </svg>
          <div ref={cervejaCaixa} className="ab-cerveja" style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, height: `${c.h}%` }}>
            <picture>
              <source type="image/avif" srcSet={CERVEJA.avif} />
              <img ref={cerveja} src={CERVEJA.webp} width={CERVEJA.largura} height={CERVEJA.altura} alt="" decoding="async" fetchPriority="high" />
            </picture>
          </div>
          <picture>
            <source type="image/avif" srcSet={LOGO.avif} sizes={TAMANHOS_LOGO} />
            <img ref={logo} className="ab-logo-img" src={LOGO.src} srcSet={LOGO.webp} sizes={TAMANHOS_LOGO} width={LOGO.largura} height={LOGO.altura} alt="" decoding="async" fetchPriority="high" />
          </picture>
        </div>
      </div>
    </div>
  </div>
}
