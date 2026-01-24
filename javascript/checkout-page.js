// checkout-page.js
// Renders checkout summary and redirects to Helcim hosted checkout

document.addEventListener("DOMContentLoaded", () => {
   const $ = (sel, root = document) => root.querySelector(sel);
   
   const emptyEl = $("#checkoutEmpty");
   const wrapEl = $("#checkoutWrap");
   const listEl = $("#checkoutList");
   const subtotalEl = $("#checkoutSubtotal");
   const payBtn = $("#payNowBtn");
   
   // Safety: if this isn't the checkout page, do nothing
   if (!emptyEl || !wrapEl || !listEl || !subtotalEl || !payBtn) return;
   
   const FALLBACK_IMG = "Photos/icons/under-construction.webp";
   
   // 🔑 YOUR HELCIM PAYMENT PAGE (base URL only)
   const HELCIM_BASE_URL =
   "https://bill-mauldin.myhelcim.com/hosted/?token=975070c902ec28942a3a7a";
   
   const money = (n) => `$${Number(n || 0).toFixed(2)}`;
   const getProduct = (id) => window.BKProducts?.[id] || null;
   
   // If src is a base path (no .webp), use -960.webp.
   // If it's already a .webp file, use it as-is.
   const resolveProductImage = (product) => {
      const src =
      product?.image ||
      (Array.isArray(product?.images) ? product.images[0] : "") ||
      "";
      
      if (!src) return FALLBACK_IMG;
      
      // Old style full filename
      if (src.endsWith(".webp")) return src;
      
      // New style base path -> pick a safe default
      return `${src}-960.webp`;
   };
   
   const render = () => {
      const cart = window.BKCart?.readCart?.() || { items: [] };
      const items = cart.items || [];
      
      if (!items.length) {
         emptyEl.hidden = false;
         wrapEl.hidden = true;
         subtotalEl.textContent = money(0);
         payBtn.disabled = true;
         return;
      }
      
      emptyEl.hidden = true;
      wrapEl.hidden = false;
      
      listEl.innerHTML = "";
      let subtotal = 0;
      
      items.forEach((line) => {
         const product = getProduct(line.id);
         if (!product) return;
         
         const qty = Number(line.qty || 0);
         const price = Number(product.price || 0);
         const lineTotal = price * qty;
         subtotal += lineTotal;
         
         const imgSrc = resolveProductImage(product);
         
         const li = document.createElement("li");
         li.className = "cart-item";
         li.innerHTML = `
        <img class="cart-item-img" src="${imgSrc}" alt="${product.title}" loading="lazy" decoding="async">
        <div class="cart-item-info">
          <h3 class="cart-item-title">${product.title}</h3>
          <p class="cart-item-price">
            ${money(price)} <span style="opacity:.75;">×</span> ${qty}
          </p>
        </div>
        <div class="cart-item-total">${money(lineTotal)}</div>
      `;
         
         listEl.appendChild(li);
      });
      
      subtotalEl.textContent = money(subtotal);
      payBtn.disabled = subtotal <= 0;
   };
   
   // Re-render if cart updates elsewhere
   window.addEventListener("cart:updated", render);
   
   // Redirect to Helcim hosted checkout
   payBtn.addEventListener("click", () => {
      const cart = window.BKCart?.readCart?.();
      if (!cart || !cart.items.length) return;
      
      const subtotal = cart.items.reduce((sum, it) => {
         const product = window.BKProducts?.[it.id];
         if (!product) return sum;
         return sum + Number(product.price || 0) * Number(it.qty || 0);
      }, 0);
      
      const amount = subtotal.toFixed(2);
      
      // Simple order reference for bookkeeping
      const orderRef = `BK-${Date.now()}`;
      
      // Save for thanks.html to display after redirect (optional)
      try {
         localStorage.setItem(
            "bk_last_order",
            JSON.stringify({ orderRef, amount, at: Date.now() })
         );
      } catch {}
      
      const url =
      `${HELCIM_BASE_URL}` +
      `&amount=${encodeURIComponent(amount)}` +
      `&description=${encodeURIComponent(orderRef)}`;
      
      window.location.href = url;
   });
   
   render();
});
