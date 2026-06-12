/* ===================================================
   toast.js
   ระบบแจ้งเตือนแบบ toast
   =================================================== */

const Toast = (() => {
  let container = null;

  function _ensureContainer() {
    if (container) return container;
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
    return container;
  }

  function show(message, type = 'success', duration = 2500) {
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' toast-error' : '');
    el.textContent = message;
    _ensureContainer().appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  function success(message) {
    show(message, 'success');
  }

  function error(message) {
    show(message, 'error');
  }

  return { show, success, error };
})();
