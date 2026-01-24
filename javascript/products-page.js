// products-page.js
document.addEventListener("DOMContentLoaded", () => {
   const grid = document.getElementById("productsGrid");
   if (!grid) return;
   
   const catalog = window.BKProducts || {};
   const ids = Object.keys(catalog);
   
   // Sort by your manual order field
   ids.sort((a, b) => (catalog[a].order ?? 999) - (catalog[b].order ?? 999));
   
   const money = (n) => `$${Number(n || 0).toFixed(2)}`;
   const FALLBACK = "Photos/icons/under-construction.webp";
   
   // If you pass in "...-240.webp" this returns "...-360.webp" etc.
   const variant = (thumb240, w) => thumb240.replace("-240.webp", `-${w}.webp`);
   
   const isThumb240 = (url = "") => url.endsWith("-240.webp");
   
   const buildThumbSrcSet = (thumb240) => {
      // Assumes you actually created these files
      return [
         `${thumb240} 240w`,
         `${variant(thumb240, 360)} 360w`,
         `${variant(thumb240, 480)} 480w`,
         `${variant(thumb240, 640)} 640w`,
      ].join(", ");
   };
   
   grid.innerHTML = "";
   
   ids.forEach((id) => {
      const p = catalog[id];
      if (!p) return;
      
      const li = document.createElement("li");
      const inStock = p.inStock !== false;
      
      // Prefer thumb, then image, then fallback
      const t = p.thumb || p.image || FALLBACK;
      
      // Key change:
      // This tells the browser: on desktop, this image slot is ~600px wide,
      // so it should pick the 640w thumb (your “Option B” effect).
      const sizes = "(max-width: 700px) 92vw, 600px";
      
      const imgHtml = isThumb240(t)
      ? `
         <img
            src="${variant(t, 640)}"
            srcset="${buildThumbSrcSet(t)}"
            sizes="${sizes}"
            alt="${p.title}"
            loading="lazy"
            decoding="async"
            width="400"
            height="320"
         />
      `
      : `
            <img
            src="${t}"
            alt="${p.title}"
            loading="lazy"
            decoding="async"
            width="400"
            height="320"
         />
      `;
      
      li.innerHTML = `
      <a class="product-card" href="product-details.html?id=${encodeURIComponent(
      id
   )}" aria-label="View ${p.title}">
        ${imgHtml}
        <h2>${p.title}</h2>
        <p class="price">${money(p.price)}</p>
      </a>
    `;
   
   if (!inStock) {
      li.querySelector(".product-card")?.classList.add("is-out");
   }
   
   grid.appendChild(li);
});
});
