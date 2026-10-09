import { COZINHA } from '../../content/textos'
import { CARDAPIO, COZINHA_FOTOS } from '../../content/cardapio'
import { MENSAGENS } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { Botao } from '../ui/Botao'
import Carrossel from '../ui/Carrossel'
import Revelar, { Titulo } from '../ui/Revelar'

/** Fumacinha subindo, como a das fotos (traços que desenham e somem em loop). */
function Vapor() {
  return <svg className="vapor anima-continua" viewBox="0 0 120 200" aria-hidden="true">
    <path d="M30 196C10 160 52 140 32 104C14 72 46 52 34 10" />
    <path d="M62 196C44 164 84 140 64 100C46 64 78 44 66 6" />
    <path d="M94 196C76 160 112 138 96 104C80 72 108 50 98 14" />
  </svg>
}

/** Cozinha: fundo preto como o das fotos, para os salgados "saírem" da tela. */
export default function Cozinha() {
  return <section id="cozinha" className="cozinha secao tema-noite" aria-labelledby="cozinha-titulo">
    <div className="conteiner cozinha-cabeca">
      <div className="cozinha-titulo-col">
        <Vapor />
        <Titulo id="cozinha-titulo" className="titulo" linhas={COZINHA.titulo} />
      </div>
      <Revelar delay={.1} className="cozinha-lead-col"><p className="lead">{COZINHA.texto}</p></Revelar>
    </div>

    <Carrossel itens={COZINHA_FOTOS} rotulo="Fotos da cozinha" className="car-cozinha" velocidade={-38}
      sizes="(max-width: 767px) 72vw, (max-width: 1023px) 340px, 420px" />

    <div className="conteiner cozinha-cardapio">
      <Revelar><h3 className="titulo-m">{COZINHA.cardapioTitulo}</h3></Revelar>
      <div className="cozinha-grupos">
        {CARDAPIO.map((g, gi) => <Revelar key={g.grupo} delay={.06 + gi * .08} className="cozinha-grupo">
          <p className="cozinha-grupo-nome mao">{g.grupo}</p>
          <ul>{g.itens.map(it => <li key={it}>{it}</li>)}</ul>
        </Revelar>)}
      </div>
      <Revelar delay={.2} className="cozinha-cta">
        <Botao href={waLink(MENSAGENS.cozinha)} variante="estrela" rotuloAcessivel={`${COZINHA.cta} pelo WhatsApp (abre em nova aba)`}>{COZINHA.cta}</Botao>
      </Revelar>
    </div>
  </section>
}
