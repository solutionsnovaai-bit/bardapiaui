import { m } from 'motion/react'
import { MapPin } from 'lucide-react'
import { ONDE } from '../../content/textos'
import { INSTAGRAM_URL, MENSAGENS, SITE } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { linkMapa } from '../../lib/mapa'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import BrandIcon from '../ui/BrandIcon'
import { Botao } from '../ui/Botao'
import Revelar, { Titulo } from '../ui/Revelar'

/** Placa de rua no padrão de São Paulo (azul, letra branca), que cai e balança ao entrar na tela. */
function Placa() {
  const { reduced } = useMotionPreferences()
  const e = SITE.endereco
  const rua = e.rua.replace(/^Rua /, 'R. ').replace(/, \d+$/, '')
  const numero = e.rua.match(/(\d+)$/)?.[1] ?? ''
  return <div className="placa-area" aria-hidden="true">
    <m.div className="placa"
      initial={reduced ? false : { rotateX: -95, opacity: 0 }}
      whileInView={{ rotateX: 0, opacity: 1 }}
      viewport={{ once: true, amount: .6 }}
      transition={{ type: 'spring', stiffness: 70, damping: 7, mass: 1.1 }}>
      <span className="placa-bairro">{e.regiao}</span>
      <span className="placa-rua">{rua}</span>
      <span className="placa-cep">CEP {e.cep}</span>
    </m.div>
    <m.div className="placa-numero"
      initial={reduced ? false : { rotate: 22, y: -40, opacity: 0 }}
      whileInView={{ rotate: -4, y: 0, opacity: 1 }}
      viewport={{ once: true, amount: .6 }}
      transition={{ type: 'spring', stiffness: 120, damping: 8, delay: .5 }}>
      {numero}
    </m.div>
  </div>
}

export default function OndeFica() {
  const e = SITE.endereco
  return <section id="onde-fica" className="onde secao cal" aria-labelledby="onde-titulo">
    <div className="conteiner onde-grade">
      <Placa />
      <div className="onde-texto">
        <Titulo id="onde-titulo" className="titulo" linhas={ONDE.titulo} />
        <Revelar delay={.08}>
          <address className="onde-endereco">
            <span>{e.rua}</span>
            <span>{e.bairro}, {e.regiao}</span>
            <span>{e.cidade} - {e.uf}, CEP {e.cep}</span>
          </address>
        </Revelar>
        <Revelar delay={.12}><p className="lead">{ONDE.texto}</p></Revelar>
        <Revelar delay={.16} className="onde-acoes">
          <Botao href={linkMapa} icone={<MapPin strokeWidth={2.2} />} rotuloAcessivel={`${ONDE.mapa} (abre em nova aba)`}>{ONDE.mapa}</Botao>
          <Botao href={waLink(MENSAGENS.caminho)} variante="estrela" rotuloAcessivel={`${ONDE.whatsapp} (abre em nova aba)`}>{ONDE.whatsapp}</Botao>
        </Revelar>
        <Revelar delay={.2} className="onde-contatos">
          <a href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer" className="link-linha"><BrandIcon brand="whatsapp" />{SITE.whatsappExibicao}</a>
          {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-linha"><BrandIcon brand="instagram" />@{SITE.instagram}</a>}
        </Revelar>
        <Revelar delay={.24}><p className="onde-mercearia mao">{ONDE.mercearia}</p></Revelar>
      </div>
    </div>
  </section>
}
