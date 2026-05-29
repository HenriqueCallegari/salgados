/* =========================================================
   Salgadinho&Cia — Dados (produtos, combos, configurações)
   ========================================================= */

const PRODUCTS = [
  {
    id: 'coxinha',
    name: 'Coxinha',
    price: 5.35,
    rating: 4.9,
    reviews: 342,
    category: 'fritos',
    tags: ['top', 'bestseller'],
    weight: '80g',
    pieces: '1 unidade',
    desc: 'Coxinha artesanal de frango desfiado com catupiry cremoso, massa crocante por fora e recheio suculento. Fritura na hora.',
    short: 'Frango desfiado + catupiry',
    image: 'https://images.pexels.com/photos/19264384/pexels-photo-19264384.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'quibe',
    name: 'Quibe',
    price: 6.50,
    rating: 4.7,
    reviews: 198,
    category: 'fritos',
    tags: [],
    weight: '90g',
    pieces: '1 unidade',
    desc: 'Quibe frito tradicional com carne moída temperada, hortelã e trigo fino. Receita árabe autêntica passada de geração.',
    short: 'Carne + hortelã + trigo',
    image: 'https://images.pexels.com/photos/11842176/pexels-photo-11842176.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'esfiha',
    name: 'Esfiha de Carne',
    price: 4.50,
    rating: 4.8,
    reviews: 256,
    category: 'assados',
    tags: ['assada', 'bestseller'],
    weight: '70g',
    pieces: '1 unidade',
    desc: 'Esfiha aberta com carne moída temperada com cebola, limão e especiarias. Assada no forno à lenha em massa macia.',
    short: 'Carne + cebola + limão',
    image: 'https://images.pexels.com/photos/15899519/pexels-photo-15899519.png?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pastel',
    name: 'Pastel',
    price: 7.50,
    rating: 4.6,
    reviews: 187,
    category: 'fritos',
    tags: ['novo'],
    weight: '110g',
    pieces: '1 unidade grande',
    desc: 'Pastel crocante recém-saído do óleo, com massa fininha estaladiça e recheio generoso de queijo e presunto.',
    short: 'Queijo + presunto',
    image: 'https://images.pexels.com/photos/6054485/pexels-photo-6054485.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'risoles',
    name: 'Risoles',
    price: 5.00,
    rating: 4.5,
    reviews: 121,
    category: 'fritos',
    tags: [],
    weight: '75g',
    pieces: '1 unidade',
    desc: 'Risoles cremoso com recheio derretido de queijo e presunto, empanado em farinha panko e frito até dourar.',
    short: 'Queijo + presunto cremoso',
    image: 'https://images.pexels.com/photos/37098037/pexels-photo-37098037.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'esfiha-queijo',
    name: 'Esfiha de Queijo',
    price: 4.50,
    rating: 4.7,
    reviews: 143,
    category: 'assados',
    tags: ['vegetarianos', 'assada'],
    weight: '70g',
    pieces: '1 unidade',
    desc: 'Esfiha aberta vegetariana com mussarela e catupiry derretidos por cima, assada em forno à lenha.',
    short: 'Mussarela + catupiry',
    image: 'https://images.pexels.com/photos/31300975/pexels-photo-31300975.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'enroladinho',
    name: 'Enroladinho de Salsicha',
    price: 4.80,
    rating: 4.6,
    reviews: 98,
    category: 'assados',
    tags: [],
    weight: '85g',
    pieces: '1 unidade',
    desc: 'Massa folhada amanteigada assada enrolada em salsicha de primeira. Crocante por fora, suculento por dentro.',
    short: 'Massa folhada + salsicha',
    image: 'https://images.pexels.com/photos/10397836/pexels-photo-10397836.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'empada',
    name: 'Empada de Frango',
    price: 5.80,
    rating: 4.8,
    reviews: 167,
    category: 'assados',
    tags: ['bestseller'],
    weight: '95g',
    pieces: '1 unidade',
    desc: 'Empada de massa amanteigada com recheio cremoso de frango com requeijão, milho e ervas. Sabor da vovó.',
    short: 'Frango + requeijão + milho',
    image: 'https://images.pexels.com/photos/8279711/pexels-photo-8279711.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const COMBOS = [
  {
    id: 'combo-1',
    name: 'Combo Coxinha & Quibe',
    desc: '4 coxinhas + 4 quibes. Perfeito para petiscar em dupla.',
    pieces: '8 unidades',
    oldPrice: 46,
    price: 38,
    discount: 17,
    image: 'https://images.pexels.com/photos/19740635/pexels-photo-19740635.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 'combo-2',
    name: 'Combo Esfiha & Pastel',
    desc: '4 esfihas abertas + 4 pastéis crocantes recém-fritos.',
    pieces: '8 unidades',
    oldPrice: 44,
    price: 36,
    discount: 18,
    image: 'https://images.pexels.com/photos/19964396/pexels-photo-19964396.jpeg?auto=compress&cs=tinysrgb&w=900',
    featured: true
  },
  {
    id: 'combo-3',
    name: 'Combo Festa Completa',
    desc: '4 coxinhas, 4 quibes e 4 esfihas. Ideal para reunião de família.',
    pieces: '12 unidades',
    oldPrice: 64,
    price: 52,
    discount: 19,
    image: 'https://images.pexels.com/photos/25390057/pexels-photo-25390057.jpeg?auto=compress&cs=tinysrgb&w=900'
  }
];

/* =========================================================
   FESTA & CENTO — venda em volume (maior ticket do ramo)
   ========================================================= */
const FESTA = [
  {
    id: 'cento-tradicional',
    name: 'Cento Tradicional',
    qty: 100,
    price: 89.90,
    oldPrice: 135,
    type: 'pronto',
    desc: '100 salgados fritos na hora: coxinha, quibe, risole e enroladinho. Entregue quentinho.',
    image: 'https://images.pexels.com/photos/19740635/pexels-photo-19740635.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 'cento-premium',
    name: 'Cento Premium',
    qty: 100,
    price: 119.90,
    oldPrice: 165,
    type: 'pronto',
    featured: true,
    desc: '100 salgados premium variados: coxinha, esfiha, empada, pastel, quibe e risole.',
    image: 'https://images.pexels.com/photos/25390057/pexels-photo-25390057.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 'cento-congelado',
    name: 'Cento Congelado',
    qty: 100,
    price: 69.90,
    oldPrice: 99,
    type: 'congelado',
    desc: '100 salgados crus congelados. Guarde no freezer e frite na hora da fome. Rende muito.',
    image: 'https://images.pexels.com/photos/19964396/pexels-photo-19964396.jpeg?auto=compress&cs=tinysrgb&w=900'
  }
];

/* "Monte seu cento" — sabores e regra de preço por volume */
const KIT = {
  unitPrice: 1.19,          // preço por unidade no kit (bem menor que avulso)
  min: 50,                  // mínimo de unidades
  step: 25,                 // botão rápido de quantidade
  flavors: [
    { id: 'coxinha', name: 'Coxinha' },
    { id: 'quibe', name: 'Quibe' },
    { id: 'esfiha', name: 'Esfiha de Carne' },
    { id: 'esfiha-queijo', name: 'Esfiha de Queijo' },
    { id: 'risoles', name: 'Risoles' },
    { id: 'enroladinho', name: 'Enroladinho' },
    { id: 'empada', name: 'Empada de Frango' },
    { id: 'pastel', name: 'Pastel' }
  ]
};

/* =========================================================
   B2B — Salgados corporativos (coffee break, eventos, recorrente)
   ========================================================= */
const B2B = {
  whatsapp: '5511983837002',  // WhatsApp comercial (separado do varejo) — fictício
  benefits: [
    { icon: 'ti-file-invoice', title: 'Emitimos Nota Fiscal', text: 'Atendemos CNPJ com NF-e e faturamento para empresas.' },
    { icon: 'ti-calendar-repeat', title: 'Entrega recorrente', text: 'Coffee break semanal ou mensal no piloto automático.' },
    { icon: 'ti-discount-2', title: 'Preço por volume', text: 'Quanto maior o pedido, menor o preço por unidade.' },
    { icon: 'ti-clock-check', title: 'Pontualidade garantida', text: 'Chega no horário combinado, sempre quentinho e montado.' }
  ],
  plans: [
    {
      id: 'coffee',
      icon: 'ti-coffee',
      name: 'Coffee Break',
      tagline: 'Reuniões e treinamentos',
      from: 'a partir de R$ 12/pessoa',
      features: ['Salgados, doces e bebidas', 'Montagem no local (opcional)', 'A partir de 15 pessoas']
    },
    {
      id: 'eventos',
      icon: 'ti-confetti',
      name: 'Eventos & Confraternizações',
      tagline: 'Festas da empresa',
      from: 'orçamento sob medida',
      featured: true,
      features: ['Cardápio fechado por evento', 'Cento a partir de R$ 0,89/un', 'Atende de 50 a 1.000+ convidados']
    },
    {
      id: 'recorrente',
      icon: 'ti-building-store',
      name: 'Plano Recorrente',
      tagline: 'Escritórios e lojas',
      from: 'contrato mensal',
      features: ['Entrega fixa semanal/mensal', 'Faturamento mensal em NF', 'Preço travado por contrato']
    }
  ],
  clients: ['TechNova', 'Grupo Solare', 'Construtora Lima', 'Banco Vértice', 'Studio 9', 'Lopes & Advogados']
};

/* =========================================================
   CONFIG — entrega, pedido mínimo e cupons
   ========================================================= */
const CONFIG = {
  minOrder: 25,            // pedido mínimo (R$)
  deliveryFee: 8,          // taxa de entrega padrão (R$)
  freeDeliveryFrom: 60,    // frete grátis a partir de (R$)
  cutoffHour: 18           // horário de corte p/ entrega no mesmo dia
};

const COUPONS = {
  'BEMVINDO10': { type: 'percent', value: 10, minOrder: 30, desc: '10% de desconto na primeira compra' },
  'FESTA15':    { type: 'percent', value: 15, minOrder: 80, desc: '15% em pedidos de festa acima de R$ 80' },
  'FRETEZERO':  { type: 'free_ship', value: 0, minOrder: 35, desc: 'Frete grátis acima de R$ 35' }
};

const FALLBACK_IMG = 'https://images.pexels.com/photos/33846217/pexels-photo-33846217.jpeg?auto=compress&cs=tinysrgb&w=800';
const WHATSAPP = '5511983837001';
