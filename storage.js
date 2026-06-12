/* ===================================================
   storage.js
   จัดการข้อมูล Backlist ด้วย localStorage
   =================================================== */

const Storage = (() => {
  const KEY = 'blacklist_entries_v1';

  function _read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('อ่านข้อมูลผิดพลาด', err);
      return [];
    }
  }

  function _write(entries) {
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
      return true;
    } catch (err) {
      console.error('บันทึกข้อมูลผิดพลาด', err);
      return false;
    }
  }

  function getAll() {
    return _read().sort((a, b) => b.createdAt - a.createdAt);
  }

  function getById(id) {
    return _read().find(e => e.id === id) || null;
  }

  function add(entry) {
    const entries = _read();
    const newEntry = {
      id: 'e_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      name: entry.name || '',
      contact: entry.contact || '',
      tag: entry.tag || 'อื่นๆ',
      desc: entry.desc || '',
      evidenceUrl: entry.evidenceUrl || '',
      reporter: entry.reporter || 'ไม่ระบุชื่อ',
      verified: false,
      createdAt: Date.now()
    };
    entries.push(newEntry);
    _write(entries);
    return newEntry;
  }

  function update(id, changes) {
    const entries = _read();
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    entries[idx] = { ...entries[idx], ...changes };
    _write(entries);
    return entries[idx];
  }

  function remove(id) {
    let entries = _read();
    const before = entries.length;
    entries = entries.filter(e => e.id !== id);
    _write(entries);
    return entries.length < before;
  }

  function clearAll() {
    _write([]);
  }

  function count() {
    return _read().length;
  }

  function countToday() {
    const todayStr = new Date().toDateString();
    return _read().filter(e => new Date(e.createdAt).toDateString() === todayStr).length;
  }

  function countByTag(tag) {
    return _read().filter(e => e.tag === tag).length;
  }

  function seedDemoData() {
    if (_read().length > 0) return;
    const demo = [
      {
        name: 'นางสาวน้ำฝน xxxxxx',
        contact: 'บัญชี: ธ.กรุงไทย xxx-x-x4567-x',
        tag: 'ไม่ส่งของ',
        desc: 'โอนเงินซื้อกระเป๋าแบรนด์เนมมือสองแล้วไม่ส่งของ ปิดการติดต่อหลังรับเงิน',
        reporter: 'ผู้เสียหาย A'
      },
      {
        name: 'เพจ Korea Shop xxxx',
        contact: 'เบอร์: 08x-xxx-x231',
        tag: 'หลอกโอนเงิน',
        desc: 'อ้างว่าพรีออเดอร์ของจากเกาหลี เก็บเงินมัดจำแล้วเชิดหนี',
        reporter: 'ผู้เสียหาย B'
      },
      {
        name: 'ID Line: minnnxxxx',
        contact: 'Line ID',
        tag: 'ของไม่ตรงปก',
        desc: 'สั่งเสื้อผ้าตามรูป ได้ของจริงคุณภาพต่ำกว่ารูปมาก ไม่รับเปลี่ยน/คืน',
        reporter: 'ผู้เสียหาย C'
      },
      {
        name: 'บริษัท Forex Easy Profit',
        contact: 'เว็บไซต์ลงทุน',
        tag: 'หลอกลงทุน',
        desc: 'ชักชวนลงทุนผลตอบแทนสูงเกินจริง ปิดเว็บหนีหลังระดมทุน',
        reporter: 'ผู้เสียหาย D'
      }
    ];
    demo.forEach((d, i) => {
      const e = add(d);
      // ปรับวันที่ย้อนหลังเล็กน้อยเพื่อความสมจริง
      update(e.id, { createdAt: Date.now() - i * 86400000 });
    });
  }

  return {
    getAll,
    getById,
    add,
    update,
    remove,
    clearAll,
    count,
    countToday,
    countByTag,
    seedDemoData
  };
})();
