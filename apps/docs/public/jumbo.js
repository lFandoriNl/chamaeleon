document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="absolute inset-0 overflow-hidden">
      <div class="jumbo absolute -inset-[10px] opacity-50"></div>
    </div>`,
  );
});
