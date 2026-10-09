# Bar e mercearia da Piauí

Site de uma página do Bar e mercearia da Piauí (Rua Ilha dos Pássaros, 53, Itaim Paulista, São Paulo).

React 19, TypeScript 5.9, Vite 6.4, Tailwind 4.3, Motion 12 e Lenis 1.3 (versões fixas no package.json).
Fontes Archivo (variável, com largura de 62 a 125%) e Permanent Marker, servidas pelo próprio site.
Imagens em AVIF com reserva em WebP. Sem dependência de serviço externo.

Lighthouse (build local): computador 100 · 100 · 100 · 100; celular 87 · 100 · 100 · 100
(desempenho · acessibilidade · boas práticas · SEO). No celular, o LCP é a cerveja da taça na abertura, de propósito.

## Rodar

Requisito: Node.js 20 ou superior.

```bash
npm ci
npm run dev      # http://localhost:4173
npm run build    # gera a pasta dist/
npm run check    # confere os tipos (opcional)
```

## Publicar na Vercel

Importe o repositório na Vercel. Framework: Vite. Build: `npm run build`. Saída: `dist`.
Não precisa de variável de ambiente. Com domínio próprio, defina `VITE_SITE_URL`
(ex.: `https://bardapiaui.com.br`) nas variáveis do projeto e publique de novo.

## Onde mudar cada coisa

| O quê | Arquivo |
| --- | --- |
| WhatsApp, Instagram, endereço, preço da dose de raiz | `src/config/site.ts` |
| Mensagens prontas do WhatsApp | `src/config/site.ts` (`MENSAGENS`) |
| Textos de todas as seções | `src/content/textos.ts` |
| Sabores da prateleira, fotos da cozinha, bebidas e cardápio | `src/content/cardapio.ts` |
| Cores e fontes | `src/styles/tema.css` |

Todos os botões abrem o WhatsApp com uma mensagem pronta do contexto (cachaça, bebidas, cozinha, como chegar).

## O que tem no site

Abertura (peça de motion) → topo com o logotipo → fitas cruzadas → cachaça raiz → gelada (a garrafa abre) e
carrossel de bebidas → cozinha e carrossel de salgados → onde fica → rodapé. Balão do WhatsApp sempre visível.

**Abertura**: no escuro, um traço cor de palha desenha o logotipo, da taça para fora; a taça enche de cerveja
conforme o site carrega (é a barra de carregamento); a luz abre a partir da taça e revela o logotipo de verdade,
que voa até o lugar dele no topo. Na 1ª visita dura cerca de 4 s; ao voltar na mesma sessão, uma versão curta;
com "reduzir movimento" ligado no aparelho, não há abertura.

**Topo**: o logotipo como uma placa na parede caiada, que inclina de leve com o mouse, e a plaquinha amarela
"Raiz 4,00" escrita à mão ao lado do letreiro.

**Fitas cruzadas**: duas faixas (como a do logotipo) que correm sozinhas, aceleram com a rolagem e invertem o
sentido quando a pessoa rola para cima.

**Cachaça raiz**: a foto da prateleira abre como cortina, com a plaquinha de preço circulada à caneta. Embaixo,
a lista de sabores: ao tocar num nome, a foto das garrafas dá zoom na garrafa daquele sabor (e passeia sozinha
enquanto ninguém mexe).

**Gelada**: com a rolagem, a tampinha treme, estoura e voa, o gás sai, a espuma sobe e a cerveja enche a tela,
trocando a cor do letreiro por onde passa. Depois vem o carrossel de bebidas.

**Carrosséis** (bebidas e cozinha): andam sozinhos, devagar e sem fim; param com o mouse em cima, com o foco do
teclado e no botão "Pausar"; dá para arrastar com o mouse e com o dedo, com inércia. Cada foto só é baixada
quando chega perto da tela.

**Balão do WhatsApp**: nunca some. A velocidade da rolagem puxa o balão por uma mola amortecida; ao parar,
ele volta com um leve quique. Sobre as seções escuras, fica amarelo.

O rodapé tem o aviso de venda proibida para menores de 18 anos e o botão "Pausar movimento".

## Incluir ou trocar fotos

Fotos da cozinha ficam em `public/fotos/` e as de bebidas em `public/bebidas/`, sempre em dois arquivos com o
mesmo nome: `.avif` e `.webp` (ex.: `public/fotos/coxinhas.avif` e `public/fotos/coxinhas.webp`).
Depois, acrescente um item na lista certa em `src/content/cardapio.ts` com o caminho sem extensão, o tamanho
em pixels e uma descrição curta da foto. Um item sem `foto` aparece como um cartão escrito à mão, para ir
colocando o prato antes de ter a imagem.

## Arte do topo (opcional)

Se quiser usar uma arte pronta no topo (com o logotipo já aplicado na cena), salve os arquivos em `public/hero/`
(`hero-desktop.webp`, 16:9, e `hero-mobile.webp`, 9:16) e preencha `HERO_ARTE` em `src/config/imagens.ts`.
Na versão de computador, deixe o lado esquerdo da arte livre para o texto; na de celular, a parte de baixo.

## Arquivos

Menos de 100 arquivos no total (sem contar `node_modules` e `dist`).
