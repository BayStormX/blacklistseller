/* ===================================================
   storage.js
   ຈັດການຂໍ້ມູນ Backlist ດ້ວຍ localStorage
   =================================================== */

const Storage = (() => {
  const KEY = 'blacklist_entries_v1';

  function _read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('ອ່ານຂໍ້ມູນຜິດພາດ', err);
      return [];
    }
  }

  function _write(entries) {
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
      return true;
    } catch (err) {
      console.error('ບັນທຶກຂໍ້ມູນຜິດພາດ', err);
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
      tag: entry.tag || 'ອື່ນໆ',
      desc: entry.desc || '',
      evidenceUrl: entry.evidenceUrl || '',
      reporter: entry.reporter || 'ບໍ່ລະບຸຊື່',
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
        name: 'ນາງສາວ xxxxxx',
        contact: 'ບັນຊີ: ທ.ກຣຸງໄທ xxx-x-x4567-x',
        tag: 'ບໍ່ສົ່ງສິນຄ້າ',
        desc: 'ໂອນເງິນຊື້ກະເປົ໋າມືສອງແລ້ວບໍ່ສົ່ງສິນຄ້າ ປິດການຕິດຕໍ່ຫຼັງຮັບເງິນ',
        reporter: 'ຜູ້ເສຍຫາຍ A'
      },
      {
        name: 'ເພດ Korea Shop xxxx',
        contact: 'ເບີ: 08x-xxx-x231',
        tag: 'ຫລອກໂອນເງິນ',
        desc: 'ອ້າງວ່າພຣີອໍເດີຈາກເກົາຫຼີ ເກັບເງິນມັດຈຳແລ້ວໜີ',
        reporter: 'ຜູ້ເສຍຫາຍ B'
      },
      {
        name: 'ID Line: minnnxxxx',
        contact: 'Line ID',
        tag: 'ສິນຄ້າບໍ່ຕົງປົກ',
        desc: 'ສັ່ງເຄື່ອງນຸ່ງຕາມຮູບ ໄດ້ຂອງຈິງຄຸນນະພາບຕ່ຳ ບໍ່ຮັບປ່ຽນ/ຄືນ',
        reporter: 'ຜູ້ເສຍຫາຍ C'
      },
      {
        name: 'ບໍລິສັດ Forex Easy Profit',
        contact: 'ເວັບໄຊລົງທຶນ',
        tag: 'ຫລອກລົງທຶນ',
        desc: 'ຊັກຊວນລົງທຶນຜົນຕອບແທນສູງ ປິດເວັບໜີຫຼັງລະດົມທຶນ',
        reporter: 'ຜູ້ເສຍຫາຍ D'
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
