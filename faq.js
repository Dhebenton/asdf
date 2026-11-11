
document.addEventListener("DOMContentLoaded", () => {
     const faqs = document.querySelectorAll("#faq .faq");

     if (!faqs.length) return;

     function activateFAQ(selected) {
          faqs.forEach(faq => {
               const wrap = faq.querySelector(".wrap");
               const isActive = faq === selected;

               faq.classList.toggle("active", isActive);

               if (wrap) {
                    wrap.style.height = isActive
                         ? `${wrap.scrollHeight}px`
                         : "0px";
               }
          });
     }

     // First FAQ active on load
     activateFAQ(faqs[0]);

     // Change active FAQ on hover or click
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

     // Recalculate active height on resize
     window.addEventListener("resize", () => {
          const active = document.querySelector("#faq .faq.active");

          if (active) {
               const wrap = active.querySelector(".wrap");

               if (wrap) {
                    wrap.style.height = `${wrap.scrollHeight}px`;
               }
          }
     });
});
