document.addEventListener("DOMContentLoaded", () => {
	const desktopHeader = document.querySelector(".desktop-header");
	const mobileHeader = document.querySelector(".mobile-header");
	const overlay = document.querySelector(".nav-overlay");

	if (!desktopHeader && !mobileHeader) return;

	// Try common hero selectors (safe across pages)
	const hero =
		document.querySelector("[data-hero]") ||
		document.querySelector(".hero") ||
		document.querySelector(".custom-hero-banner") ||
		document.querySelector(".products-hero-banner") ||
		document.querySelector(".product-details-hero") ||
		document.querySelector(".cart-details-hero");

	let ticking = false;

	const isMenuOpen = () => overlay?.classList.contains("open");

	const updateHeaders = () => {
		ticking = false;

		// If no hero, don't auto-hide headers
		if (!hero) return;

		// Keep headers visible while menu is open
		if (isMenuOpen()) {
			desktopHeader?.classList.remove("hide-nav");
			mobileHeader?.classList.remove("hide-nav");
			return;
		}

		const hidePoint = hero.offsetHeight * 0.5;
		const shouldHide = window.scrollY > hidePoint;

		desktopHeader?.classList.toggle("hide-nav", shouldHide);
		mobileHeader?.classList.toggle("hide-nav", shouldHide);
	};

	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(updateHeaders);
	};

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", updateHeaders, { passive: true });

	// Initial state
	updateHeaders();
});
