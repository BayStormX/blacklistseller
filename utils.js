/* ===================================================
   utils.js
   ฟังก์ชันช่วยทั่วไป
   =================================================== */

const Utils = (() => {

  // ป้องกัน XSS เมื่อแสดงข้อความจากผู้ใช้
  function escapeHtml(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  // แปลง timestamp เป็นข้อความวันที่ภาษาไทยแบบสั้น
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'เมื่อสักครู่';
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
    if (diffDay < 7) return `${diffDay} วันที่แล้ว`;

    return date.toLocaleDateString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  // map แท็กเป็น class สี
  function tagClass(tag) {
    const map = {
      'ไม่ส่งของ': 'tag-no-delivery',
      'หลอกโอนเงิน': 'tag-scam-transfer',
      'ของไม่ตรงปก': 'tag-not-as-described',
      'หลอกลงทุน': 'tag-investment-scam',
      'อื่นๆ': 'tag-other'
    };
    return map[tag] || 'tag-other';
  }

  // สุ่ม class สี avatar แบบ deterministic จากชื่อ
  const avatarPalette = ['av-coral', 'av-blue', 'av-amber', 'av-pink', 'av-mint', 'av-purple'];
  function avatarClass(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) % avatarPalette.length;
    }
    return avatarPalette[Math.abs(hash)];
  }

  function initialChar(name) {
    const trimmed = (name || '').trim();
    return trimmed ? trimmed.charAt(0) : '?';
  }

  // debounce สำหรับการค้นหา
  function debounce(fn, delay = 250) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // mask ข้อมูลติดต่อเล็กน้อยเพื่อความเป็นส่วนตัว (ทางเลือก)
  function maskContact(str) {
    if (!str) return '';
    return str.replace(/(\d{3})\d+(\d{2})/, '$1xxxxx$2');
  }

  return {
    escapeHtml,
    formatDate,
    tagClass,
    avatarClass,
    initialChar,
    debounce,
    maskContact
  };
})();
