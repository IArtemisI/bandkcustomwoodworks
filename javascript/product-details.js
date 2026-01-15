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
	const thumbsEl = $(".product-detail-thumbs");

	const FALLBACK_IMG = "Photos/icons/under-construction.webp";

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

	/* -- TEXT CONTENT -- */

	if (titleEl) titleEl.textContent = product.title;
	if (priceEl) priceEl.textContent = `$${Number(product.price).toFixed(2)}`;
	if (descEl) descEl.textContent = product.description || "";
	if (crumbEl) crumbEl.textContent = product.title;

	document.title = `${product.title} – B&K Custom Woodworks`;

	/* -- IMAGE LOGIC -- */

	const images =
		Array.isArray(product.images) && product.images.length
			? product.images
			: [product.image || FALLBACK_IMG];

	let currentIndex = 0;

	if (imgEl) {
		imgEl.src = images[0];
		imgEl.alt = product.title;
	}

	// Build thumbnails (images[1]–images[3])
	if (thumbsEl) {
		thumbsEl.innerHTML = "";

		images.slice(1, 4).forEach((src, index) => {
			const btn = document.createElement("button");
			btn.className = "product-thumb";
			btn.type = "button";
			btn.setAttribute("aria-label", `Thumbnail ${index + 1}`);

			const img = document.createElement("img");
			img.src = src || FALLBACK_IMG;
			img.alt = "";

			btn.appendChild(img);

			btn.addEventListener("click", () => {
				currentIndex = index + 1; // keep cycling logic in sync
				if (imgEl) imgEl.src = images[currentIndex] || FALLBACK_IMG;

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
			imgEl.src = images[currentIndex] || FALLBACK_IMG;

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

	/* -- SPECS -- */

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

	/* -- CART -- */

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
