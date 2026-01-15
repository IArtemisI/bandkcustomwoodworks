document.addEventListener("DOMContentLoaded", () => {
	const elements = document.querySelectorAll(".fade-in, .fade-in-section");

	if (!elements.length) return;

	// If IntersectionObserver is supported
	if ("IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;

					entry.target.classList.add("visible");
					obs.unobserve(entry.target); // animate once
				});
			},
			{
				threshold: 0.2, // element is ~20% visible before revealing
			}
		);

		elements.forEach((el) => observer.observe(el));
	} else {
		// Fallback: just show everything
		elements.forEach((el) => el.classList.add("visible"));
	}
});
