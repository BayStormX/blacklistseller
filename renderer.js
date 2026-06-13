/* ===================================================
   renderer.js
   สร้าง DOM elements สำหรับรายการแบล็กลิสต์
   =================================================== */

const Renderer = (() => {

  function createEntryCard(entry) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.id = entry.id;

    const avClass = Utils.avatarClass(entry.name);
    const initial = Utils.initialChar(entry.name);
    const tagClass = Utils.tagClass(entry.tag);

    card.innerHTML = `
      <div class="entry-left">
        ${entry.imageData ? `<img src="${entry.imageData}" alt="" class="entry-thumb">` : `<div class="avatar ${avClass}" aria-hidden="true">${Utils.escapeHtml(initial)}</div>`}
        <div class="entry-info">
          <div class="entry-name">${Utils.escapeHtml(entry.name)}</div>
          <div class="entry-meta">
            ${entry.contact ? `<span class="meta-item">📌 ${Utils.escapeHtml(entry.contact)}</span>` : ''}
            ${entry.reporter ? `<span class="meta-item">👤 แจ้งโดย ${Utils.escapeHtml(entry.reporter)}</span>` : ''}
          </div>
          ${entry.desc ? `<div class="entry-desc">${Utils.escapeHtml(entry.desc)}</div>` : ''}
          ${entry.evidenceUrl ? `<div class="entry-date"><a href="${Utils.escapeHtml(entry.evidenceUrl)}" target="_blank" rel="noopener noreferrer">ดูหลักฐานเพิ่มเติม ↗</a></div>` : ''}
          <div class="entry-date">แจ้งเมื่อ ${Utils.formatDate(entry.createdAt)}</div>
        </div>
      </div>
      <div class="entry-actions">
        <span class="tag ${tagClass}">${Utils.escapeHtml(entry.tag)}</span>
        <div class="entry-actions-row">
          <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${entry.id}">แก้ไข</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-id="${entry.id}">ลบ</button>
        </div>
      </div>
    `;

    return card;
  }

  function renderEmptyState(message) {
    const div = document.createElement('div');
    div.className = 'empty-msg';
    div.innerHTML = `
      <span class="empty-icon">🔍</span>
      <div>${Utils.escapeHtml(message)}</div>
    `;
    return div;
  }

  function renderList(container, entries, emptyMessage) {
    container.innerHTML = '';
    if (entries.length === 0) {
      container.appendChild(renderEmptyState(emptyMessage || 'ยังไม่มีรายชื่อ ลองเพิ่มรายชื่อแบล็กลิสต์แรกของคุณ'));
      return;
    }
    entries.forEach(entry => container.appendChild(createEntryCard(entry)));
  }

  function updateStats({ total, today, tagCounts }) {
    const totalEl = document.getElementById('totalCount');
    const todayEl = document.getElementById('todayCount');
    const investEl = document.getElementById('investCount');
    const noDeliveryEl = document.getElementById('noDeliveryCount');

    if (totalEl) totalEl.textContent = total;
    if (todayEl) todayEl.textContent = today;
    if (investEl) investEl.textContent = tagCounts['หลอกลงทุน'] || 0;
    if (noDeliveryEl) noDeliveryEl.textContent = tagCounts['ไม่ส่งของ'] || 0;
  }

  return { renderList, updateStats, createEntryCard };
})();
