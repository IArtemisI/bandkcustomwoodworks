// custom-boards.js — Custom Board Builder page logic (wizard + validation + review)

document.addEventListener("DOMContentLoaded", () => {
   const $ = (sel, root = document) => root.querySelector(sel);
   const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
   
   /* =========================================================
   Auto-grow textareas (any textarea with class cb-autogrow)
   ========================================================= */
   const autoGrow = (ta) => {
      if (!ta) return;
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
   };
   
   document.querySelectorAll("textarea.cb-autogrow").forEach((ta) => {
      ta.addEventListener("input", () => autoGrow(ta));
      requestAnimationFrame(() => autoGrow(ta)); // autofill/history restore
   });
   
   /* =========================================================
   Wizard elements
   ========================================================= */
   const tabs = $$(".custom-board-tab");
   const slides = $$(".custom-board-slide");
   const nextBtn = $(".custom-board-next");
   const backBtn = $(".custom-board-back");
   const underline = $(".custom-board-underline");
   const tabsNav = $(".custom-board-tabs");
   const form = $(".custom-board-form form");
   
   // If this page doesn't have the wizard markup, do nothing
   if (!tabs.length || !slides.length) return;
   
   let currentStep = 1;
   const totalSteps = slides.length;
   
   /* -- Scroll to tabs when step changes -- */
   const scrollToTabs = () => {
      if (!tabsNav) return;
      const isMobile = window.matchMedia("(max-width: 700px)").matches;
      const yOffset = isMobile ? -70 : -150;
      const y =
      tabsNav.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: "smooth" });
   };
   
   /* --Underline positioning --*/
   const moveUnderline = () => {
      const activeTab = $(".custom-board-tab.active");
      if (!activeTab || !underline) return;
      
      const tabRect = activeTab.getBoundingClientRect();
      const navRect = activeTab.parentElement.getBoundingClientRect();
      
      underline.style.width = `${tabRect.width}px`;
      underline.style.transform = `translateX(${tabRect.left - navRect.left}px)`;
   };
   
   /* -- Prevent Enter from submitting on steps 1–(totalSteps-1) -- */
   if (form) {
      form.addEventListener("keydown", (e) => {
         if (e.key !== "Enter") return;
         
         const isTextarea = e.target && e.target.tagName === "TEXTAREA";
         if (isTextarea) return;
         
         if (currentStep !== totalSteps) e.preventDefault();
      });
   }
   
   /* =========================================================
   Step 1: Phone formatting + validation gate
   ========================================================= */
   const nameInput = $('[name="name"]');
   const emailInput = $('[name="email"]');
   const phoneInput = $('[name="phone"]');
   const contactErrorMsg = $("#contact-error");
   
   const setError = (el, isError) => {
      if (!el) return;
      el.classList.toggle("cb-error", isError);
   };
   
   const formatPhone = (value) => {
      let digits = (value || "").replace(/\D/g, "");
      
      if (digits.startsWith("1") && digits.length > 10) {
         digits = digits.slice(1);
      }
      
      digits = digits.slice(0, 10);
      
      const a = digits.slice(0, 3);
      const b = digits.slice(3, 6);
      const c = digits.slice(6, 10);
      
      if (digits.length > 6) return `${a}-${b}-${c}`;
      if (digits.length > 3) return `${a}-${b}`;
      return a;
   };
   
   const validateStep1 = (showUI = true) => {
      const fields = [nameInput, emailInput, phoneInput].filter(Boolean);
      let allValid = true;
      
      fields.forEach((field) => {
         const valid = field.checkValidity();
         allValid = allValid && valid;
         if (showUI) setError(field, !valid);
      });
      
      if (contactErrorMsg && showUI) {
         contactErrorMsg.style.display = allValid ? "none" : "block";
      }
      
      return allValid;
   };
   
   if (phoneInput) {
      phoneInput.addEventListener("input", () => {
         phoneInput.value = formatPhone(phoneInput.value);
         setError(phoneInput, !phoneInput.checkValidity());
         if (contactErrorMsg) {
            contactErrorMsg.style.display = validateStep1(false) ? "none" : "block";
         }
      });
      
      phoneInput.addEventListener("blur", () => {
         phoneInput.value = formatPhone(phoneInput.value);
         
         const digits = phoneInput.value.replace(/\D/g, "");
         if (digits.length && digits.length < 10) phoneInput.value = "";
         
         setError(phoneInput, !phoneInput.checkValidity());
         if (contactErrorMsg) {
            contactErrorMsg.style.display = validateStep1(false) ? "none" : "block";
         }
      });
   }
   
   [nameInput, emailInput].forEach((field) => {
      if (!field) return;
      
      const update = () => {
         setError(field, !field.checkValidity());
         if (contactErrorMsg) {
            contactErrorMsg.style.display = validateStep1(false) ? "none" : "block";
         }
      };
      
      field.addEventListener("input", update);
      field.addEventListener("blur", update);
   });
   
   /* Review step population (final step) */
   const getValue = (name) => $(`[name="${name}"]`)?.value?.trim() || "—";
   
   const populateReview = () => {
      // Contact
      const reviewContactEl = $("#review-contact");
      if (reviewContactEl) {
         reviewContactEl.textContent = `${getValue("name")} • ${getValue(
            "email"
         )} • ${getValue("phone")}`;
      }
      
      // Size
      const reviewSizeEl = $("#review-size");
      if (reviewSizeEl) {
         reviewSizeEl.textContent = `${getValue("length")} × ${getValue(
            "width"
         )} × ${getValue("height")}`;
      }
      
      // Woods (checkboxes + other)
      const woodsContainer = $("#review-woods");
      if (woodsContainer) {
         woodsContainer.innerHTML = "";
         
         const woodsChecked = $$('[name="woods[]"]:checked')
         .map((i) =>
            i.closest("label")?.querySelector("span")?.textContent?.trim()
      )
      .filter(Boolean);
      
      const otherWood = $('[name="other_wood"]')?.value?.trim();
      
      if (woodsChecked.length) {
         const p = document.createElement("p");
         p.textContent = woodsChecked.join(", ");
         woodsContainer.appendChild(p);
      }
      
      if (otherWood) {
         const p = document.createElement("p");
         p.classList.add("review-other");
         p.textContent = `Custom request: ${otherWood}`;
         woodsContainer.appendChild(p);
      }
      
      if (!woodsChecked.length && !otherWood) woodsContainer.textContent = "—";
   }
   
   // Patterns (checkboxes + other)
   const patternsContainer = $("#review-pattern");
   if (patternsContainer) {
      patternsContainer.innerHTML = "";
      
      const patternsChecked = $$('[name="patterns[]"]:checked')
      .map((i) =>
         i.closest("label")?.querySelector("span")?.textContent?.trim()
   )
   .filter(Boolean);
   
   const otherPattern = $('[name="other_pattern"]')?.value?.trim();
   
   if (patternsChecked.length) {
      const p = document.createElement("p");
      p.textContent = patternsChecked.join(", ");
      patternsContainer.appendChild(p);
   }
   
   if (otherPattern) {
      const p = document.createElement("p");
      p.classList.add("review-other");
      p.textContent = `Custom request: ${otherPattern}`;
      patternsContainer.appendChild(p);
   }
   
   if (!patternsChecked.length && !otherPattern)
      patternsContainer.textContent = "—";
}

// Features
const reviewFeaturesEl = $("#review-features");
if (reviewFeaturesEl) {
   const features =
   $$('[name="features[]"]:checked')
   .map((i) =>
      i.closest("label")?.querySelector("span")?.textContent?.trim()
)
.filter(Boolean)
.join(", ") || "—";

reviewFeaturesEl.textContent = features;
}

// Engraving text
const reviewEngravingEl = $("#review-engraving");
if (reviewEngravingEl)
   reviewEngravingEl.textContent = getValue("engraving");

// Files (from hidden field)
const filesRaw = $('[name="engraving_files_names"]')?.value?.trim() || "";
const reviewFilesEl = $("#review-engraving-files");
if (reviewFilesEl)
   reviewFilesEl.textContent = filesRaw ? `Files: ${filesRaw}` : "Files: —";
};

/*Step switching*/
const showStep = (step, { skipScroll = false } = {}) => {
   currentStep = step;
   
   tabs.forEach((tab) =>
      tab.classList.toggle("active", Number(tab.dataset.step) === step)
);
slides.forEach((slide) =>
   slide.classList.toggle("active", Number(slide.dataset.step) === step)
);

moveUnderline();

if (step === totalSteps) populateReview();

if (backBtn) backBtn.disabled = step === 1;

if (nextBtn) {
   nextBtn.textContent = "Next";
   nextBtn.disabled = step === totalSteps;
}

if (!skipScroll) scrollToTabs();
};

/* Tab clicks + Next/Back*/
tabs.forEach((tab) => {
   tab.addEventListener("click", () => {
      const targetStep = Number(tab.dataset.step);
      
      // Gate leaving Step 1
      if (currentStep === 1 && targetStep > 1 && !validateStep1(true)) {
         const firstBad = [nameInput, emailInput, phoneInput].find(
            (f) => f && !f.checkValidity()
         );
         firstBad?.focus();
         return;
      }
      
      showStep(targetStep);
   });
});

nextBtn?.addEventListener("click", () => {
   if (currentStep === 1 && !validateStep1(true)) {
      const firstBad = [nameInput, emailInput, phoneInput].find(
         (f) => f && !f.checkValidity()
      );
      firstBad?.focus();
      return;
   }
   
   if (currentStep < totalSteps) showStep(currentStep + 1);
});

backBtn?.addEventListener("click", () => {
   if (currentStep > 1) showStep(currentStep - 1);
});

/* =========================================================
Step 6: File names -> UI + hidden field
========================================================= */
const fileInputs = [
   $("#engraving_file_1"),
   $("#engraving_file_2"),
   $("#engraving_file_3"),
].filter(Boolean);

const fileNamesEl = $("#cb-file-names");
const fileNamesHidden = $("#engraving_files_names");

const updateFileNames = () => {
   const names = fileInputs
   .map((input) =>
      input.files && input.files[0] ? input.files[0].name : ""
)
.filter(Boolean);

if (fileNamesEl)
   fileNamesEl.textContent = names.length
? `Selected: ${names.join(", ")}`
: "";
if (fileNamesHidden) fileNamesHidden.value = names.join(", ");
};

fileInputs.forEach((input) =>
   input.addEventListener("change", updateFileNames)
);

// Init
showStep(1, { skipScroll: true });
window.addEventListener(
   "resize",
   () => requestAnimationFrame(moveUnderline),
   { passive: true }
);
});
