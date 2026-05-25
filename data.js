/* =========================================================
   Salgadinho&Cia — Dados (produtos, combos, configurações)
   ========================================================= */

const PRODUCTS = [
  {
    id: 'coxinha',
    name: 'Coxinha',
    price: 5.35,
    rating: 4.9,
    category: 'fritos',
    tags: ['top'],
    desc: 'Deliciosa coxinha de frango com catupiry, massa crocante e recheio cremoso. Feita na hora.',
    image: 'https://images.pexels.com/photos/19264384/pexels-photo-19264384.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'quibe',
    name: 'Quibe',
    price: 6.50,
    rating: 4.7,
    category: 'fritos',
    tags: [],
    desc: 'Quibe frito tradicional, feito com carne moída temperada e trigo fino. Sabor árabe autêntico.',
    image: 'https://images.pexels.com/photos/11842176/pexels-photo-11842176.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'esfiha',
    name: 'Esfiha',
    price: 4.50,
    rating: 4.8,
    category: 'assados',
    tags: ['assada'],
    desc: 'Esfiha aberta de carne com temperos árabes, assada no forno à lenha. Massa macia e saborosa.',
    image: 'https://images.pexels.com/photos/15899519/pexels-photo-15899519.png?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'pastel',
    name: 'Pastel',
    price: 7.50,
    rating: 4.6,
    category: 'fritos',
    tags: [],
    desc: 'Pastel crocante de queijo e presunto, frito na hora com massa fininha. Servido quentinho.',
    image: 'https://images.pexels.com/photos/6054485/pexels-photo-6054485.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'risoles',
    name: 'Risoles',
    price: 5.00,
    rating: 4.5,
    category: 'fritos',
    tags: [],
    desc: 'Risoles cremoso de queijo e presunto, empanado e frito até dourar. Clássico irresistível.',
    image: 'https://images.pexels.com/photos/37098037/pexels-photo-37098037.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'esfiha-queijo',
    name: 'Esfiha de Queijo',
    price: 4.50,
    rating: 4.7,
    category: 'assados',
    tags: ['vegetarianos'],
    desc: 'Esfiha aberta com queijo derretido, assada no forno à lenha. Opção vegetariana deliciosa.',
    image: 'https://images.pexels.com/photos/31300975/pexels-photo-31300975.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'enroladinho',
    name: 'Enroladinho de Salsicha',
    price: 4.80,
    rating: 4.6,
    category: 'assados',
    tags: [],
    desc: 'Massa folhada assada recheada com salsicha. Crocante por fora, suculento por dentro.',
    image: 'https://images.pexels.com/photos/10397836/pexels-photo-10397836.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'empada',
    name: 'Empada de Frango',
    price: 5.80,
    rating: 4.8,
    category: 'assados',
    tags: [],
    desc: 'Empada com massa amanteigada e recheio cremoso de frango com requeijão. Sabor de infância.',
    image: 'https://images.pexels.com/photos/8279711/pexels-photo-8279711.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

const COMBOS = [
  {
    id: 'combo-1',
    name: 'Combo Coxinha & Quibe',
    desc: '4 coxinhas + 4 quibes. Perfeito para petiscar.',
    oldPrice: 46,
    price: 38,
    discount: 17,
    image: 'https://images.pexels.com/photos/19740635/pexels-photo-19740635.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'combo-2',
    name: 'Combo Esfiha & Pastel',
    desc: '4 esfihas abertas + 4 pastéis crocantes.',
    oldPrice: 44,
    price: 36,
    discount: 18,
    image: 'https://images.pexels.com/photos/19964396/pexels-photo-19964396.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  },
  {
    id: 'combo-3',
    name: 'Combo Festa Completa',
    desc: '4 coxinhas, 4 quibes e 4 esfihas para a turma.',
    oldPrice: 64,
    price: 52,
    discount: 19,
    image: 'https://images.pexels.com/photos/25390057/pexels-photo-25390057.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const FALLBACK_IMG = 'https://images.pexels.com/photos/33846217/pexels-photo-33846217.jpeg?auto=compress&cs=tinysrgb&w=600';
const WHATSAPP = '5511983837001';
