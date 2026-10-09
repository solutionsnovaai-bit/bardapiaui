import { useEffect, useRef } from 'react'
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, MapPin } from 'lucide-react'
import { HERO } from '../../content/textos'
import { ENDERECO_LINHA, MENSAGENS, SITE } from '../../config/site'
import { HERO_ARTE, LOGO, TAMANHOS_LOGO } from '../../config/imagens'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import Estrela from '../ui/Estrela'
import { EASE, Titulo } from '../ui/Revelar'

export type Fase = 'abertura' | 'saida' | 'pronto'

/**
 * Topo: o logotipo como uma placa na parede caiada (inclina de leve com o mouse) e o letreiro ao lado.
 * O logotipo chega voando da abertura e pousa exatamente aqui ([data-alvo-logo]).
 */
export default function Hero({ fase }: { fase: Fase }) {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const entrou = fase !== 'abertura'
  const pronto = fase === 'pronto'

  /* Rolagem: o logotipo desce mais devagar que a página e o texto sobe um pouco. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yLogo = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const escala = useTransform(scrollYProgress, [0, 1], [1, .92])
  const yTexto = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  /* Mouse: a placa inclina na direção do cursor, com mola. */
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-1, 1], [-7, 7]), { stiffness: 90, damping: 16 })
  const rotX = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 90, damping: 16 })
  useEffect(() => {
    if (reduced || !pronto || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const mover = (e: PointerEvent) => { mx.set((e.clientX / window.innerWidth) * 2 - 1); my.set((e.clientY / window.innerHeight) * 2 - 1) }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => { window.removeEventListener('pointermove', mover); mx.set(0); my.set(0) }
  }, [reduced, pronto, mx, my])

  const surge = (atraso: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    animate: entrou || reduced ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay: atraso, ease: EASE },
  })

  return <section ref={ref} id="topo" className={`hero cal ${HERO_ARTE ? 'tem-arte' : ''}`} aria-labelledby="hero-titulo">
    {HERO_ARTE && <picture>
      <source media="(max-width: 767px)" srcSet={HERO_ARTE.mobile} />
      <img className="hero-arte" src={HERO_ARTE.desktop} alt="" fetchPriority="high" decoding="async" />
    </picture>}

    <div className="conteiner hero-grade">
      <m.div className="hero-texto" style={reduced ? undefined : { y: yTexto }}>
        <Titulo as="h1" id="hero-titulo" className="letreiro hero-titulo" linhas={HERO.titulo} ativo={entrou} atraso={.15}
          rotulo={`${SITE.nome}: ${HERO.titulo.join(' ')}`} />
        <m.p className="lead hero-lead" {...surge(.5)}>{HERO.texto}</m.p>
        <m.div className="hero-estrela"
            initial={reduced ? false : { scale: 0, rotate: -40 }}
            animate={pronto || reduced ? { scale: 1, rotate: -9 } : undefined}
            transition={{ type: 'spring', stiffness: 260, damping: 13, delay: .15 }}>
          <Estrela linha1={HERO.estrela.linha1} linha2={HERO.estrela.linha2} rotulo={`Dose de cachaça raiz: R$ ${SITE.doseRaiz}`} />
        </m.div>
        <m.div className="hero-acoes" {...surge(.62)}>
          <Botao href={waLink(MENSAGENS.padrao)} rotuloAcessivel={`${HERO.cta} (abre em nova aba)`}>{HERO.cta}</Botao>
          <a className="link-linha hero-link" href="#raiz">{HERO.link}<ArrowDown aria-hidden="true" strokeWidth={2} /></a>
        </m.div>
      </m.div>

      {!HERO_ARTE && <div className="hero-logo-area">
        <m.div className="hero-logo-rolagem" style={reduced ? undefined : { y: yLogo, scale: escala }}>
          <m.div className="hero-logo" data-alvo-logo style={reduced ? undefined : { rotateX: rotX, rotateY: rotY }}>
            <picture>
              <source type="image/avif" srcSet={LOGO.avif} sizes={TAMANHOS_LOGO} />
              <img className={`hero-logo-img ${pronto || reduced ? 'is-visivel' : ''}`} src={LOGO.src} srcSet={LOGO.webp} sizes={TAMANHOS_LOGO} width={LOGO.largura} height={LOGO.altura}
                alt={`Logotipo do ${SITE.nome}`} fetchPriority="high" decoding="async" />
            </picture>
          </m.div>
        </m.div>
      </div>}
    </div>

    <m.p className="hero-rodape" {...surge(.75)}><MapPin aria-hidden="true" strokeWidth={2} />{ENDERECO_LINHA}</m.p>
  </section>
}
