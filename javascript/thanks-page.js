// thanks-page.js
// Handles checkout return + contact form thank-you logic

document.addEventListener("DOMContentLoaded", () => {
	const titleEl = document.getElementById("thanksTitle");
	const textEl = document.getElementById("thanksText");

	if (!titleEl || !textEl) return;

	const params = new URLSearchParams(window.location.search);

	const cameFromCheckout =
		document.referrer.includes("myhelcim.com") ||
		params.has("payment") ||
		params.has("status") ||
		params.has("transaction") ||
		params.has("invoice");

	if (!cameFromCheckout) return;

	// Pull saved order info (if present)
	let last = null;
	try {
		last = JSON.parse(localStorage.getItem("bk_last_order") || "null");
	} catch {}

	// Clear cart
	if (window.BKCart?.writeCart) {
		window.BKCart.writeCart({ items: [] });
	} else {
		try {
			localStorage.setItem("bk_cart_v1", JSON.stringify({ items: [] }));
		} catch {}
	}

	// Force badge update immediately
	try {
		window.dispatchEvent(new CustomEvent("cart:updated"));
	} catch {}

	// Update messaging
	titleEl.textContent = "Order Confirmed";

	const orderLine = last?.orderRef
		? `<br><br><strong>Order #:</strong> ${last.orderRef}`
		: "";

	const amountLine = last?.amount
		? `<br><strong>Total:</strong> $${last.amount}`
		: "";

	textEl.innerHTML =
		"Thanks for your purchase!<br>Your payment was received and we’ll be in touch soon with next steps." +
		orderLine +
		amountLine;

	// Clear saved order so it doesn't persist
	try {
		localStorage.removeItem("bk_last_order");
	} catch {}
});
