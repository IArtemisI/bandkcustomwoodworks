// cart-page.js

document.addEventListener("DOMContentLoaded", () => {
   const listEl = document.getElementById("cartList");
   const emptyEl = document.getElementById("cartEmpty");
   const wrapEl = document.getElementById("cartWrap");
   const subtotalEl = document.getElementById("cartSubtotal");
   
   // If this isn't the cart page (missing elements), do nothing
   if (!listEl || !emptyEl || !wrapEl || !subtotalEl) return;
   
   const money = (n) => `$${Number(n || 0).toFixed(2)}`;
   
   const FALLBACK_IMG = "Photos/icons/under-construction.webp";
   
   // If the product image is a "base" path (no .webp), use -960.webp.
   // If it's already a real URL (ends in .webp), use it as-is.
   const resolveProductImage = (product) => {
      const src = product?.image || product?.images?.[0] || "";
      if (!src) return FALLBACK_IMG;
      
      // Already a full filename (old style)
      if (src.endsWith(".webp")) return src;
      
      // New style "base path" -> pick a reasonable default
      return `${src}-960.webp`;
   };
   
   const render = () => {
      const catalog = window.BKProducts || {};
      const cart = window.BKCart?.readCart?.() || { items: [] };
      const items = cart.items || [];
      
      // Empty state
      if (!items.length) {
         emptyEl.hidden = false;
         wrapEl.hidden = true;
         subtotalEl.textContent = money(0);
         return;
      }
      
      emptyEl.hidden = true;
      wrapEl.hidden = false;
      
      listEl.innerHTML = "";
      let subtotal = 0;
      
      items.forEach((line) => {
         const product = catalog[line.id];
         if (!product) return;
         
         const qty = Number(line.qty || 0);
         const lineTotal = Number(product.price || 0) * qty;
         subtotal += lineTotal;
         
         const imgSrc = resolveProductImage(product);
         
         const li = document.createElement("li");
         li.className = "cart-item";
         li.innerHTML = `
        <img class="cart-item-img" src="${imgSrc}" alt="${product.title}" loading="lazy" decoding="async">
         
        <div class="cart-item-info">
          <h2 class="cart-item-title">${product.title}</h2>
          <p class="cart-item-price">${money(product.price)}</p>
         
          ${
         Array.isArray(product.specs) && product.specs.length
         ? `<ul class="cart-item-specs">
                  ${product.specs.map((s) => `<li>${s}</li>`).join("")}
                </ul>`
         : ""
      }
      
          <div class="cart-qty">
            <button class="cart-qty-btn" type="button" data-action="dec" data-id="${line.id}">−</button>
            <span class="cart-qty-num">${qty}</span>
            <button class="cart-qty-btn" type="button" data-action="inc" data-id="${line.id}">+</button>
      
            <button class="cart-remove" type="button" data-action="remove" data-id="${line.id}" aria-label="Remove item from cart">
              <img src="Photos/icons/trash.svg" alt="">
            </button>
          </div>
        </div>
      
        <div class="cart-item-total">${money(lineTotal)}</div>
      `;
      
      listEl.appendChild(li);
   });
   
   subtotalEl.textContent = money(subtotal);
};

const updateQty = (id, delta) => {
   const cart = window.BKCart?.readCart?.();
   if (!cart || !Array.isArray(cart.items)) return;
   
   const idx = cart.items.findIndex((it) => it.id === id);
   if (idx === -1) return;
   
   cart.items[idx].qty = Number(cart.items[idx].qty || 0) + delta;
   
   if (cart.items[idx].qty <= 0) {
      cart.items.splice(idx, 1);
   }
   
   window.BKCart.writeCart(cart);
   render();
};

const removeItem = (id) => {
   const cart = window.BKCart?.readCart?.();
   if (!cart || !Array.isArray(cart.items)) return;
   
   cart.items = cart.items.filter((it) => it.id !== id);
   window.BKCart.writeCart(cart);
   render();
};

listEl.addEventListener("click", (e) => {
   const btn = e.target.closest("button[data-action]");
   if (!btn) return;
   
   const id = btn.getAttribute("data-id");
   const action = btn.getAttribute("data-action");
   
   if (action === "inc") updateQty(id, 1);
   if (action === "dec") updateQty(id, -1);
   if (action === "remove") removeItem(id);
});

render();
});
