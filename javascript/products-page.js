document.addEventListener("DOMContentLoaded", () => {
   const grid = document.getElementById("productsGrid");
   if (!grid) return;
   
   const catalog = window.BKProducts || {};
   const ids = Object.keys(catalog);
   
   // Optional: sort by title (remove if you want manual order)
   ids.sort((a, b) => (catalog[a].order ?? 999) - (catalog[b].order ?? 999));
   
   const money = (n) => `$${Number(n || 0).toFixed(2)}`;
   
   grid.innerHTML = "";
   
   ids.forEach((id) => {
      const p = catalog[id];
      if (!p) return;
      
      const li = document.createElement("li");
      
      // If you want out-of-stock to still show, but look different:
      const inStock = p.inStock !== false;
      
      li.innerHTML = `
      <a class="product-card" href="product-details.html?id=${encodeURIComponent(id)}" aria-label="View ${p.title}">
         <img src="${p.image}" alt="${p.title}">
         <h3>${p.title}</h3>
         <p class="price">${money(p.price)}</p>
      </a>
      `;
      
      // Optional: if out of stock, visually “quiet” it
      if (!inStock) {
         li.querySelector(".product-card")?.classList.add("is-out");
      }
      
      grid.appendChild(li);
   });
});