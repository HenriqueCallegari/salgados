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

const FALLBACK_IMG = 'https://images.pexels.com/photos/33846217/pexels-photo-33846217.jpeg?auto=compress&cs=tinysrgb&w=800';
const WHATSAPP = '5511983837001';
