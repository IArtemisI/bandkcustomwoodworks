document.addEventListener("DOMContentLoaded", () => {
   const $ = (sel, root = document) => root.querySelector(sel);
   
   // Pull id from URL (?id=product-001)
   const params = new URLSearchParams(window.location.search);
   const productId = params.get("id");
   const product = productId ? window.BKProducts?.[productId] : null;
   
   const cardEl = $(".product-detail-card");
   const titleEl = $("#productTitle");
   const priceEl = $("#productPrice");
   const descEl = $("#productDesc");
   const imgEl = $("#productImage");
   const specsEl = $("#productSpecs");
   const crumbEl = $("#breadcrumbProduct");
   const addBtn = $("#addToCartBtn");
   
   const renderNotFound = () => {
      if (cardEl) {
         cardEl.innerHTML = `
        <h2>Product not found</h2>
        <p>This item may no longer be available.</p>
        <a href="products.html" class="shop-banner-button">Back to Shop</a>
      `;
      }
      if (crumbEl) crumbEl.textContent = "Product Not Found";
      document.title = "Product Not Found – B&K Custom Woodworks";
   };
   
   if (!product) {
      renderNotFound();
      return;
   }
   
   // Populate content
   if (titleEl) titleEl.textContent = product.title;
   if (priceEl) priceEl.textContent = `$${Number(product.price).toFixed(2)}`;
   if (descEl) descEl.textContent = product.description || "";
   if (crumbEl) crumbEl.textContent = product.title;
   
   document.title = `${product.title} – B&K Custom Woodworks`;
   
   if (imgEl) {
      imgEl.src = product.image;
      imgEl.alt = product.title;
   }
   
   // Specs list
   if (specsEl) {
      specsEl.innerHTML = "";
      (product.specs || []).forEach((spec) => {
         const li = document.createElement("li");
         const idx = spec.indexOf(":");
         
         if (idx !== -1) {
            const label = spec.slice(0, idx + 1);
            const value = spec.slice(idx + 1).trim();
            li.innerHTML = `<strong>${label}</strong> ${value}`;
         } else {
            li.textContent = spec;
         }
         
         specsEl.appendChild(li);
      });
   }
   
   // Stock + Add to Cart
   const inStock = !!product.inStock;
   
   if (addBtn) {
      addBtn.disabled = !inStock;
      addBtn.textContent = inStock ? "Add to Cart" : "Out of Stock";
      
      addBtn.addEventListener("click", () => {
         if (!window.BKCart?.addToCart) return;
         
         window.BKCart.addToCart(productId, 1);
         window.location.href = "cart.html";
      });
   }
});