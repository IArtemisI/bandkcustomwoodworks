// nav.js — shared navigation behavior (mobile + overlay)

document.addEventListener("DOMContentLoaded", () => {
	const $ = (sel, root = document) => root.querySelector(sel);
	const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

	const hamburger = $(".hamburger");
	const overlay = $(".nav-overlay");
	const desktopHeader = $(".desktop-header");
	const mobileHeader = $(".mobile-header");

	if (!hamburger || !overlay) return;

	const isMenuOpen = () => overlay.classList.contains("open");

	const openMenu = () => {
		overlay.classList.add("open");
		hamburger.classList.add("open");
		hamburger.setAttribute("aria-expanded", "true");

		// Ensure headers stay visible while menu is open
		desktopHeader?.classList.remove("hide-nav");
		mobileHeader?.classList.remove("hide-nav");
	};

	const closeMenu = () => {
		overlay.classList.remove("open");
		hamburger.classList.remove("open");
		hamburger.setAttribute("aria-expanded", "false");
	};

	const toggleMenu = () => (isMenuOpen() ? closeMenu() : openMenu());

	// Toggle via hamburger
	hamburger.addEventListener("click", toggleMenu);

	// Close when clicking any overlay link
	$$(".nav-overlay a").forEach((link) => {
		link.addEventListener("click", closeMenu);
	});

	// Close on Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isMenuOpen()) {
			closeMenu();
		}
	});

	// Safety: close menu if switching to desktop view
	window.addEventListener(
		"resize",
		() => {
			if (window.innerWidth >= 900 && isMenuOpen()) {
				closeMenu();
			}
		},
		{ passive: true }
	);
});
