import { SEO, SITE, INSTAGRAM_URL } from '../../config/site'
import { temWhatsApp } from '../../lib/whatsapp'

/** Dados para o Google entender o negócio (bar com mercearia). */
export default function DadosEstruturados() {
  const e = SITE.endereco
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: SITE.nome,
    alternateName: SITE.nomeCurto,
    description: SEO.descricao,
    url: `${__SITE_ORIGIN__}/`,
    image: `${__SITE_ORIGIN__}/og.jpg`,
    logo: `${__SITE_ORIGIN__}/icon-512.png`,
    servesCuisine: ['Petiscos', 'Salgados'],
    address: {
      '@type': 'PostalAddress', streetAddress: e.rua, addressLocality: e.cidade, addressRegion: e.uf, addressCountry: 'BR', postalCode: e.cep,
    },
  }
  if (temWhatsApp) dados.telephone = `+${SITE.whatsapp.replace(/\D/g, '')}`
  if (INSTAGRAM_URL) dados.sameAs = [INSTAGRAM_URL]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }} />
}
