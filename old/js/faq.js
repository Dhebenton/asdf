document.addEventListener("DOMContentLoaded", () => {
     const faqs = document.querySelectorAll("#faq .faq");

     function activateFAQ(selected) {
          faqs.forEach(faq => {
               const wrap = faq.querySelector(".wrap");
               const isActive = faq === selected;

               faq.classList.toggle("active", isActive);
               wrap.style.height = isActive
                    ? `${wrap.scrollHeight}px`
                    : "0px";
          });
     }

     if (!faqs.length) return;

     activateFAQ(faqs[0]);

     faqs.forEach(faq => {
          faq.addEventListener("mouseenter", () => {
               if (!faq.classList.contains("active")) {
                    activateFAQ(faq);
               }
          });

          faq.addEventListener("click", () => {
               activateFAQ(faq);
          });
     });

     window.addEventListener("resize", () => {
          const active = document.querySelector("#faq .faq.active");
          if (active) {
               const wrap = active.querySelector(".wrap");
               wrap.style.height = `${wrap.scrollHeight}px`;
          }
     });

     
/* ============================================================
   POINTERS
============================================================ */

function initPointers() {
     const pointers = document.querySelectorAll("#pointers .pointer");

     if (!pointers.length) return;

     function activatePointer(selected) {
          pointers.forEach(pointer => {
               const wrap = pointer.querySelector(".text-wrap");
               const isActive = pointer === selected;

               pointer.classList.toggle("active", isActive);
               wrap.style.height = isActive
                    ? `${wrap.scrollHeight}px`
                    : "0px";
          });
     }

     // First pointer active on load
     activatePointer(pointers[0]);

     // Change active pointer on hover
     pointers.forEach(pointer => {
          pointer.addEventListener("mouseenter", () => {
               if (!pointer.classList.contains("active")) {
                    activatePointer(pointer);
               }
          });

          // Touch support
          pointer.addEventListener("click", () => {
               activatePointer(pointer);
          });
     });

     // Recalculate active height on resize
     window.addEventListener("resize", () => {
          const active = document.querySelector("#pointers .pointer.active");
          if (active) {
               const wrap = active.querySelector(".text-wrap");
               wrap.style.height = `${wrap.scrollHeight}px`;
          }
     });
}

initPointers();

});
