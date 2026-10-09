/*
  Textos do site. Para mudar uma frase, mexa só aqui.
*/
import { SITE } from '../config/site'

export const NAV = [
  { href: '#raiz', rotulo: 'Cachaça raiz' },
  { href: '#gelada', rotulo: 'Gelada' },
  { href: '#cozinha', rotulo: 'Cozinha' },
  { href: '#onde-fica', rotulo: 'Onde fica' },
] as const

export const HERO = {
  titulo: ['Cachaça raiz,', 'salgado quente,', 'cerveja', 'trincando.'],
  texto: 'Boteco de bairro com prateleira de cachaça curtida na casa, cozinha de salgado e mercearia. No Itaim Paulista, Zona Leste de São Paulo.',
  cta: 'Chamar no WhatsApp',
  ctaCurto: 'Chamar no WhatsApp',
  link: 'Ver a prateleira',
  estrela: { linha1: 'Raiz', linha2: SITE.doseRaiz },
}

export const FAIXAS = {
  clara: ['Cachaça raiz', 'Coxinha', 'Pastel', 'Cerveja gelada', 'Tábua de frios', 'Porções', 'Mercearia'],
  ambar: ['Dose de raiz a R$ ' + SITE.doseRaiz, 'Salgado na hora', 'Gelada de verdade', 'Rua Ilha dos Pássaros, 53', 'Itaim Paulista'],
} as const

export const RAIZ = {
  titulo: ['Cachaça raiz,', 'curtida na casa.'],
  texto:
    'Cada garrafa da prateleira leva o rótulo da casa e uma infusão diferente: casca, raiz, fruta, erva. É só escolher o sabor e pedir a dose.',
  anotacao: `dose de raiz: R$ ${SITE.doseRaiz}`,
  fotoAlt: 'Parede do bar com quatro prateleiras de garrafas de cachaça artesanal, todas com o rótulo do Bar e mercearia da Piauí, e a plaquinha amarela “Raiz 4,00”.',
  saboresTitulo: 'Escolha o sabor',
  saboresDica: 'Toque num nome para ver a garrafa.',
  tambem: 'Na prateleira também tem catuaba, carqueja, emburana, gengibre com mel e limão e outras.',
  torneira: 'Nos garrafões de torneira: Rei do Cambuci, Canelinha e Jabuticaba.',
  cta: 'Perguntar o que tem hoje',
  closeAlt: 'Garrafas de cachaça artesanal com o rótulo do bar, de perto.',
}

export const GELADA = {
  titulo: ['Gelada', 'de verdade.'],
  texto: 'Lata, long neck e garrafa trincando, dose de whisky, caipirinha e raspadinha.',
  carrosselTitulo: 'Do freezer pra mesa.',
  cta: 'Perguntar o que tem gelado',
}

export const COZINHA = {
  titulo: ['Salgado', 'saindo quente.'],
  texto: 'Coxinha, pastel e salgado frito na hora. Tábua de frios pra dividir e porção pra mesa toda.',
  cardapioTitulo: 'O que sai da cozinha',
  cta: 'Ver se tem salgado agora',
}

export const ONDE = {
  titulo: ['Passa', 'aqui.'],
  texto: 'Fica no Jardim Indaiá, no Itaim Paulista, Zona Leste de São Paulo. Chama no WhatsApp para saber se está aberto ou o que tem hoje.',
  mercearia: 'E é mercearia também: deu falta de alguma coisa em casa, resolve aqui mesmo.',
  mapa: 'Abrir no mapa',
  whatsapp: 'Chamar no WhatsApp',
}

export const RODAPE = {
  brinde: 'Saúde!',
  aviso: 'Venda de bebida alcoólica proibida para menores de 18 anos. Se beber, não dirija.',
}
