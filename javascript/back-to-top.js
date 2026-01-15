document.addEventListener("DOMContentLoaded", () => {
	const button = document.querySelector(".back-to-top");
	if (!button) return;

	let ticking = false;

	const updateVisibility = () => {
		ticking = false;

		const show = window.scrollY > 400;
		button.style.opacity = show ? "1" : "0";
		button.style.pointerEvents = show ? "auto" : "none";
	};

	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(updateVisibility);
	};

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", updateVisibility, { passive: true });

	// Smooth scroll back to top
	button.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	// Initial state
	updateVisibility();
});
