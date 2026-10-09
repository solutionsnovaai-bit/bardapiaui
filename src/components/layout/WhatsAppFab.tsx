import { useEffect, useRef, useState } from 'react'
import { MENSAGENS, SITE } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import BrandIcon from '../ui/BrandIcon'

/*
  Balão do WhatsApp. Fica sempre na tela (nunca some).
  Física: a velocidade da rolagem puxa o balão por uma mola amortecida; ao parar, ele volta
  com um leve quique, inclinando e esticando conforme a velocidade. Sobre seções escuras, fica amarelo-estrela.
*/
export default function WhatsAppFab({ liberado }: { liberado: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const caixa = useRef<HTMLDivElement>(null)
  const [dica, setDica] = useState(false)
  const [escuro, setEscuro] = useState(false)

  useEffect(() => {
    const el = ref.current, cx = caixa.current
    if (!el || !cx || !liberado) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ultimoY = window.scrollY, ultimoT = performance.now()
    let alvo = 0, pos = 0, vel = 0, raf = 0, parado = 0

    /* Cor conforme a seção que está atrás do balão. */
    let escuroAtual = false
    const verificaFundo = () => {
      const r = cx.getBoundingClientRect()
      const y = r.top + r.height / 2
      let e = false
      document.querySelectorAll<HTMLElement>('.tema-escuro, .tema-noite').forEach(s => {
        const b = s.getBoundingClientRect()
        if (b.top <= y && b.bottom >= y) e = true
      })
      if (e !== escuroAtual) { escuroAtual = e; setEscuro(e) }
    }

    const quadro = (agora: number) => {
      const dt = Math.min(2.5, (agora - ultimoT) / 16.667)
      ultimoT = agora
      alvo *= Math.pow(0.82, dt)
      /* mola: rigidez e amortecimento por quadro (60 fps) */
      const forca = (alvo - pos) * 0.12 - vel * 0.26
      vel += forca * dt
      pos += vel * dt
      const giro = Math.max(-14, Math.min(14, vel * 1.6))
      const estica = Math.min(.14, Math.abs(vel) / 38)
      el.style.transform = `translate3d(0, ${pos.toFixed(2)}px, 0) rotate(${giro.toFixed(2)}deg) scale(${(1 - estica * .6).toFixed(3)}, ${(1 + estica).toFixed(3)})`
      if (Math.abs(pos) < .05 && Math.abs(vel) < .05 && Math.abs(alvo) < .05) parado++; else parado = 0
      if (parado > 12) { el.style.transform = ''; raf = 0; return }
      raf = requestAnimationFrame(quadro)
    }
    const aoRolar = () => {
      const y = window.scrollY
      const d = y - ultimoY
      ultimoY = y
      verificaFundo()
      if (reduzir) return
      alvo = Math.max(-40, Math.min(40, alvo + d * .5))
      if (!raf) { parado = 0; ultimoT = performance.now(); raf = requestAnimationFrame(quadro) }
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', verificaFundo)
    verificaFundo()

    /* Dica aparece uma vez, depois de alguns segundos. */
    const t1 = window.setTimeout(() => setDica(true), 4000)
    const t2 = window.setTimeout(() => setDica(false), 9500)
    return () => {
      window.removeEventListener('scroll', aoRolar); window.removeEventListener('resize', verificaFundo)
      cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2)
    }
  }, [liberado])

  return <div ref={caixa} className={`fab ${liberado ? 'is-visivel' : ''} ${escuro ? 'sobre-escuro' : ''}`}>
    <span className={`fab-dica ${dica ? 'is-visivel' : ''}`} aria-hidden="true">Chama no WhatsApp</span>
    <a ref={ref} className="fab-botao" href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer"
      aria-label={`Chamar o ${SITE.nomeCurto} no WhatsApp (abre em nova aba)`}
      onMouseEnter={() => setDica(true)} onMouseLeave={() => setDica(false)} onFocus={() => setDica(true)} onBlur={() => setDica(false)}>
      <span className="fab-anel" aria-hidden="true" />
      <BrandIcon brand="whatsapp" />
    </a>
  </div>
}
