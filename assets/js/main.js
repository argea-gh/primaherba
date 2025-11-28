// Data produk (sesuaikan dengan produk nyata Anda)
const PRODUCTS = [
  {id:1,name:"HNI Health 500ml",category:"madu",price:125000,desc:"Madu murni sumber energi & imun",img:"https://hni.net/public/front/img/produk/hni-health-3_18-11-24_.png",sold:320},
  {id:2,name:"Fibdrink Original",category:"suplemen",price:85000,desc:"Minuman serat untuk kesehatan pencernaan",img:"https://hni.net/public/front/img/produk/fibdrink_10-12-22_.png",sold:250},
  {id:3,name:"Sevel Stamina",category:"lainnya",price:65000,desc:"Ramuan tradisional untuk stamina",img:"https://hni.net/public/front/img/produk/sevel-stamina_11-09-25_.png",sold:180},
  {id:4,name:"Zidavit Multivitamin",category:"suplemen",price:99000,desc:"Suplemen vitamin lengkap untuk keluarga",img:"https://hni.net/public/front/img/produk/zidavit_18-11-24_.png",sold:210},
  {id:5,name:"Fibdrink Lemon",category:"lainnya",price:78000,desc:"Fibdrink varian lemon, menyegarkan",img:"https://hni.net/public/front/img/produk/fibdrink-lemon_20-10-23_.png",sold:140},
  {id:6,name:"Madu SJ 250ml",category:"madu",price:69000,desc:"Madu organik pilihan",img:"https://hni.net/public/front/img/produk/MADU%20SJ-1_07-01-19_.png",sold:280},
  {id:7,name:"Madu Campuran Propolis 350ml",category:"madu",price:99000,desc:"Madu + propolis untuk perlindungan ekstra",img:"https://hni.net/public/front/img/produk/hni-health-3_18-11-24_.png",sold:210},
  {id:8,name:"Suplemen Omega Herbal",category:"suplemen",price:145000,desc:"Kaya omega dari sumber nabati",img:"https://hni.net/public/front/img/produk/fibdrink_10-12-22_.png",sold:110}
];

// REVIEW SAMPLE
const REVIEWS = [
  {name:"Siti R", text:"Produk sampai cepat, madu asli enak. Saya pesan lagi!"},
  {name:"Budi A", text:"Suplemennya membantu stamina saya saat kerja shift."},
  {name:"Maya L", text:"Pelayanan ramah & packing rapi. Recommended."}
];

// Nomor WhatsApp toko (format internasional, tanpa +)
const WHATSAPP_NUMBER = "6282241900467";

// ---- Cart logic (localStorage) ----
const CART_KEY = "herbaprima_cart_v1";
function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[]; }catch(e){ return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function addToCart(id, qty=1){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty += qty; else cart.push({id,qty});
  saveCart(cart); refreshCartUI();
}
function removeFromCart(id){
  let cart = getCart().filter(i=>i.id!==id); saveCart(cart); refreshCartUI();
}
function updateQty(id, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item){ item.qty = Math.max(0,qty); }
  saveCart(cart); refreshCartUI();
}
function cartSummary(){
  const cart = getCart();
  let total = 0;
  const details = cart.map(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const subtotal = (p ? p.price : 0) * ci.qty;
    total += subtotal;
    return {...p, qty:ci.qty, subtotal};
  });
  return {items:details, total};
}

// ---- Render functions & utils ----
function rupiah(v){ return 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

function renderProductsGrid(targetId, products){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media"><img src="${p.img}" alt="${p.name}"></div>
      <div class="product-title">${p.name}</div>
      <div class="product-price">${rupiah(p.price)}</div>
      <div class="product-actions">
        <a class="btn btn-ghost" href="product.html?id=${p.id}">Detail</a>
        <button class="btn btn-primary" data-add="${p.id}">Tambah</button>
      </div>
    `;
    el.appendChild(card);
  });
  el.querySelectorAll('[data-add]').forEach(b=>{
    b.addEventListener('click', ev=>{
      const id = parseInt(b.getAttribute('data-add'),10);
      addToCart(id,1);
      b.textContent = "Ditambahkan ✓";
      setTimeout(()=> b.textContent = "Tambah", 1200);
    });
  });
}

function renderBestsellers(){
  const sorted = [...PRODUCTS].sort((a,b)=>b.sold - a.sold).slice(0,3);
  renderProductsGrid('bestsellers', sorted);
}

function renderReviews(){
  const el = document.getElementById('reviewsCarousel');
  if(!el) return;
  el.innerHTML = '';
  REVIEWS.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `<strong>${r.name}</strong><p style="color:var(--muted)">${r.text}</p>`;
    el.appendChild(div);
  });
}

function refreshCartUI(){
  const counts = document.querySelectorAll('#cartCount, #cartCount2, #cartCount3, #cartCount4, #cartCountAbout');
  const cart = getCart();
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  counts.forEach(c=>{ if(c) c.textContent = totalQty; });

  // Update overlay content
  const cartItemsEl = document.getElementById('cartItems');
  if(cartItemsEl){
    const {items, total} = cartSummary();
    cartItemsEl.innerHTML = '';
    if(items.length===0){ cartItemsEl.innerHTML = '<p>Keranjang kosong</p>'; }
    items.forEach(it=>{
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${it.img}" alt="${it.name}">
        <div style="flex:1">
          <div style="font-weight:600">${it.name}</div>
          <div style="color:var(--muted)"> ${rupiah(it.price)} x <span class="qty">${it.qty}</span></div>
        </div>
        <div style="text-align:right">
          <div>${rupiah(it.subtotal)}</div>
          <div style="margin-top:6px">
            <button class="btn btn-ghost small dec" data-id="${it.id}">-</button>
            <button class="btn btn-ghost small inc" data-id="${it.id}">+</button>
            <button class="btn btn-ghost small rm" data-id="${it.id}">hapus</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });
    const totalEl = document.getElementById('cartTotal');
    if(totalEl) totalEl.textContent = rupiah(total);

    // events
    cartItemsEl.querySelectorAll('.inc').forEach(b=>{
      b.addEventListener('click',()=> updateQty(parseInt(b.dataset.id,10), getQty(parseInt(b.dataset.id,10))+1));
    });
    cartItemsEl.querySelectorAll('.dec').forEach(b=>{
      b.addEventListener('click',()=> updateQty(parseInt(b.dataset.id,10), Math.max(1,getQty(parseInt(b.dataset.id,10))-1)));
    });
    cartItemsEl.querySelectorAll('.rm').forEach(b=>{
      b.addEventListener('click',()=> removeFromCart(parseInt(b.dataset.id,10)));
    });
  }

  // order summary on checkout
  const orderItemsEl = document.getElementById('orderItems');
  if(orderItemsEl){
    const {items,total} = cartSummary();
    orderItemsEl.innerHTML = '';
    if(items.length===0){ orderItemsEl.innerHTML = '<p>Keranjang kosong</p>'; }
    items.forEach(it=>{
      const div = document.createElement('div');
      div.style.display='flex';div.style.justifyContent='space-between';div.style.marginBottom='0.5rem';
      div.innerHTML = `<div>${it.name} x ${it.qty}</div><div>${rupiah(it.subtotal)}</div>`;
      orderItemsEl.appendChild(div);
    });
    const orderTotalEl = document.getElementById('orderTotal');
    if(orderTotalEl) orderTotalEl.textContent = rupiah(total);
  }
}

function getQty(id){ const cart = getCart(); const it = cart.find(x=>x.id===id); return it?it.qty:0; }

// ---- Tooltip helper for cart buttons ----
let _cartTooltipEl = null;
function showCartTooltip(button, text = "Lihat keranjang Anda"){
  if(_cartTooltipEl){ _cartTooltipEl.remove(); _cartTooltipEl = null; }
  const tip = document.createElement('div');
  tip.className = 'cart-tooltip';
  tip.textContent = text;
  document.body.appendChild(tip);
  _cartTooltipEl = tip;

  const rect = button.getBoundingClientRect();
  tip.style.left = '0px'; tip.style.top = '0px';
  requestAnimationFrame(()=>{
    const tipRect = tip.getBoundingClientRect();
    let left = rect.left + (rect.width / 2) - (tipRect.width / 2);
    left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
    let top = rect.top - tipRect.height - 12;
    if(top < 8){ top = rect.bottom + 10; }
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    requestAnimationFrame(()=> tip.classList.add('show'));
  });

  setTimeout(()=> {
    if(tip){
      tip.classList.remove('show');
      setTimeout(()=> { tip.remove(); if(_cartTooltipEl === tip) _cartTooltipEl = null; }, 180);
    }
  }, 1600);
}

// ---- Cart overlay toggles with animation ----
function initCartOverlay(){
  const cartButtons = document.querySelectorAll('.cart-btn');
  cartButtons.forEach(b=>{
    b.addEventListener('click', (e)=>{
      // tooltip and open overlay (works on all pages)
      showCartTooltip(b);
      toggleCart();
    });
  });

  const overlay = document.getElementById('cartOverlay');
  const close = document.getElementById('closeCart');
  if(close) close.addEventListener('click', ()=> toggleCart());
  overlay && overlay.addEventListener('click', (e)=> { if(e.target === overlay) toggleCart(); });

  // ensure overlay initial state class removed
  if(overlay) overlay.classList.remove('open');
}
function toggleCart(){
  const overlay = document.getElementById('cartOverlay');
  if(!overlay) return;
  const isOpen = overlay.classList.contains('open');
  if(!isOpen){
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    if(_cartTooltipEl){ _cartTooltipEl.classList.remove('show'); setTimeout(()=> _cartTooltipEl && _cartTooltipEl.remove(), 120); _cartTooltipEl = null; }
  } else {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
  }
}

// ---- Mobile menu (hamburger) ----
function initMobileMenu(){
  const hamburgerBtns = document.querySelectorAll('#hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  hamburgerBtns.forEach(h=>{
    h.addEventListener('click', ()=> {
      if(mobileNav) {
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden','false');
      }
    });
  });
  if(mobileNavClose) mobileNavClose.addEventListener('click', ()=> {
    if(mobileNav){
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden','true');
    }
  });
  // close mobile menu when clicking a link inside
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
  mobileLinks.forEach(a=> a.addEventListener('click', ()=> {
    if(mobileNav){ mobileNav.classList.remove('open'); mobileNav.setAttribute('aria-hidden','true'); }
  }));
}

// ---- Filter on products page ----
function initFilters(){
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.filter;
      if(mode==='all') renderProductsGrid('productsGridFull', PRODUCTS);
      else renderProductsGrid('productsGridFull', PRODUCTS.filter(p=>p.category===mode));
    });
  });
}

// ---- Checkout form -> WhatsApp ----
function initCheckoutForm(){
  const form = document.getElementById('checkoutForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const addr = document.getElementById('custAddress').value.trim();
    const note = document.getElementById('custNote').value.trim();
    const {items,total} = cartSummary();
    if(items.length===0){ alert('Keranjang kosong. Silakan tambahkan produk sebelum checkout.'); return; }
    let msg = `*Pesanan dari ${name}*\n`;
    msg += `No HP: ${phone}\n`;
    msg += `Alamat: ${addr}\n\n`;
    msg += `*Detail Pesanan:*\n`;
    items.forEach(it=> msg += `- ${it.name} x ${it.qty} = ${rupiah(it.subtotal)}\n`);
    msg += `\n*Total*: ${rupiah(total)}\n`;
    if(note) msg += `\nCatatan: ${note}\n`;
    msg += `\nMohon konfirmasi ketersediaan & estimasi pengiriman. Terima kasih.`;
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
  });
}

// ---- Scroll to top button ----
function initScrollTop(){
  const btns = document.querySelectorAll('#scrollTopBtn');
  function onScroll(){
    const show = window.scrollY > 200;
    btns.forEach(b=> b.classList.toggle('visible', show));
  }
  btns.forEach(b=> b.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'})));
  window.addEventListener('scroll', onScroll);
  onScroll();
}

// ---- General init on DOMContentLoaded ----
document.addEventListener('DOMContentLoaded', ()=>{
  // set years
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  document.getElementById('year2') && (document.getElementById('year2').textContent = new Date().getFullYear());
  document.getElementById('year3') && (document.getElementById('year3').textContent = new Date().getFullYear());
  document.getElementById('yearAbout') && (document.getElementById('yearAbout').textContent = new Date().getFullYear());

  // render content
  renderProductsGrid('productsGrid', PRODUCTS.slice(0,4));
  renderProductsGrid('productsGridFull', PRODUCTS);
  renderBestsellers();
  renderReviews();
  initSlider();
  initCartOverlay();
  initFilters();
  refreshCartUI();
  renderProductDetail();
  initCheckoutForm();
  initScrollTop();
  initMobileMenu();

  // attach global events
  window.addEventListener('storage', refreshCartUI);
});
