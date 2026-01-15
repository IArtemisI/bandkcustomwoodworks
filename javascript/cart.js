/* cart.js
Simple cart storage for a static site.
Stores items in localStorage under CART_KEY.
*/

(() => {
	const CART_KEY = "bk_cart_v1";

	function readCart() {
		try {
			const raw = localStorage.getItem(CART_KEY);
			const cart = raw ? JSON.parse(raw) : { items: [] };
			if (!cart.items) cart.items = [];
			return cart;
		} catch {
			return { items: [] };
		}
	}

	function writeCart(cart) {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
		window.dispatchEvent(new CustomEvent("cart:updated"));
	}

	function getItemIndex(cart, id) {
		return cart.items.findIndex((it) => it.id === id);
	}

	function addToCart(id, qty = 1) {
		const cart = readCart();
		const idx = getItemIndex(cart, id);

		if (idx === -1) {
			cart.items.push({ id, qty });
		} else {
			cart.items[idx].qty += qty;
		}

		writeCart(cart);
	}

	function getCartCount() {
		const cart = readCart();
		return cart.items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
	}

	function updateCartBadges() {
		const count = getCartCount();

		document.querySelectorAll("[data-cart-count]").forEach((el) => {
			el.textContent = String(count);

			// Always show the badge, even when 0
			el.style.display = "inline-flex";

			// Optional: dim when empty
			el.style.opacity = "1";
		});
	}

	// Expose a tiny API to other scripts/pages
	window.BKCart = {
		readCart,
		writeCart,
		addToCart,
		getCartCount,
		updateCartBadges,
	};

	// Keep badges updated
	document.addEventListener("DOMContentLoaded", updateCartBadges);
	window.addEventListener("cart:updated", updateCartBadges);
})();
