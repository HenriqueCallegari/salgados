/* =========================================================
   Salgadinho&Cia — Lógica principal da aplicação
   ========================================================= */

/* ============ FORMATAÇÃO ============ */
const formatBRL = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;

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
let appliedCoupon = null;          // código do cupom válido aplicado
let kitState = {};                  // { flavorId: quantidade } do "monte seu cento"
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

  const isBrowsing = currentFilter === 'todos' && !searchTerm;
  const visible = (showAllMenu || !isBrowsing) ? filtered : filtered.slice(0, INITIAL_MENU_LIMIT);

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
    const badges = [];
    if (p.tags.includes('bestseller')) badges.push('<span class="product-tag amber"><i class="ti ti-flame"></i> Mais vendido</span>');
    if (p.tags.includes('top')) badges.push('<span class="product-tag brand"><i class="ti ti-trophy"></i> Top</span>');
    if (p.tags.includes('novo')) badges.push('<span class="product-tag green">Novo</span>');
    if (p.tags.includes('assada') && !badges.length) badges.push('<span class="product-tag green"><i class="ti ti-flame"></i> Assada</span>');
    if (p.tags.includes('vegetarianos')) badges.push('<span class="product-tag green"><i class="ti ti-leaf"></i> Veggie</span>');

    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-image" onclick="openModal('${p.id}')">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'"/>
          <div class="product-badges">${badges.join('')}</div>
          <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFav('${p.id}')" aria-label="Favoritar">
            <i class="ti ti-heart${isFav ? '-filled' : ''}"></i>
          </button>
        </div>
        <div class="product-info">
          <div class="product-title-row">
            <h3>${p.name}</h3>
            <span class="rating"><i class="ti ti-star-filled"></i> ${p.rating}</span>
          </div>
          <div class="product-meta">
            <span><i class="ti ti-weight"></i> ${p.weight}</span>
            <span><i class="ti ti-message-circle"></i> ${p.reviews}</span>
          </div>
          <p class="product-desc">${p.short || p.desc.substring(0, 60) + '...'}</p>
          <div class="product-footer">
            <div class="price-block">
              <span class="price-label">A partir de</span>
              <span class="price">${formatBRL(p.price)}</span>
            </div>
            <button class="add-btn" data-id="${p.id}" onclick="event.stopPropagation(); addToCart('${p.id}', event)" aria-label="Adicionar ${p.name}">
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
        ${c.pieces ? `<span class="combo-pieces"><i class="ti ti-package"></i> ${c.pieces}</span>` : ''}
        <div class="combo-price">
          <span class="old-price">R$ ${c.oldPrice}</span>
          <span class="new-price">R$ ${c.price}</span>
        </div>
        <button class="combo-btn" onclick="addCombo('${c.id}', event); showToast('${c.name} adicionado!')">
          <i class="ti ti-shopping-cart-plus"></i> Adicionar combo
        </button>
      </div>
    </div>
  `).join('');
}

/* ============ RENDER FESTA / CENTO ============ */
function renderFesta() {
  const grid = document.getElementById('festa-grid');
  if (!grid) return;
  grid.innerHTML = FESTA.map((f) => {
    const economia = Math.round((f.oldPrice - f.price));
    const isFrozen = f.type === 'congelado';
    return `
      <div class="festa-card ${f.featured ? 'featured' : ''}">
        ${f.featured ? '<span class="top-badge"><i class="ti ti-flame"></i> Mais pedido</span>' : ''}
        <div class="festa-image">
          <img src="${f.image}" alt="${f.name}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'"/>
          <span class="festa-qty-badge"><i class="ti ti-package"></i> ${f.qty} un</span>
          <span class="festa-type ${isFrozen ? 'frozen' : 'hot'}">
            <i class="ti ${isFrozen ? 'ti-snowflake' : 'ti-flame'}"></i> ${isFrozen ? 'Congelado' : 'Pronto'}
          </span>
        </div>
        <div class="festa-body">
          <h3>${f.name}</h3>
          <p>${f.desc}</p>
          <div class="festa-price">
            <div>
              <span class="festa-old">R$ ${f.oldPrice.toFixed(0)}</span>
              <span class="festa-new">${formatBRL(f.price)}</span>
            </div>
            <span class="festa-economia">economize R$ ${economia}</span>
          </div>
          <button class="combo-btn" onclick="addCento('${f.id}', event)">
            <i class="ti ti-shopping-cart-plus"></i> Adicionar cento
          </button>
        </div>
      </div>`;
  }).join('');
}

function addCento(id, evt) {
  const f = FESTA.find((x) => x.id === id);
  if (!f) return;
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id: f.id, name: f.name, price: f.price, qty: 1, image: f.image });
  if (evt) flyToCart(evt.currentTarget);
  bumpBadge();
  renderCart();
  showToast(`${f.name} adicionado!`);
}

/* ============ MONTE SEU CENTO (KIT) ============ */
function renderKitFlavors() {
  const wrap = document.getElementById('kit-flavors');
  if (!wrap) return;
  wrap.innerHTML = KIT.flavors.map((fl) => {
    const qty = kitState[fl.id] || 0;
    return `
      <div class="kit-flavor ${qty > 0 ? 'on' : ''}" data-id="${fl.id}">
        <span class="kit-flavor-name">${fl.name}</span>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateKit('${fl.id}', -${KIT.step})" aria-label="Tirar ${KIT.step}">-${KIT.step}</button>
          <span class="qty-num" id="kit-q-${fl.id}">${qty}</span>
          <button class="qty-btn plus" onclick="updateKit('${fl.id}', ${KIT.step})" aria-label="Adicionar ${KIT.step}">+${KIT.step}</button>
        </div>
      </div>`;
  }).join('');
  updateKitSummary();
}

function updateKit(id, delta) {
  const cur = kitState[id] || 0;
  let next = cur + delta;
  if (delta < 0) next = Math.max(0, cur + delta);   // diminui de 1 em 1 até zerar
  kitState[id] = next;
  if (kitState[id] <= 0) delete kitState[id];
  const span = document.getElementById(`kit-q-${id}`);
  if (span) span.textContent = kitState[id] || 0;
  const row = document.querySelector(`.kit-flavor[data-id="${id}"]`);
  if (row) row.classList.toggle('on', (kitState[id] || 0) > 0);
  updateKitSummary();
}

function kitTotalQty() {
  return Object.values(kitState).reduce((s, q) => s + q, 0);
}

function updateKitSummary() {
  const totalQty = kitTotalQty();
  const totalPrice = totalQty * KIT.unitPrice;
  const qtyEl = document.getElementById('kit-total-qty');
  const priceEl = document.getElementById('kit-total-price');
  const msgEl = document.getElementById('kit-min-msg');
  const btn = document.getElementById('kit-add-btn');
  if (qtyEl) qtyEl.textContent = totalQty;
  if (priceEl) priceEl.textContent = formatBRL(totalPrice);
  const reached = totalQty >= KIT.min;
  if (msgEl) {
    msgEl.textContent = reached
      ? `✓ pronto para adicionar`
      : `faltam ${KIT.min - totalQty} para o mínimo`;
    msgEl.classList.toggle('ok', reached);
  }
  if (btn) btn.disabled = !reached;
}

function addKitToCart() {
  const totalQty = kitTotalQty();
  if (totalQty < KIT.min) return;
  const sabores = KIT.flavors
    .filter((fl) => kitState[fl.id])
    .map((fl) => `${kitState[fl.id]}x ${fl.name}`)
    .join(', ');
  const id = 'kit-' + Date.now();          // cada kit é um item único
  cart.push({
    id,
    name: `Kit ${totalQty} salgados`,
    price: KIT.unitPrice,
    qty: totalQty,
    image: FALLBACK_IMG,
    note: sabores
  });
  kitState = {};
  renderKitFlavors();
  bumpBadge();
  renderCart();
  showToast(`Kit de ${totalQty} salgados adicionado!`);
}

/* ============ RENDER B2B / EMPRESAS ============ */
function renderB2B() {
  const benefits = document.getElementById('b2b-benefits');
  if (benefits) {
    benefits.innerHTML = B2B.benefits.map((b) => `
      <div class="b2b-benefit">
        <div class="b2b-benefit-icon"><i class="ti ${b.icon}"></i></div>
        <h4>${b.title}</h4>
        <p>${b.text}</p>
      </div>`).join('');
  }

  const plans = document.getElementById('b2b-plans');
  if (plans) {
    plans.innerHTML = B2B.plans.map((p) => `
      <div class="b2b-plan ${p.featured ? 'featured' : ''}">
        ${p.featured ? '<span class="b2b-plan-tag">Mais procurado</span>' : ''}
        <div class="b2b-plan-icon"><i class="ti ${p.icon}"></i></div>
        <h4>${p.name}</h4>
        <span class="b2b-plan-tagline">${p.tagline}</span>
        <span class="b2b-plan-from">${p.from}</span>
        <ul>${p.features.map((f) => `<li><i class="ti ti-check"></i> ${f}</li>`).join('')}</ul>
        <button class="b2b-plan-btn" onclick="scrollToSection('b2b-form')">
          <i class="ti ti-file-text"></i> Pedir orçamento
        </button>
      </div>`).join('');
  }

  const logos = document.getElementById('b2b-logos');
  if (logos) {
    logos.innerHTML = B2B.clients.map((c) => `<span class="b2b-logo">${c}</span>`).join('');
  }
}

function openB2BWhatsApp() {
  const text = encodeURIComponent('Olá! Sou de uma empresa e gostaria de um orçamento de salgados corporativos.');
  window.open(`https://wa.me/${B2B.whatsapp}?text=${text}`, '_blank');
}

function submitB2BQuote() {
  const required = document.querySelectorAll('.b2b-quote-card .field[data-b2b-required]');
  let ok = true;
  required.forEach((f) => {
    const input = f.querySelector('input, textarea, select');
    const valid = input && input.value.trim().length > 0;
    f.classList.toggle('invalid', !valid);
    if (!valid) ok = false;
  });
  if (!ok) {
    showToast('Preencha nome, empresa e contato.', true);
    return;
  }

  const val = (id) => (document.getElementById(id)?.value || '').trim();
  let msg = `*🏢 Orçamento Corporativo - Salgadinho&Cia*\n\n`;
  msg += `*👤 Responsável:* ${val('b2b-name')}\n`;
  msg += `*🏢 Empresa:* ${val('b2b-company')}\n`;
  if (val('b2b-cnpj')) msg += `*🧾 CNPJ:* ${val('b2b-cnpj')}\n`;
  msg += `*📱 Contato:* ${val('b2b-contact')}\n`;
  msg += `*📦 Tipo:* ${val('b2b-type')}\n`;
  if (val('b2b-people')) msg += `*👥 Pessoas:* ${val('b2b-people')}\n`;
  if (val('b2b-date')) msg += `*📅 Data:* ${val('b2b-date')}\n`;
  if (val('b2b-notes')) msg += `*📝 Detalhes:* ${val('b2b-notes')}\n`;
  msg += `\n_Aguardo a proposta. Obrigado!_`;

  window.open(`https://wa.me/${B2B.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('Orçamento enviado ao comercial!');
}

/* ============ RENDER CARRINHO ============ */
function renderCart() {
  const items = document.getElementById('cart-items');
  const count = document.getElementById('cart-count');
  const badge = document.getElementById('cart-badge');
  const checkoutBtn = document.getElementById('checkout-btn');
  const smbCount = document.getElementById('smb-count');
  const smbTotal = document.getElementById('smb-total');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  count.textContent = `${totalQty} ${totalQty === 1 ? 'item' : 'itens'}`;
  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? 'flex' : 'none';
  if (smbCount) smbCount.textContent = totalQty;

  const itemTemplate = (item) => `
    <div class="cart-item">
      <div class="cart-thumb">${item.image ? `<img src="${item.image}" alt="${item.name}"/>` : `<i class="ti ti-shopping-bag"></i>`}</div>
      <div class="cart-item-info">
        <p>${item.name}</p>
        <small>${formatBRL(item.price)} cada</small>
        ${item.note ? `<small class="cart-item-note">${item.note}</small>` : ''}
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Diminuir"><i class="ti ti-minus"></i></button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn plus" onclick="updateQty('${item.id}', 1)" aria-label="Aumentar"><i class="ti ti-plus"></i></button>
      </div>
    </div>`;

  const emptyTemplate = `
    <div class="cart-empty">
      <i class="ti ti-shopping-bag-x"></i>
      Seu carrinho está vazio
    </div>`;

  items.innerHTML = cart.length === 0 ? emptyTemplate : cart.map(itemTemplate).join('');

  const t = getCartTotals();
  document.getElementById('subtotal').textContent = formatBRL(t.subtotal);
  document.getElementById('total').textContent = formatBRL(t.total);
  document.getElementById('drawer-total').textContent = formatBRL(t.total);
  if (smbTotal) smbTotal.textContent = formatBRL(t.total);

  /* Desconto de cupom */
  const discountRow = document.getElementById('discount-row');
  if (discountRow) {
    if (t.discount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('discount-value').textContent = `- ${formatBRL(t.discount)}`;
      document.getElementById('coupon-code-label').textContent = appliedCoupon ? `(${appliedCoupon})` : '';
    } else {
      discountRow.style.display = 'none';
    }
  }

  /* Taxa de entrega */
  const deliveryEl = document.getElementById('delivery-value');
  if (deliveryEl) {
    if (t.subtotal === 0 || t.delivery === 0) {
      deliveryEl.className = 'free';
      deliveryEl.innerHTML = '<i class="ti ti-truck-delivery"></i> Grátis';
    } else {
      deliveryEl.className = '';
      deliveryEl.textContent = formatBRL(t.delivery);
    }
  }

  /* Barra de progresso de frete grátis */
  const freeShip = document.getElementById('free-ship');
  if (freeShip) {
    const base = t.subtotal - t.discount;
    const showBar = t.subtotal > 0 && !t.freeShipCoupon && base < CONFIG.freeDeliveryFrom;
    freeShip.style.display = showBar ? 'block' : 'none';
    if (showBar) {
      const pct = Math.min(100, (base / CONFIG.freeDeliveryFrom) * 100);
      document.getElementById('free-ship-fill').style.width = `${pct}%`;
      const falta = CONFIG.freeDeliveryFrom - base;
      document.getElementById('free-ship-msg').innerHTML =
        `Faltam <strong>${formatBRL(falta)}</strong> para ganhar <strong>frete grátis</strong> 🚚`;
    }
  }

  /* Pedido mínimo */
  const minHint = document.getElementById('min-order-hint');
  const belowMin = t.subtotal > 0 && t.subtotal < CONFIG.minOrder;
  if (minHint) {
    minHint.style.display = belowMin ? 'block' : 'none';
    if (belowMin) {
      minHint.innerHTML = `<i class="ti ti-info-circle"></i> Pedido mínimo de ${formatBRL(CONFIG.minOrder)} — faltam ${formatBRL(CONFIG.minOrder - t.subtotal)}`;
    }
  }
  checkoutBtn.disabled = cart.length === 0 || belowMin;

  const drawerBody = document.getElementById('drawer-body');
  drawerBody.innerHTML = cart.length === 0 ? emptyTemplate : cart.map(itemTemplate).join('');

  /* Mostra/esconde sticky mobile bar */
  const smb = document.getElementById('sticky-mobile-bar');
  if (smb) smb.classList.toggle('show', cart.length > 0);

  localStorage.setItem('salgadinho_cart', JSON.stringify(cart));
}

/* ============ TOTAIS (entrega + cupom) ============ */
function getCartTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  let freeShipCoupon = false;

  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const c = COUPONS[appliedCoupon];
    if (subtotal >= c.minOrder) {
      if (c.type === 'percent') discount = subtotal * (c.value / 100);
      else if (c.type === 'free_ship') freeShipCoupon = true;
    }
  }

  const afterDiscount = subtotal - discount;
  let delivery = 0;
  if (subtotal > 0 && !freeShipCoupon && afterDiscount < CONFIG.freeDeliveryFrom) {
    delivery = CONFIG.deliveryFee;
  }
  const total = afterDiscount + delivery;
  return { subtotal, discount, delivery, total, freeShipCoupon };
}

/* ============ CUPOM ============ */
function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const msg = document.getElementById('coupon-msg');
  const code = (input.value || '').trim().toUpperCase();
  if (!code) return;

  const coupon = COUPONS[code];
  if (!coupon) {
    appliedCoupon = null;
    msg.className = 'coupon-msg error';
    msg.textContent = 'Cupom inválido.';
    renderCart();
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (subtotal < coupon.minOrder) {
    appliedCoupon = null;
    msg.className = 'coupon-msg error';
    msg.textContent = `Cupom válido para pedidos acima de ${formatBRL(coupon.minOrder)}.`;
    renderCart();
    return;
  }

  appliedCoupon = code;
  msg.className = 'coupon-msg ok';
  msg.innerHTML = `<i class="ti ti-circle-check"></i> ${coupon.desc} aplicado!`;
  renderCart();
}

/* ============ FLY TO CART ============ */
function flyToCart(srcEl) {
  if (!srcEl) return;
  const img = srcEl.closest('.product-card, .combo-card')?.querySelector('img');
  const target = document.getElementById('cart-badge') || document.getElementById('open-cart');
  if (!img || !target) return;

  const imgRect = img.getBoundingClientRect();
  const tgtRect = target.getBoundingClientRect();
  const clone = document.createElement('div');
  clone.className = 'fly-clone';
  clone.style.left = `${imgRect.left}px`;
  clone.style.top = `${imgRect.top}px`;
  clone.style.width = `${Math.min(80, imgRect.width)}px`;
  clone.style.height = `${Math.min(80, imgRect.height)}px`;
  const innerImg = document.createElement('img');
  innerImg.src = img.src;
  clone.appendChild(innerImg);
  const dx = tgtRect.left + tgtRect.width / 2 - imgRect.left - Math.min(80, imgRect.width) / 2;
  const dy = tgtRect.top + tgtRect.height / 2 - imgRect.top - Math.min(80, imgRect.height) / 2;
  clone.style.setProperty('--fx', `${dx}px`);
  clone.style.setProperty('--fy', `${dy}px`);
  document.body.appendChild(clone);
  setTimeout(() => clone.remove(), 750);
}

/* ============ AÇÕES DO CARRINHO ============ */
function addToCart(productId, evt) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((i) => i.id === productId);
  if (existing) existing.qty++;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image });

  if (evt) {
    const btn = evt.currentTarget;
    btn.classList.remove('added');
    void btn.offsetWidth;
    btn.classList.add('added');
    flyToCart(btn);
  }

  bumpBadge();
  renderCart();
  showToast(`${product.name} adicionado!`);
}

function addToCartQty(productId, qty) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((i) => i.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: qty, image: product.image });
  bumpBadge();
  renderCart();
}

function addCombo(comboId, evt) {
  const combo = COMBOS.find((c) => c.id === comboId);
  if (!combo) return;
  const existing = cart.find((i) => i.id === comboId);
  if (existing) existing.qty++;
  else cart.push({ id: combo.id, name: combo.name, price: combo.price, qty: 1, image: combo.image });
  if (evt) flyToCart(evt.currentTarget);
  bumpBadge();
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
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
  if (!showAllMenu) document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' });
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
  modalItem = p; modalQty = 1;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-rating').textContent = p.rating;
  document.getElementById('modal-reviews').textContent = p.reviews;
  document.getElementById('modal-category').textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);
  document.getElementById('modal-weight').textContent = p.weight;
  document.getElementById('modal-pieces').textContent = p.pieces;
  document.getElementById('modal-price').textContent = formatBRL(p.price);
  const modalImg = document.getElementById('modal-img');
  modalImg.src = p.image; modalImg.alt = p.name;
  document.getElementById('modal-qty').textContent = '1';

  const badgeBox = document.getElementById('modal-badges');
  const tags = [];
  if (p.tags.includes('bestseller')) tags.push('<span class="product-tag amber"><i class="ti ti-flame"></i> Mais vendido</span>');
  if (p.tags.includes('top')) tags.push('<span class="product-tag brand"><i class="ti ti-trophy"></i> Top</span>');
  if (p.tags.includes('novo')) tags.push('<span class="product-tag green">Novo</span>');
  badgeBox.innerHTML = tags.join('');

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
  document.getElementById('modal-total').textContent = formatBRL(modalItem.price * modalQty);
}

function addFromModal() {
  if (!modalItem) return;
  addToCartQty(modalItem.id, modalQty);
  showToast(`${modalQty}x ${modalItem.name} adicionado!`);
  closeModal();
}

document.getElementById('product-modal').addEventListener('click', closeModal);

/* ============ DRAWER ============ */
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
  setTimeout(() => document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' }), 200);
}

/* ============ PAGAMENTO ============ */
document.querySelectorAll('.payment-option').forEach((opt) => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('active'));
    opt.classList.add('active');
    payment = opt.dataset.payment;
  });
});

/* ============ VALIDAÇÃO INLINE ============ */
function validateField(field) {
  const input = field.querySelector('input, textarea');
  if (!input) return false;
  const val = input.value.trim();
  let ok = val.length > 0;
  if (input.type === 'tel') ok = /\d{4}.*\d{4}/.test(val) || val.replace(/\D/g, '').length >= 10;
  field.classList.toggle('valid', ok && val.length > 1);
  field.classList.toggle('invalid', !ok && document.activeElement !== input && val.length === 0 && field.dataset.touched === '1');
  return ok;
}

document.querySelectorAll('.field[data-required] input, .field[data-required] textarea').forEach((input) => {
  const field = input.closest('.field');
  input.addEventListener('blur', () => { field.dataset.touched = '1'; validateField(field); });
  input.addEventListener('input', () => validateField(field));
});

/* Máscara simples WhatsApp */
const phoneInput = document.getElementById('customer-phone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    e.target.value = v;
  });
}

/* ============ WHATSAPP ============ */
function openWhatsApp(msg) {
  const text = encodeURIComponent(msg || 'Olá! Gostaria de saber mais.');
  window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank');
}

document.getElementById('quick-whatsapp').addEventListener('click', () => {
  if (cart.length > 0) goToCheckout();
  else openWhatsApp('Olá! Gostaria de fazer um pedido.');
});

/* Sticky mobile checkout botão */
const smbCheckout = document.getElementById('smb-checkout');
if (smbCheckout) smbCheckout.addEventListener('click', goToCheckout);

document.getElementById('checkout-btn').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const fields = document.querySelectorAll('.field[data-required]');
  let allOk = true;
  fields.forEach((f) => {
    f.dataset.touched = '1';
    if (!validateField(f)) allOk = false;
  });

  if (!allOk) {
    showToast('Preencha nome, WhatsApp e endereço!', true);
    const firstInvalid = document.querySelector('.field.invalid input');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  /* Loading visual + abre WhatsApp */
  setStep(3);
  btn.classList.add('loading');
  setTimeout(() => {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();
    const t = getCartTotals();

    let msg = `*🍴 Novo Pedido - Salgadinho&Cia*\n\n`;
    msg += `*👤 Cliente:* ${name}\n`;
    msg += `*📱 WhatsApp:* ${phone}\n`;
    msg += `*📍 Endereço:* ${address}\n`;
    if (notes) msg += `*📝 Observações:* ${notes}\n`;
    msg += `\n*🛒 Itens do pedido:*\n`;
    cart.forEach((item) => {
      msg += `• ${item.qty}x ${item.name} - ${formatBRL(item.price * item.qty)}\n`;
      if (item.note) msg += `   ↳ ${item.note}\n`;
    });
    msg += `\n*Subtotal:* ${formatBRL(t.subtotal)}\n`;
    if (t.discount > 0) msg += `*Desconto (${appliedCoupon}):* - ${formatBRL(t.discount)}\n`;
    msg += `*Entrega:* ${t.delivery === 0 ? 'Grátis' : formatBRL(t.delivery)}\n`;
    msg += `*💰 Total:* ${formatBRL(t.total)}\n`;
    msg += `*💳 Pagamento:* ${payment}\n\n`;
    msg += `_Aguardando confirmação. Obrigado!_ 🧡`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    btn.classList.remove('loading');
  }, 900);
});

/* ============ STEPPER ============ */
function setStep(step) {
  document.querySelectorAll('.stepper .step').forEach((s) => {
    const n = parseInt(s.dataset.step, 10);
    s.classList.toggle('done', n < step);
    s.classList.toggle('active', n === step);
  });
}

/* Stepper atualiza ao preencher os dados */
function updateStepperByForm() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const addr = document.getElementById('customer-address').value.trim();
  const hasPay = !!payment;
  if (name && phone && addr && hasPay) setStep(3);
  else if (name && phone && addr) setStep(2);
  else if (name || phone || addr) setStep(1);
  else setStep(1);
}
document.querySelectorAll('#customer-name, #customer-phone, #customer-address').forEach((i) => i.addEventListener('input', updateStepperByForm));
document.querySelectorAll('.payment-option').forEach((opt) => opt.addEventListener('click', updateStepperByForm));

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

/* ============ NAV ATIVA ============ */
const sections = ['inicio', 'cardapio', 'festa', 'combos', 'empresas', 'contato'];
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

/* ============ REVEAL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ============ ANIMATED COUNTERS ============ */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const valueSpan = el.querySelector('.stat-value');
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = (target * eased).toFixed(decimals).replace('.', ',');
    if (valueSpan) valueSpan.textContent = value + suffix;
    else el.textContent = (target >= 1000 ? Math.floor(target * eased).toLocaleString('pt-BR') : value) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else {
      const finalVal = target >= 1000 ? Math.floor(target).toLocaleString('pt-BR') : target.toFixed(decimals).replace('.', ',');
      if (valueSpan) valueSpan.textContent = finalVal + suffix;
      else el.textContent = finalVal + suffix;
    }
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach((el) => counterObserver.observe(el));

/* ============ ATALHO ESC ============ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeCart(); }
});

/* ============ SCROLL HELPERS ============ */
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

/* ============ INIT ============ */
renderMenu();
renderCombos();
renderFesta();
renderKitFlavors();
renderB2B();
renderCart();
updateStepperByForm();

/* Aplicar cupom com Enter */
const couponInput = document.getElementById('coupon-input');
if (couponInput) couponInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } });
