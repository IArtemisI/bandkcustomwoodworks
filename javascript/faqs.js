document.addEventListener("DOMContentLoaded", () => {
	const $ = (sel, root = document) => root.querySelector(sel);
	const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

	const items = $$(".faqs-item");
	if (!items.length) return;

	items.forEach((item) => {
		const btn = $(".faqs-q", item);
		const panel = $(".faqs-a", item);
		if (!btn || !panel) return;

		btn.addEventListener("click", () => {
			const isOpen = btn.getAttribute("aria-expanded") === "true";

			// Close others (optional — remove this block if you want multiple open)
			items.forEach((other) => {
				const b = $(".faqs-q", other);
				const p = $(".faqs-a", other);
				if (!b || !p) return;

				b.setAttribute("aria-expanded", "false");
				p.hidden = true;
				other.classList.remove("is-open");
			});

			// Toggle current
			btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
			panel.hidden = isOpen;
			item.classList.toggle("is-open", !isOpen);
		});
	});
});
