// product-details.js

document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Pull elements
  const cardEl = $(".product-detail-card");
  const titleEl = $("#productTitle");
  const priceEl = $("#productPrice");
  const descEl = $("#productDesc");
  const imgEl = $("#productImage");
  const specsEl = $("#productSpecs");
  const crumbEl = $("#breadcrumbProduct");
  const addBtn = $("#addToCartBtn");
  const thumbsEl = $(".product-detail-thumbs");

  const FALLBACK_IMG = "Photos/icons/under-construction.webp";

  /* =========================================================
     Helpers for your image naming:
     base = "Photos/products/product-001/product1-1"
     files: base-640.webp, base-960.webp, base-1280.webp
     ========================================================= */
  const buildSrcSet = (base) =>
    `${base}-640.webp 640w, ${base}-960.webp 960w, ${base}-1280.webp 1280w`;

  const pickFallbackSrc = (base) => `${base}-960.webp`;

  const looksLikeFullFile = (s) => /\.(avif|webp|jpe?g|png|gif|svg)$/i.test(s || "");

  const setMainImage = (srcOrBase) => {
    if (!imgEl) return;

    // Empty? fallback
    if (!srcOrBase) {
      imgEl.removeAttribute("srcset");
      imgEl.removeAttribute("sizes");
      imgEl.src = FALLBACK_IMG;
      return;
    }

    // If it's already a full filename (ends with .webp/.jpg/etc), use as-is
    // (This supports product-009 which only has "image": "...something.webp")
    if (looksLikeFullFile(srcOrBase) || srcOrBase === FALLBACK_IMG) {
      imgEl.removeAttribute("srcset");
      imgEl.removeAttribute("sizes");
      imgEl.src = srcOrBase;
      return;
    }

    // Otherwise treat it as a base path and apply srcset
    imgEl.src = pickFallbackSrc(srcOrBase);
    imgEl.srcset = buildSrcSet(srcOrBase);
    imgEl.sizes = "(max-width: 900px) 100vw, 660px";
  };

  /* =========================================================
     Get product from URL (?id=product-001)
     ========================================================= */
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = productId ? window.BKProducts?.[productId] : null;

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

  /* =========================================================
     TEXT CONTENT
     ========================================================= */
  if (titleEl) titleEl.textContent = product.title;
  if (priceEl) priceEl.textContent = `$${Number(product.price).toFixed(2)}`;
  if (descEl) descEl.textContent = product.description || "";
  if (crumbEl) crumbEl.textContent = product.title;

  document.title = `${product.title} – B&K Custom Woodworks`;

  /* =========================================================
     IMAGE LOGIC
     ========================================================= */
  // Prefer product.images[] (multiple). Otherwise fall back to product.image (single) or FALLBACK.
  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.image || FALLBACK_IMG];

  let currentIndex = 0;

  // Main image (LCP)
  if (imgEl) {
    imgEl.alt = product.title;

    // LCP hints
    imgEl.loading = "eager";
    imgEl.fetchPriority = "high";
    imgEl.decoding = "async";

    setMainImage(images[0]);
  }

  // Thumbnails (images[1]–images[3])
  if (thumbsEl) {
    thumbsEl.innerHTML = "";

    images.slice(1, 4).forEach((srcOrBase, index) => {
      const btn = document.createElement("button");
      btn.className = "product-thumb";
      btn.type = "button";
      btn.setAttribute("aria-label", `Thumbnail ${index + 1}`);

      const img = document.createElement("img");

      // If this is a "base", use -640.webp. If it's a full filename, use it directly.
      img.src = looksLikeFullFile(srcOrBase) ? srcOrBase : `${srcOrBase}-640.webp`;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";

      btn.appendChild(img);

      btn.addEventListener("click", () => {
        currentIndex = index + 1;
        setMainImage(images[currentIndex]);

        thumbsEl
          .querySelectorAll(".product-thumb")
          .forEach((b) => b.classList.remove("is-active"));

        btn.classList.add("is-active");
      });

      thumbsEl.appendChild(btn);
    });
  }

  // Click main image to cycle (mobile-friendly)
  if (imgEl && images.length > 1) {
    imgEl.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      setMainImage(images[currentIndex]);

      if (thumbsEl) {
        thumbsEl
          .querySelectorAll(".product-thumb")
          .forEach((b) => b.classList.remove("is-active"));

        const thumbIndex = currentIndex - 1;
        const thumbButtons = thumbsEl.querySelectorAll(".product-thumb");

        if (thumbIndex >= 0 && thumbIndex < thumbButtons.length) {
          thumbButtons[thumbIndex].classList.add("is-active");
        }
      }
    });
  }

  /* =========================================================
     SPECS
     ========================================================= */
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

  /* =========================================================
     CART
     ========================================================= */
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
