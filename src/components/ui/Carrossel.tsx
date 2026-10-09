import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, MouseEvent, PointerEvent as RPointerEvent, RefObject } from 'react'
import { m, useAnimationFrame, useMotionValue } from 'motion/react'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import type { ItemFoto } from '../../content/cardapio'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import { useMedia } from '../../hooks/useMedia'

/** Mantém o deslocamento entre -largura e 0 (o trilho tem cópias lado a lado, então dá a volta sem emenda). */
const envolve = (v: number, w: number) => (w > 0 ? (((v % w) - w) % w) : v)

function Cartao({ item, duplicado, perto, raiz, sizes, index }: { item: ItemFoto; duplicado: boolean; perto: boolean; raiz: RefObject<HTMLDivElement | null>; sizes: string; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const [dentro, setDentro] = useState(false)
  useEffect(() => {
    const el = ref.current, root = raiz.current
    if (!el || !root || dentro || !perto) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDentro(true); io.disconnect() } }, { root, rootMargin: '0px 110% 0px 110%' })
    io.observe(el)
    return () => io.disconnect()
  }, [raiz, dentro, perto])
  const r = item.w && item.h ? item.w / item.h : 3 / 4
  const giro = ((index * 7) % 5 - 2) * .6
  return <figure ref={ref} className={`car-card ${item.foto ? '' : 'is-sem-foto'}`} style={{ '--ar': r, '--giro': `${giro}deg` } as CSSProperties} aria-hidden={duplicado || undefined}>
    <span className="car-foto">
      {item.foto
        ? <picture>
          <source type="image/avif" srcSet={`${item.foto}.avif ${item.w}w`} sizes={sizes} />
          <img src={`${item.foto}.webp`} srcSet={`${item.foto}.webp ${item.w}w`} sizes={sizes} width={item.w} height={item.h}
            alt={duplicado ? '' : item.alt} loading={perto && dentro ? 'eager' : 'lazy'} decoding="async" draggable={false} />
        </picture>
        : <span className="car-vazio mao" aria-hidden="true">{item.nome}</span>}
    </span>
    <figcaption className="car-legenda mao">{item.nome}</figcaption>
  </figure>
}

type Props = {
  itens: ItemFoto[]
  rotulo: string
  className?: string
  sizes: string
  /** px por segundo (negativo anda para a esquerda). */
  velocidade?: number
}

/**
 * Carrossel que anda sozinho, devagar e sem fim. Para com o mouse em cima, com o foco do teclado
 * e no botão "Pausar"; dá para arrastar (com inércia) no mouse e no dedo, sem atrapalhar a rolagem.
 * Com "reduzir movimento", vira uma fileira que a pessoa rola.
 */
export default function Carrossel({ itens, rotulo, className = '', sizes, velocidade = -40 }: Props) {
  const { reduced } = useMotionPreferences()
  const celular = useMedia('(max-width: 767px)')
  const palco = useRef<HTMLDivElement>(null)
  const primeiroSet = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(palco)
  const [pausado, setPausado] = useState(false)
  const [copias, setCopias] = useState(2)
  const [perto, setPerto] = useState(false)
  const x = useMotionValue(0)
  const s = useRef({ largura: 0, vel: 0, hover: false, foco: false, arrastando: false, id: -1, travado: '' as '' | 'h' | 'v', moveu: false, x0: 0, y0: 0, trilho0: 0, ultX: 0, ultT: 0, velArr: 0 })

  useEffect(() => {
    const el = palco.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPerto(true); io.disconnect() } }, { rootMargin: '1000px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = primeiroSet.current
    if (!el) return
    const medir = () => {
      s.current.largura = el.offsetWidth
      setCopias(reduced ? 1 : Math.max(2, Math.ceil(window.innerWidth / Math.max(el.offsetWidth, 1)) + 1))
      x.set(envolve(x.get(), el.offsetWidth))
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [itens, reduced, x])

  useAnimationFrame((_, delta) => {
    const st = s.current
    if (!ativo || reduced || st.arrastando) return
    const dt = Math.min(delta, 50) / 1000
    const base = celular ? velocidade * .72 : velocidade
    const alvo = pausado || st.hover || st.foco ? 0 : base
    const rapido = Math.abs(st.vel) > Math.abs(base) * 1.5
    st.vel += (alvo - st.vel) * (1 - Math.exp(-dt * (rapido ? 2.4 : 3.4)))
    if (alvo === 0 && Math.abs(st.vel) < .02) return
    x.set(envolve(x.get() + st.vel * dt, st.largura))
  })

  /* Arrastar: no mouse começa na hora; no dedo, só quando o gesto é claramente horizontal. */
  const baixo = (e: RPointerEvent) => {
    if (reduced || e.button > 0) return
    const st = s.current
    Object.assign(st, { id: e.pointerId, x0: e.clientX, y0: e.clientY, trilho0: x.get(), ultX: e.clientX, ultT: performance.now(), velArr: 0, moveu: false, travado: e.pointerType === 'mouse' ? 'h' : '' })
    if (st.travado === 'h') st.arrastando = true
  }
  const mover = (e: RPointerEvent) => {
    const st = s.current
    if (e.pointerId !== st.id) return
    const dx = e.clientX - st.x0, dy = e.clientY - st.y0
    if (!st.travado) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { st.travado = 'h'; st.arrastando = true }
      else if (Math.abs(dy) > 8) { st.travado = 'v'; return }
      else return
    }
    if (st.travado !== 'h') return
    if (Math.abs(dx) > 6 && !st.moveu) { st.moveu = true; palco.current?.setPointerCapture(e.pointerId) }
    const agora = performance.now()
    st.velArr = st.velArr * .55 + ((e.clientX - st.ultX) / Math.max(1, agora - st.ultT)) * 1000 * .45
    st.ultX = e.clientX; st.ultT = agora
    x.set(envolve(st.trilho0 + dx, st.largura))
  }
  const soltar = (e: RPointerEvent) => {
    const st = s.current
    if (e.pointerId !== st.id) return
    if (st.arrastando && st.moveu) st.vel = Math.max(-2400, Math.min(2400, st.velArr))
    st.arrastando = false; st.id = -1; st.travado = ''
  }
  const cliqueCaptura = (e: MouseEvent) => { if (s.current.moveu) { e.preventDefault(); e.stopPropagation(); s.current.moveu = false } }
  const focou = (e: FocusEvent) => { if ((e.target as HTMLElement).matches(':focus-visible')) s.current.foco = true }
  const empurrar = (d: number) => { s.current.vel = d * (celular ? 900 : 1300) }

  return <div className={`carrossel ${className}`}>
    <div ref={palco} className={`car-palco ${reduced ? 'is-estatico' : ''}`}
      role="region" aria-roledescription="carrossel" aria-label={rotulo} tabIndex={0}
      onPointerDown={baixo} onPointerMove={mover} onPointerUp={soltar} onPointerCancel={soltar}
      onPointerEnter={e => { if (e.pointerType === 'mouse') s.current.hover = true }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') s.current.hover = false; if (!s.current.moveu) soltar(e) }}
      onClickCapture={cliqueCaptura} onFocus={focou} onBlur={() => { s.current.foco = false }}>
      <m.div className="car-trilho" style={reduced ? undefined : { x }}>
        {Array.from({ length: copias }, (_, c) => <div key={c} ref={c === 0 ? primeiroSet : undefined} className="car-set">
          {itens.map((it, i) => <Cartao key={it.nome} item={it} index={i} duplicado={c > 0} perto={perto} raiz={palco} sizes={sizes} />)}
        </div>)}
      </m.div>
    </div>
    {!reduced && <div className="conteiner car-controles">
      <button type="button" className="car-botao" onClick={() => empurrar(1)} aria-label="Voltar fotos"><ArrowLeft strokeWidth={2} /></button>
      <button type="button" className="car-botao" onClick={() => empurrar(-1)} aria-label="Avançar fotos"><ArrowRight strokeWidth={2} /></button>
      <button type="button" className="car-botao car-pausa" onClick={() => setPausado(p => !p)} aria-pressed={pausado}>
        {pausado ? <Play strokeWidth={2} /> : <Pause strokeWidth={2} />}<span>{pausado ? 'Continuar' : 'Pausar'}</span>
      </button>
    </div>}
  </div>
}
