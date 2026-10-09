/*
  O que aparece nos carrosséis e listas.
  Fotos ficam em public/fotos (cozinha) e public/bebidas, em AVIF e WebP com o mesmo nome.
  Para incluir uma foto: salve os dois arquivos e acrescente um item na lista.
  Um item sem foto vira um cartão escrito à mão (bom para ir colocando antes de ter a foto).
*/

export type ItemFoto = {
  nome: string
  /** Caminho sem extensão, ex.: '/fotos/coxinhas'. Sem foto, o cartão sai escrito à mão. */
  foto?: string
  alt: string
  /** Tamanho real da foto, para reservar o espaço. */
  w?: number
  h?: number
}

/** Sabores com garrafa visível na foto de perto (x e y em % da foto, para a lupa). */
export const SABORES = [
  { nome: 'Para tudo', x: 11, y: 42 },
  { nome: 'Alho com mel', x: 53, y: 41 },
  { nome: 'Pau de rato', x: 72, y: 41 },
  { nome: 'Aroeira', x: 38, y: 84 },
  { nome: 'Ciriguela', x: 79, y: 84 },
] as const

export const COZINHA_FOTOS: ItemFoto[] = [
  { nome: 'Coxinha', foto: '/fotos/coxinhas', w: 900, h: 1200, alt: 'Prato de coxinhas douradas sobre papel-toalha, ainda soltando vapor.' },
  { nome: 'Pastel e salgados', foto: '/fotos/mix-pastel', w: 900, h: 1200, alt: 'Travessa com pastéis, coxinhas e salgados fritos.' },
  { nome: 'Tábua de frios', foto: '/fotos/frios', w: 900, h: 1200, alt: 'Tábua de madeira com salame fatiado, cubos de queijo, presunto e azeitonas.' },
  { nome: 'Salgados da casa', foto: '/fotos/mix', w: 900, h: 1200, alt: 'Prato amarelo com salgados fritos variados.' },
  { nome: 'Pastel na travessa', foto: '/fotos/dupla', w: 900, h: 1200, alt: 'Dois pratos: um de salgados e outro com pastéis enfileirados.' },
  { nome: 'Pra beliscar', foto: '/fotos/cima', w: 900, h: 1200, alt: 'Salgados vistos de cima, num prato amarelo com papel-toalha.' },
]

export const CARDAPIO = [
  { grupo: 'Salgados', itens: ['Coxinha', 'Pastel', 'Salgados fritos na hora'] },
  { grupo: 'Pra dividir', itens: ['Tábua de frios', 'Porções', 'Cachorro-quente'] },
] as const

export const BEBIDAS: ItemFoto[] = [
  { nome: 'Heineken', foto: '/bebidas/heineken', w: 720, h: 816, alt: 'Duas long necks de Heineken geladas.' },
  { nome: 'Antarctica Subzero', foto: '/bebidas/subzero', w: 720, h: 816, alt: 'Lata de Antarctica Subzero na geladeira.' },
  { nome: 'Caipirinha', foto: '/bebidas/caipirinha', w: 720, h: 816, alt: 'Copo de caipirinha verde com canudos.' },
  { nome: 'Skol', foto: '/bebidas/skol', w: 720, h: 816, alt: 'Lata de Skol na geladeira.' },
  { nome: 'Whisky e energético', foto: '/bebidas/whisky', w: 720, h: 816, alt: 'Garrafas de whisky e vodca com uma lata de energético.' },
  { nome: 'Itaipava', foto: '/bebidas/itaipava', w: 720, h: 816, alt: 'Lata de Itaipava na geladeira.' },
  { nome: 'Raspadinha de uva', foto: '/bebidas/raspadinha', w: 720, h: 816, alt: 'Copo de raspadinha de uva sobre a mesa de sinuca.' },
  { nome: 'Império', foto: '/bebidas/imperio', w: 720, h: 816, alt: 'Lata de cerveja Império na geladeira.' },
]
