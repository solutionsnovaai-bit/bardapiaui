import { SITE } from '../config/site'

const e = SITE.endereco
const busca = [e.rua, e.bairro, `${e.cidade} - ${e.uf}`, e.cep].filter(Boolean).join(', ')

/** Abre o endereço no Google Maps (no celular, abre o app). */
export const linkMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busca)}`
