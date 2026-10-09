import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { MotionValue } from 'motion/react'
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { GELADA } from '../../content/textos'
import { BEBIDAS } from '../../content/cardapio'
import { MENSAGENS } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import Carrossel from '../ui/Carrossel'
import Revelar, { Titulo } from '../ui/Revelar'

/* Gotas de condensação no vidro (posições fixas, para não mudar a cada render). */
const GOTAS = Array.from({ length: 34 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453, b = Math.sin(i * 78.233) * 12345.6789
  const fx = a - Math.floor(a), fy = b - Math.floor(b)
  const y = 300 + fy * 430
  const largura = y < 410 ? 30 + (y - 300) * .6 : 66
  return { cx: 120 + (fx * 2 - 1) * largura, cy: y, r: 2.2 + ((i * 7) % 5) * .7 }
})
const BOLHAS = Array.from({ length: 16 }, (_, i) => ({ x: 70 + ((i * 37) % 100), d: 2.4 + ((i * 13) % 9) / 4, t: ((i * 29) % 30) / 10, r: 2 + (i % 3) }))

const CORPO = 'M92 60C92 150 96 230 100 262C106 312 45 352 45 420L45 722C45 744 60 752 80 752L160 752C180 752 195 744 195 722L195 420C195 352 134 312 140 262C144 230 148 150 148 60Z'

/** Garrafa long neck desenhada no traço do logotipo (contorno preto grosso), com rótulo da casa. */
function Garrafa({ p, estatica }: { p: MotionValue<number>; estatica: boolean }) {
  const giroTampa = useTransform(p, [.16, .2, .24, .28, .31, .34, .46], [0, -7, 6, -5, 4, 0, -340])
  const yTampa = useTransform(p, [.34, .48], [0, -460])
  const xTampa = useTransform(p, [.34, .48], [0, -70])
  const opTampa = useTransform(p, [.44, .5], [1, 0])
  const gas = useTransform(p, [.33, .36, .52], [0, .85, 0])
  const gasEscala = useTransform(p, [.33, .52], [.3, 1.7])
  const espuma = useTransform(p, [.4, .6], [0, 1])
  const gotas = useTransform(p, [.02, .16], [0, 1])
  const [aberta, setAberta] = useState(estatica)
  useMotionValueEvent(p, 'change', v => { if (!estatica) setAberta(v > .38) })

  return <svg className={`garrafa ${aberta ? 'is-aberta' : ''}`} viewBox="-40 -120 320 900" aria-hidden="true">
    <defs>
      <clipPath id="garrafa-vidro"><path d={CORPO} /></clipPath>
    </defs>
    {/* espuma subindo pelo gargalo */}
    <m.g style={estatica ? undefined : { scaleY: espuma, originX: '120px', originY: '64px' }} className="garrafa-espuma">
      <path d="M86 64C70 40 84 8 104 14C110-12 140-10 142 10C162 2 178 34 156 60C162 82 150 110 152 140C144 124 146 96 140 84C134 100 132 130 128 150C122 128 126 96 116 86C108 104 104 120 98 132C96 112 100 84 86 64Z" />
    </m.g>
    {/* corpo de vidro */}
    <path d={CORPO} className="garrafa-vidro" />
    <g clipPath="url(#garrafa-vidro)">
      <rect x="40" y="300" width="160" height="460" className="garrafa-liquido" />
      <g className={`garrafa-bolhas ${aberta ? 'anima-continua is-ativa' : ''}`}>
        {BOLHAS.map((b, i) => <circle key={i} cx={b.x + 25} cy={740} r={b.r} style={{ animationDuration: `${b.d}s`, animationDelay: `${b.t}s` } as CSSProperties} />)}
      </g>
      <rect x="62" y="150" width="14" height="560" rx="7" className="garrafa-reflexo" />
      <rect x="168" y="420" width="6" height="280" rx="3" className="garrafa-reflexo garrafa-reflexo-2" />
      <m.g style={estatica ? undefined : { opacity: gotas }} className="garrafa-gotas">
        {GOTAS.map((g, i) => <ellipse key={i} cx={g.cx} cy={g.cy} rx={g.r * .8} ry={g.r} />)}
      </m.g>
    </g>
    <path d={CORPO} className="garrafa-contorno" />
    {/* rótulo da casa */}
    <g className="garrafa-rotulo">
      <rect x="45" y="476" width="150" height="170" />
      <text x="120" y="548" textAnchor="middle" className="garrafa-rotulo-da">da</text>
      <text x="120" y="604" textAnchor="middle" className="garrafa-rotulo-nome">PIAUÍ</text>
      <text x="120" y="630" textAnchor="middle" className="garrafa-rotulo-sub">BAR E MERCEARIA</text>
      <path d="M58 500H182M58 622H182" className="garrafa-rotulo-fio" />
    </g>
    <rect x="96" y="214" width="48" height="40" rx="3" className="garrafa-gargalo" />
    {/* boca da garrafa */}
    <rect x="86" y="44" width="68" height="22" rx="7" className="garrafa-boca" />
    {/* gás saindo */}
    <m.g style={estatica ? { opacity: 0 } : { opacity: gas, scale: gasEscala, originX: '120px', originY: '40px' }} className="garrafa-gas">
      <path d="M120 36C96 10 132-14 112-44M104 30C70 14 86-28 60-40M136 30C170 12 150-30 178-46" />
    </m.g>
    {/* tampinha */}
    <m.g style={estatica ? { opacity: 0 } : { rotate: giroTampa, y: yTampa, x: xTampa, opacity: opTampa, originX: '120px', originY: '30px' }} className="garrafa-tampa">
      <path d="M82 22L86 50L92 42L98 52L104 42L110 52L116 42L122 52L128 42L134 52L140 42L146 52L152 42L158 50L160 22C160 10 146 6 121 6C96 6 82 10 82 22Z" />
      <path d="M90 20H152" className="garrafa-tampa-brilho" />
    </m.g>
  </svg>
}

/**
 * Gelada: a garrafa abre com a rolagem (a tampinha treme, estoura e voa, o gás sai e a espuma sobe),
 * e a cerveja enche a tela de baixo para cima, trocando a cor do letreiro por onde passa.
 * Depois, o carrossel do freezer.
 */
export default function Gelada() {
  const { reduced } = useMotionPreferences()
  const cena = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cena, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: .4 })
  const enche = useTransform(p, [.6, .97], [100, -4])
  const clipPath = useTransform(enche, v => `inset(${v}% 0% 0% 0%)`)
  const yGarrafa = useTransform(p, [0, .16], ['38%', '0%'])
  const giroGarrafa = useTransform(p, [0, .16, .34, .36, .4, .97], [-9, 0, 0, -3, 0, 4])
  const yTexto = useTransform(p, [0, 1], ['6%', '-8%'])
  const tss = useTransform(p, [.33, .37, .5, .56], [0, 1, 1, 0])
  const tssEscala = useTransform(p, [.33, .38], [.4, 1])

  const letreiro = (cls: string, oculto?: boolean) => <div className={`gelada-texto ${cls}`} aria-hidden={oculto || undefined}>
    {oculto
      ? <p className="titulo">{GELADA.titulo.map(l => <span key={l} className="gelada-linha">{l}</span>)}</p>
      : <Titulo id="gelada-titulo" className="titulo" linhas={GELADA.titulo} />}
    <p className="gelada-lead">{GELADA.texto}</p>
  </div>

  return <section id="gelada" className="gelada" aria-labelledby="gelada-titulo">
    <div ref={cena} className={`gelada-cena tema-escuro ${reduced ? 'is-estatica' : ''}`}>
      <div className="gelada-palco">
        <m.div className="conteiner gelada-grade" style={reduced ? undefined : { y: yTexto }}>{letreiro('')}</m.div>
        <m.div className="gelada-garrafa" style={reduced ? undefined : { y: yGarrafa, rotate: giroGarrafa }}>
          <Garrafa p={p} estatica={reduced} />
          {!reduced && <m.span className="gelada-tss mao" aria-hidden="true" style={{ opacity: tss, scale: tssEscala, rotate: -12 }}>tsss!</m.span>}
        </m.div>
        {!reduced && <m.div className="gelada-enchente" style={{ clipPath }} aria-hidden="true">
          <div className="gelada-onda anima-continua" />
          <div className="gelada-bolhas anima-continua">{Array.from({ length: 18 }, (_, i) => <span key={i} style={{ left: `${(i * 53) % 100}%`, animationDelay: `${((i * 17) % 40) / 10}s`, animationDuration: `${3.2 + ((i * 7) % 5) * .5}s` }} />)}</div>
          <m.div className="conteiner gelada-grade" style={{ y: yTexto }}>{letreiro('is-sobre-ambar', true)}</m.div>
        </m.div>}
      </div>
    </div>

    <div className="gelada-bebidas">
      <div className="conteiner gelada-bebidas-cabeca">
        <Revelar><h3 className="titulo-m">{GELADA.carrosselTitulo}</h3></Revelar>
        <Revelar delay={.08}><Botao href={waLink(MENSAGENS.gelada)} rotuloAcessivel={`${GELADA.cta} pelo WhatsApp (abre em nova aba)`}>{GELADA.cta}</Botao></Revelar>
      </div>
      <Carrossel itens={BEBIDAS} rotulo="Bebidas do bar" className="car-bebidas" velocidade={-46}
        sizes="(max-width: 767px) 58vw, 300px" />
    </div>
  </section>
}
