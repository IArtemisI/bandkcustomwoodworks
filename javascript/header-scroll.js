document.addEventListener("DOMContentLoaded", () => {
   const desktopHeader = document.querySelector(".desktop-header");
   const mobileHeader = document.querySelector(".mobile-header");
   const overlay = document.querySelector(".nav-overlay");
   
   if (!desktopHeader && !mobileHeader) return;
   
   const hero =
   document.querySelector("[data-hero]") ||
   document.querySelector(".hero") ||
   document.querySelector(".custom-hero-banner") ||
   document.querySelector(".products-hero-banner") ||
   document.querySelector(".product-details-hero") ||
   document.querySelector(".cart-details-hero");
   
   // If no hero, don't auto-hide headers
   if (!hero) return;
   
   let ticking = false;
   let hidePoint = 0;
   
   const isMenuOpen = () => overlay?.classList.contains("open");
   
   const recalcHidePoint = () => {
      // Layout read happens here (not during scroll), on load/resize only
      hidePoint = hero.offsetHeight * 0.5;
   };
   
   const updateHeaders = () => {
      ticking = false;
      
      // Keep headers visible while menu is open
      if (isMenuOpen()) {
         desktopHeader?.classList.remove("hide-nav");
         mobileHeader?.classList.remove("hide-nav");
         return;
      }
      
      const shouldHide = window.scrollY > hidePoint;
      desktopHeader?.classList.toggle("hide-nav", shouldHide);
      mobileHeader?.classList.toggle("hide-nav", shouldHide);
   };
   
   const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateHeaders);
   };
   
   // Initial calc + initial state
   recalcHidePoint();
   updateHeaders();
   
   window.addEventListener("scroll", onScroll, { passive: true });
   
   // Recalculate on resize (and then update)
   window.addEventListener(
      "resize",
      () => {
         recalcHidePoint();
         updateHeaders();
      },
      { passive: true }
   );
});
