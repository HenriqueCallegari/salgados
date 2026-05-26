<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:f97316,100:dc2626&height=200&section=header&text=Salgadinho%26Cia&fontSize=58&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Salgados%20artesanais%20fresquinhos&descAlignY=60&descSize=18" alt="header" />

<br />

<a href="https://salgados-e3ii.onrender.com">
  <img src="https://custom-icon-badges.demolab.com/badge/-Ver%20site-2ea44f?style=for-the-badge&logo=rocket&logoColor=white" alt="demo" />
</a>
<a href="https://github.com/HenriqueCallegari/salgados/stargazers">
  <img src="https://custom-icon-badges.demolab.com/github/stars/HenriqueCallegari/salgados?style=for-the-badge&logo=star&color=f1c40f&logoColor=white&labelColor=2c2f33" alt="Stars" />
</a>
<a href="https://github.com/HenriqueCallegari/salgados/commits/master">
  <img src="https://custom-icon-badges.demolab.com/github/last-commit/HenriqueCallegari/salgados?style=for-the-badge&logo=history&color=ef4444&logoColor=white&labelColor=2c2f33" alt="Last commit" />
</a>

</div>

---

## Sobre o projeto

**Salgadinho&Cia** é uma página de vendas (landing page) feita pra uma marca de salgados artesanais.

A ideia é simples: o cliente entra no site pelo celular, vê os salgados disponíveis, os combos em destaque, e fecha o pedido direto pelo WhatsApp. Sem cadastro, sem carrinho complicado — só clicar e pedir.

> Pensado pra **converter rápido**: cliente com fome não tem paciência pra interface confusa.

### O que o cliente faz

1. Abre o site pelo celular ou computador
2. Vê o cardápio organizado com fotos e preços
3. Escolhe o salgado ou combo
4. Clica em "Pedir agora" → abre o WhatsApp já com a mensagem pronta
5. Confirma com o atendente e pronto

<br />

## Stack

<div align="center">

<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=html,css,js&theme=dark" alt="stack" />
</a>

</div>

| O que | Função |
|---|---|
| **HTML5** | Estrutura da página (cardápio, combos, depoimentos) |
| **CSS3** | Visual — paleta laranja/vermelho que dá fome, layout que funciona em qualquer tela |
| **JavaScript** | Modal de detalhe do produto, geração da mensagem do WhatsApp, animações leves |
| **Render** | Onde o site fica hospedado (serviço gratuito de deploy) |

<br />

## Live demo

🔗 **https://salgados-e3ii.onrender.com**

<br />

## Como rodar localmente

```bash
# 1. Baixa o projeto
git clone https://github.com/HenriqueCallegari/salgados.git
cd salgados

# 2. Sobe um servidor local simples
python -m http.server 8000
```

Abre **http://localhost:8000** no navegador.

<br />

## Estrutura

```
salgados/
├── index.html          # A página inteira (uma única página, scroll vertical)
├── css/                # Estilos: cores, fontes, layout responsivo
└── js/                 # Lógica do modal de produto e integração WhatsApp
```

<br />

## O que tem na página

- **Hero** — banner com chamada principal e botão de pedido
- **Catálogo** — grade de salgados com foto, nome e preço
- **Combos** — pacotes em destaque com preço promocional
- **Depoimentos** — avaliações de clientes pra dar credibilidade
- **CTA final** — última chamada pra fechar o pedido
- **Modal** — clica num salgado e abre uma janela com mais detalhes
- **Responsivo** — funciona igual em celular, tablet e desktop

<br />

## Possíveis evoluções

- [ ] Carrinho de compras de verdade (não só link de WhatsApp)
- [ ] Painel admin pra cadastrar salgados sem mexer no código
- [ ] Pagamento online (Pix, cartão)
- [ ] Sistema de fidelidade
- [ ] Cardápio dinâmico vindo de banco de dados

<br />

## Autor

<div align="center">

**Henrique Callegari**

<a href="https://github.com/HenriqueCallegari">
  <img src="https://custom-icon-badges.demolab.com/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
<a href="https://www.linkedin.com/in/henrique-callegari-/">
  <img src="https://custom-icon-badges.demolab.com/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>

</div>

<br />

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:dc2626,100:f97316&height=100&section=footer" alt="footer" />

</div>
