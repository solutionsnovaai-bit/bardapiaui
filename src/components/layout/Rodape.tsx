import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { NAV, RODAPE } from '../../content/textos'
import { ENDERECO_COMPLETO, INSTAGRAM_URL, MENSAGENS, SITE } from '../../config/site'
import { LOGO } from '../../config/imagens'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import BrandIcon from '../ui/BrandIcon'

/** Rodapé: o brinde escrito à mão correndo com a rolagem, o logotipo numa plaquinha e os contatos. */
export default function Rodape() {
  const { reduced, paused, toggle } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['18%', '-6%'])
  const giro = useTransform(scrollYProgress, [0, 1], [-9, -4])

  return <footer ref={ref} className="rodape tema-escuro">
    <div className="rodape-brinde-faixa" aria-hidden="true">
      <m.p className="rodape-brinde mao" style={reduced ? undefined : { x, rotate: giro }}>{RODAPE.brinde}</m.p>
    </div>
    <div className="conteiner rodape-grade">
      <div className="rodape-marca">
        <span className="rodape-placa">
          <picture>
            <source type="image/avif" srcSet={LOGO.avif} sizes="230px" />
            <img src={LOGO.src} srcSet={LOGO.webp} sizes="230px" width={LOGO.largura} height={LOGO.altura} alt={`Logotipo do ${SITE.nome}`} loading="lazy" decoding="async" />
          </picture>
        </span>
      </div>
      <div className="rodape-col">
        <p className="rodape-titulo">Endereço</p>
        <address>{ENDERECO_COMPLETO}</address>
      </div>
      <div className="rodape-col">
        <p className="rodape-titulo">Contato</p>
        <a href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer"><BrandIcon brand="whatsapp" />{SITE.whatsappExibicao}</a>
        {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><BrandIcon brand="instagram" />@{SITE.instagram}</a>}
      </div>
      <nav className="rodape-col" aria-label="Seções do site">
        <p className="rodape-titulo">No site</p>
        {NAV.map(n => <a key={n.href} href={n.href}>{n.rotulo}</a>)}
      </nav>
    </div>
    <div className="conteiner rodape-base">
      <p className="rodape-aviso">{RODAPE.aviso}</p>
      <p>© {new Date().getFullYear()} {SITE.nome}</p>
      <button type="button" className="rodape-pausa" onClick={toggle} aria-pressed={paused}>
        {paused ? <Play aria-hidden="true" strokeWidth={2} /> : <Pause aria-hidden="true" strokeWidth={2} />}
        {paused ? 'Ligar movimento' : 'Pausar movimento'}
      </button>
    </div>
  </footer>
}
