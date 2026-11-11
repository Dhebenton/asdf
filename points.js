
document.addEventListener("DOMContentLoaded", () => {
     initPointers();
});

function initPointers() {
     const pointers = document.querySelectorAll("#pointers .pointer");

     if (!pointers.length) return;

     function activatePointer(selected) {
          pointers.forEach(pointer => {
               const wrap = pointer.querySelector(".text-wrap");
               const isActive = pointer === selected;

               pointer.classList.toggle("active", isActive);

               if (wrap) {
                    wrap.style.height = isActive
                         ? `${wrap.scrollHeight}px`
                         : "0px";
               }
          });
     }

     // First pointer active on load
     activatePointer(pointers[0]);

     // Change active pointer on hover or click
     pointers.forEach(pointer => {
          pointer.addEventListener("mouseenter", () => {
               if (!pointer.classList.contains("active")) {
                    activatePointer(pointer);
               }
          });

          pointer.addEventListener("click", () => {
               activatePointer(pointer);
          });
     });

     // Recalculate active height on resize
     window.addEventListener("resize", () => {
          const active = document.querySelector("#pointers .pointer.active");

          if (active) {
               const wrap = active.querySelector(".text-wrap");

               if (wrap) {
                    wrap.style.height = `${wrap.scrollHeight}px`;
               }
          }
     });
}
