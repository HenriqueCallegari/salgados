/* =========================================================
   Salgadinho&Cia — Lógica principal da aplicação
   ========================================================= */

/* ============ FORMATAÇÃO ============ */
const formatBRL = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

/* ============ ESTADO ============ */
let cart = JSON.parse(localStorage.getItem('salgadinho_cart') || '[]');
cart = cart.map((item) => {
  if (!item.image) {
    const found = PRODUCTS.find((p) => p.id === item.id) || COMBOS.find((c) => c.id === item.id);
    if (found) item.image = found.image;
  }
  return item;
}).filter((item) => item.image);

let favorites = JSON.parse(localStorage.getItem('salgadinho_favs') || '[]');
let currentFilter = 'todos';
let searchTerm = '';
let modalItem = null;
let modalQty = 1;
let payment = 'Pix';
let showAllMenu = false;
const INITIAL_MENU_LIMIT = 4;

/* ============ RENDER CARDÁPIO ============ */
function renderMenu() {
  const grid = document.getElementById('menu-grid');
  const moreWrap = document.getElementById('menu-more');
  const filtered = PRODUCTS.filter((p) => {
    const matchFilter =
      currentFilter === 'todos' ||
      p.category === currentFilter ||
      p.tags.includes(currentFilter);
    const matchSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-search-off"></i>
        <p>Nenhum salgado encontrado. Tente outro filtro ou busca.</p>
      </div>`;
    if (moreWrap) moreWrap.style.display = 'none';
    return;
  }

  /* Mostra apenas os primeiros N itens — exceto se o usuário expandiu,
     se há filtro ativo (≠ "todos"), ou se está buscando */
  const isBrowsing = currentFilter === 'todos' && !searchTerm;
  const visible = (showAllMenu || !isBrowsing)
    ? filtered
    : filtered.slice(0, INITIAL_MENU_LIMIT);

  if (moreWrap) {
    const hasMore = isBrowsing && filtered.length > INITIAL_MENU_LIMIT;
    moreWrap.style.display = hasMore ? 'flex' : 'none';
    const btn = document.getElementById('menu-more-btn');
    if (btn) {
      btn.innerHTML = showAllMenu
        ? '<i class="ti ti-chevron-up"></i> Ver menos'
        : `<i class="ti ti-chevron-down"></i> Ver mais salgados (${filtered.length - INITIAL_MENU_LIMIT})`;
    }
  }

  grid.innerHTML = visible.map((p) => {
    const isFav = favorites.includes(p.id);
    const tagBadge = p.tags.includes('top')
      ? '<span class="product-tag"><i class="ti ti-flame"></i> Top</span>'
      : p.tags.includes('assada')
      ? '<span class="product-tag green"><i class="ti ti-flame"></i> Assada</span>'
      : '';
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-image" onclick="openModal('${p.id}')">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'"/>
          ${tagBadge}
          <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFav('${p.id}')" aria-label="Favoritar">
            <i class="ti ti-heart${isFav ? '-filled' : ''}"></i>
          </button>
        </div>
        <div class="product-info">
          <div class="product-title-row">
            <h3>${p.name}</h3>
            <span class="rating"><i class="ti ti-star-filled"></i> ${p.rating}</span>
          </div>
          <p class="product-desc">${p.desc.substring(0, 70)}${p.desc.length > 70 ? '...' : ''}</p>
          <div class="product-footer">
            <span class="price">${formatBRL(p.price)}</span>
            <button class="add-btn" onclick="event.stopPropagation(); addToCart('${p.id}'); showToast('${p.name} adicionado!')" aria-label="Adicionar ${p.name}">
              <i class="ti ti-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ============ RENDER COMBOS ============ */
function renderCombos() {
  const grid = document.getElementById('combos-grid');
  grid.innerHTML = COMBOS.map((c) => `
    <div class="combo-card ${c.featured ? 'featured' : ''}">
      ${c.featured ? '<span class="top-badge"><i class="ti ti-flame"></i> Mais pedido</span>' : ''}
      <div class="combo-image">
        <img src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'"/>
        <span class="discount-badge"><i class="ti ti-discount-2"></i> -${c.discount}%</span>
      </div>
      <div class="combo-body">
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <div class="combo-price">
          <span class="old-price">R$ ${c.oldPrice}</span>
          <span class="new-price">R$ ${c.price}</span>
        </div>
        <button class="combo-btn" onclick="addCombo('${c.id}'); showToast('${c.name} adicionado!')">
          <i class="ti ti-shopping-cart-plus"></i> Adicionar combo
        </button>
      </div>
    </div>
  `).join('');
}

/* ============ RENDER CARRINHO ============ */
function renderCart() {
  const items = document.getElementById('cart-items');
  const count = document.getElementById('cart-count');
  const badge = document.getElementById('cart-badge');
  const checkoutBtn = document.getElementById('checkout-btn');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  count.textContent = `${totalQty} ${totalQty === 1 ? 'item' : 'itens'}`;
  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? 'flex' : 'none';
  checkoutBtn.disabled = cart.length === 0;

  const itemTemplate = (item) => `
    <div class="cart-item">
      <div class="cart-thumb">
        ${item.image ? `<img src="${item.image}" alt="${item.name}"/>` : `<i class="ti ti-shopping-bag"></i>`}
      </div>
      <div class="cart-item-info">
        <p>${item.name}</p>
        <small>${formatBRL(item.price)} cada</small>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Diminuir quantidade">
          <i class="ti ti-minus"></i>
        </button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn plus" onclick="updateQty('${item.id}', 1)" aria-label="Aumentar quantidade">
          <i class="ti ti-plus"></i>
        </button>
      </div>
    </div>
  `;

  const emptyTemplate = `
    <div class="cart-empty">
      <i class="ti ti-shopping-bag-x"></i>
      Seu carrinho está vazio
    </div>
  `;

  items.innerHTML = cart.length === 0 ? emptyTemplate : cart.map(itemTemplate).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('subtotal').textContent = formatBRL(subtotal);
  document.getElementById('total').textContent = formatBRL(subtotal);
  document.getElementById('drawer-total').textContent = formatBRL(subtotal);

  const drawerBody = document.getElementById('drawer-body');
  drawerBody.innerHTML = cart.length === 0 ? emptyTemplate : cart.map(itemTemplate).join('');

  localStorage.setItem('salgadinho_cart', JSON.stringify(cart));
}

/* ============ AÇÕES DO CARRINHO ============ */
function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image });
  }
  bumpBadge();
  renderCart();
}

function addToCartQty(productId, qty) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: qty, image: product.image });
  }
  bumpBadge();
  renderCart();
}

function addCombo(comboId) {
  const combo = COMBOS.find((c) => c.id === comboId);
  if (!combo) return;
  const existing = cart.find((i) => i.id === comboId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: combo.id, name: combo.name, price: combo.price, qty: 1, image: combo.image });
  }
  bumpBadge();
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  renderCart();
}

function bumpBadge() {
  const badge = document.getElementById('cart-badge');
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
}

/* ============ FAVORITOS ============ */
function toggleFav(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
    showToast('Adicionado aos favoritos!');
  }
  localStorage.setItem('salgadinho_favs', JSON.stringify(favorites));
  renderMenu();
}

/* ============ TOGGLE VER MAIS ============ */
function toggleMenuView() {
  showAllMenu = !showAllMenu;
  renderMenu();
  if (!showAllMenu) {
    document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' });
  }
}

/* ============ FILTROS / BUSCA ============ */
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter;
    showAllMenu = false;
    renderMenu();
  });
});

document.getElementById('search-input').addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderMenu();
});

/* ============ MODAL PRODUTO ============ */
function openModal(id) {
  const p = PRODUCTS.find((p) => p.id === id);
  if (!p) return;
  modalItem = p;
  modalQty = 1;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-rating').textContent = p.rating;
  document.getElementById('modal-category').textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);
  document.getElementById('modal-price').textContent = formatBRL(p.price);
  const modalImg = document.getElementById('modal-img');
  modalImg.src = p.image;
  modalImg.alt = p.name;
  document.getElementById('modal-qty').textContent = '1';
  updateModalTotal();
  document.getElementById('product-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modal-qty').textContent = modalQty;
  updateModalTotal();
}

function updateModalTotal() {
  if (!modalItem) return;
  const total = modalItem.price * modalQty;
  document.getElementById('modal-total').textContent = formatBRL(total);
}

function addFromModal() {
  if (!modalItem) return;
  addToCartQty(modalItem.id, modalQty);
  showToast(`${modalQty}x ${modalItem.name} adicionado!`);
  closeModal();
}

document.getElementById('product-modal').addEventListener('click', closeModal);

/* ============ DRAWER CARRINHO ============ */
document.getElementById('open-cart').addEventListener('click', () => {
  document.getElementById('drawer').classList.add('active');
  document.getElementById('drawer-overlay').classList.add('active');
});

function closeCart() {
  document.getElementById('drawer').classList.remove('active');
  document.getElementById('drawer-overlay').classList.remove('active');
}

function goToCheckout() {
  closeCart();
  setTimeout(() => {
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
  }, 200);
}

/* ============ PAGAMENTO ============ */
document.querySelectorAll('.payment-option').forEach((opt) => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('active'));
    opt.classList.add('active');
    payment = opt.dataset.payment;
  });
});

/* ============ WHATSAPP ============ */
function openWhatsApp(msg) {
  const text = encodeURIComponent(msg || 'Olá! Gostaria de saber mais.');
  window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank');
}

document.getElementById('quick-whatsapp').addEventListener('click', () => {
  if (cart.length > 0) {
    goToCheckout();
  } else {
    openWhatsApp('Olá! Gostaria de fazer um pedido.');
  }
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const notes = document.getElementById('customer-notes').value.trim();

  if (!name || !phone || !address) {
    showToast('Preencha nome, WhatsApp e endereço!', true);
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let msg = `*🍴 Novo Pedido - Salgadinho&Cia*\n\n`;
  msg += `*👤 Cliente:* ${name}\n`;
  msg += `*📱 WhatsApp:* ${phone}\n`;
  msg += `*📍 Endereço:* ${address}\n`;
  if (notes) msg += `*📝 Observações:* ${notes}\n`;
  msg += `\n*🛒 Itens do pedido:*\n`;
  cart.forEach((item) => {
    msg += `• ${item.qty}x ${item.name} - ${formatBRL(item.price * item.qty)}\n`;
  });
  msg += `\n*💰 Total:* ${formatBRL(subtotal)}\n`;
  msg += `*💳 Pagamento:* ${payment}\n\n`;
  msg += `_Aguardando confirmação. Obrigado!_ 🧡`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
});

/* ============ TOAST ============ */
let toastTimer;
function showToast(msg, isError) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  const icon = toast.querySelector('i');
  icon.className = isError ? 'ti ti-alert-circle' : 'ti ti-check';
  icon.style.color = isError ? '#E24B4A' : 'var(--green)';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ============ NAV ATIVA NO SCROLL ============ */
const sections = ['inicio', 'cardapio', 'combos', 'contato'];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('.nav-links a').forEach((a) => {
        a.classList.toggle('active', a.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

/* ============ REVEAL ON SCROLL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ============ ATALHO ESC ============ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeCart();
  }
});

/* ============ SCROLL HELPERS ============ */
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

/* ============ INICIALIZAÇÃO ============ */
renderMenu();
renderCombos();
renderCart();
