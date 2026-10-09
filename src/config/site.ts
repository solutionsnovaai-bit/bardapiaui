/*
  Dados do bar. Tudo o que muda (telefone, endereço, Instagram, preço da dose) fica aqui.
*/

export const SITE = {
  nome: 'Bar e mercearia da Piauí',
  nomeCurto: 'Bar da Piauí',
  /** WhatsApp com 55 + DDD + número (só números). */
  whatsapp: '5511917401442',
  whatsappExibicao: '(11) 91740-1442',
  /** Perfil do Instagram (sem @). Deixe vazio para esconder o link. */
  instagram: 'barpiaui_',
  endereco: {
    rua: 'Rua Ilha dos Pássaros, 53',
    bairro: 'Jardim Indaiá',
    regiao: 'Itaim Paulista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '08141-160',
  },
  /** Preço da dose de cachaça raiz, como está na plaquinha do bar. */
  doseRaiz: '4,00',
} as const

export const ENDERECO_LINHA = `${SITE.endereco.rua}, ${SITE.endereco.regiao}`
export const ENDERECO_COMPLETO = `${SITE.endereco.rua}, ${SITE.endereco.bairro}, ${SITE.endereco.regiao}, ${SITE.endereco.cidade} - ${SITE.endereco.uf}, ${SITE.endereco.cep}`
export const INSTAGRAM_URL = SITE.instagram ? `https://www.instagram.com/${SITE.instagram}/` : ''

export const SEO = {
  titulo: 'Bar e mercearia da Piauí | Cachaça raiz, salgados e cerveja gelada no Itaim Paulista',
  descricao:
    'Boteco de bairro no Itaim Paulista: cachaça raiz curtida na casa, coxinha e pastel saindo quente, cerveja gelada e mercearia. Rua Ilha dos Pássaros, 53.',
  compartilharTitulo: 'Bar e mercearia da Piauí',
  compartilharTexto: 'Cachaça raiz, salgado quente e cerveja trincando. Rua Ilha dos Pássaros, 53, Itaim Paulista.',
  imagemAlt: 'Logotipo do Bar e mercearia da Piauí: uma taça de cerveja entre ramos de trigo.',
  corTema: '#17120E',
  corFundo: '#EDE8DF',
} as const

/** Mensagens prontas do WhatsApp, uma para cada botão do site. */
export const MENSAGENS = {
  padrao: 'Oi! Vim pelo site do Bar da Piauí.',
  raiz: 'Oi! Vim pelo site e queria saber quais cachaças raiz tem hoje.',
  gelada: 'Oi! Vim pelo site. Quero saber das bebidas geladas.',
  cozinha: 'Oi! Vim pelo site. Tem salgado saindo agora?',
  caminho: 'Oi! Vim pelo site e tô indo aí no bar.',
} as const
