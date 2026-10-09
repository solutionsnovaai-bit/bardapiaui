/*
  Imagens fixas do site (logotipo, taça, fotos do bar).
  Todas em AVIF com reserva em WebP, servidas pelo próprio site.
*/

/** Logotipo recortado (fundo transparente), em 640 e 1100 px. */
export const LOGO = {
  avif: '/marca/logo-640.avif 640w, /marca/logo.avif 1100w',
  webp: '/marca/logo-640.webp 640w, /marca/logo.webp 1100w',
  src: '/marca/logo.webp', largura: 1100, altura: 1100,
}

/** Tamanho do logotipo na tela (igual ao do topo; a abertura usa o mesmo, para o voo ficar nítido). */
export const TAMANHOS_LOGO = '(min-width: 1024px) min(80vh, 46vw), (min-width: 768px) min(44vh, 70vw), min(86vw, 45vh)'

/** Só a cerveja de dentro da taça (para a taça encher na abertura). Posição em % do logotipo. */
export const CERVEJA = {
  avif: '/marca/cerveja.avif', webp: '/marca/cerveja.webp', largura: 212, altura: 337,
  caixa: { x: (520 / 1254) * 100, y: (413 / 1254) * 100, w: (212 / 1254) * 100, h: (337 / 1254) * 100 },
}

/** A taça sozinha, para o cabeçalho. */
export const TACA = { webp: '/marca/taca.webp', largura: 107, altura: 180 }

export const PRATELEIRA = {
  avif: '/fotos/prateleira-1000.avif 1000w, /fotos/prateleira.avif 2000w',
  webp: '/fotos/prateleira-1000.webp 1000w, /fotos/prateleira.webp 2000w',
  src: '/fotos/prateleira.webp', largura: 2000, altura: 1398,
}
export const GARRAFAS = { avif: '/fotos/garrafas.avif', webp: '/fotos/garrafas.webp', largura: 1200, altura: 1600 }

/**
 * Arte do topo gerada à parte (opcional). Quando existir, salve em public/hero/ e preencha aqui:
 * { desktop: '/hero/hero-desktop.webp', mobile: '/hero/hero-mobile.webp' }.
 * Com a arte, o topo mostra a imagem inteira de fundo (o logotipo já está nela) e o texto por cima.
 */
export const HERO_ARTE: { desktop: string; mobile: string } | null = null
