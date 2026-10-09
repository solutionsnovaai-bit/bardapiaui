import { useCallback, useEffect, useState } from 'react'
import { MotionPreferencesProvider } from './hooks/useMotionPreferences'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Abertura, { modoAbertura } from './components/abertura/Abertura'
import Topo from './components/layout/Topo'
import Rodape from './components/layout/Rodape'
import WhatsAppFab from './components/layout/WhatsAppFab'
import DadosEstruturados from './components/layout/DadosEstruturados'
import Hero from './components/secoes/Hero'
import type { Fase } from './components/secoes/Hero'
import Faixas from './components/secoes/Faixas'
import Raiz from './components/secoes/Raiz'
import Gelada from './components/secoes/Gelada'
import Cozinha from './components/secoes/Cozinha'
import OndeFica from './components/secoes/OndeFica'

function Site() {
  const [fase, setFase] = useState<Fase>(() => (modoAbertura() === 'nenhuma' ? 'pronto' : 'abertura'))
  const saida = useCallback(() => setFase(f => (f === 'abertura' ? 'saida' : f)), [])
  const fim = useCallback(() => setFase('pronto'), [])
  const pronto = fase === 'pronto'
  useSmoothScroll(pronto)

  /* Durante a abertura a página fica parada no topo; depois, se veio com #âncora, vai até ela. */
  useEffect(() => {
    if (pronto) {
      document.documentElement.classList.remove('travado')
      const alvo = location.hash && document.querySelector(location.hash)
      if (alvo) window.setTimeout(() => alvo.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250)
      return
    }
    window.scrollTo(0, 0)
    document.documentElement.classList.add('travado')
  }, [pronto])

  return <>
    <a className="pular-link" href="#conteudo">Pular para o conteúdo</a>
    {!pronto && <Abertura onSaida={saida} onFim={fim} />}
    <Topo visivel={fase !== 'abertura'} />
    <main id="conteudo">
      <Hero fase={fase} />
      <Faixas />
      <Raiz />
      <Gelada />
      <Cozinha />
      <OndeFica />
    </main>
    <Rodape />
    <WhatsAppFab liberado={fase !== 'abertura'} />
    <DadosEstruturados />
  </>
}

export default function App() {
  return <MotionPreferencesProvider><Site /></MotionPreferencesProvider>
}
