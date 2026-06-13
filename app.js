/* ===================================================
   app.js
   ຕົວຄວບຄຸມຫຼັກຂອງແອັບ
   =================================================== */

const App = (() => {
  let listContainer, searchInput, filterChips;
  let currentFilter = 'all';
  let currentQuery = '';

  const TAGS = ['ບໍ່ສົ່ງສິນຄ້າ', 'ຫລອກໂອນເງິນ', 'ສິນຄ້າບໍ່ຕົງປົກ', 'ຫລອກລົງທຶນ', 'ອື່ນໆ'];

  function init() {
    listContainer = document.getElementById('listContainer');
    searchInput = document.getElementById('searchInput');
    filterChips = document.querySelectorAll('.filter-chip');

    Modal.init();

    document.getElementById('addEntryBtn').addEventListener('click', () => AuthGate.run(Modal.openForCreate));
    document.getElementById('addEntryBtnEmpty')?.addEventListener('click', () => AuthGate.run(Modal.openForCreate));

    searchInput.addEventListener('input', Utils.debounce(() => {
      currentQuery = searchInput.value.trim().toLowerCase();
      refresh();
    }, 200));

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.tag;
        refresh();
      });
    });

    listContainer.addEventListener('click', onListClick);

    document.getElementById('exportBtn')?.addEventListener('click', exportData);
    document.getElementById('importBtn')?.addEventListener('click', () => {
      document.getElementById('importFile').click();
    });
    document.getElementById('importFile')?.addEventListener('change', importData);

    // โหลดข้อมูลตัวอย่างถ้ายังไม่มีข้อมูล
    Storage.seedDemoData();

    refresh();
  }

  function onListClick(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'delete') {
      AuthGate.run(() => {
        if (confirm('ຢືນຢັນການລຶບລາຍຊື່ນີ້ອອກຈາກລະບົບ?')) {
          Storage.remove(id);
          Toast.success('ລຶບລາຍຊື່ສຳເລັດ');
          refresh();
        }
      });
    } else if (action === 'edit') {
      AuthGate.run(() => Modal.openForEdit(id));
    }
  }

  function getFilteredEntries() {
    let entries = Storage.getAll();

    if (currentFilter !== 'all') {
      entries = entries.filter(e => e.tag === currentFilter);
    }

    if (currentQuery) {
      entries = entries.filter(e =>
        e.name.toLowerCase().includes(currentQuery) ||
        (e.contact && e.contact.toLowerCase().includes(currentQuery)) ||
        (e.desc && e.desc.toLowerCase().includes(currentQuery)) ||
        (e.reporter && e.reporter.toLowerCase().includes(currentQuery))
      );
    }

    return entries;
  }

  function refresh() {
    const entries = getFilteredEntries();
    const emptyMsg = currentQuery || currentFilter !== 'all'
      ? 'ບໍ່ພົບລາຍຊື່ທີ່ຕົງກັບການຄົ້ນຫາ'
      : 'ຍັງບໍ່ມີລາຍຊື່ ເພີ່ມລາຍຊື່ແບລັກລິດທຳອິດຂອງທ່ານ';

    Renderer.renderList(listContainer, entries, emptyMsg);

    const all = Storage.getAll();
    const tagCounts = {};
    TAGS.forEach(t => tagCounts[t] = 0);
    all.forEach(e => { tagCounts[e.tag] = (tagCounts[e.tag] || 0) + 1; });

    Renderer.updateStats({
      total: all.length,
      today: Storage.countToday(),
      tagCounts
    });

    const countBadge = document.getElementById('listCount');
    if (countBadge) countBadge.textContent = entries.length;
  }

  function exportData() {
    const data = Storage.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blacklist-export-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    Toast.success('ສົ່ງອອກຂໍ້ມູນສຳເລັດ');
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('ຮູບແບບໄຟລ໌ບໍ່ຖືກຕ້ອງ');

        data.forEach(item => {
          Storage.add({
            name: item.name,
            contact: item.contact,
            tag: item.tag,
            desc: item.desc,
            evidenceUrl: item.evidenceUrl,
            reporter: item.reporter
          });
        });

        Toast.success(`ນຳເຂົ້າຂໍ້ມູນ ${data.length} ລາຍການສຳເລັດ`);
        refresh();
      } catch (err) {
        Toast.error('ບໍ່ສາມາດນຳເຂົ້າໄຟລ໌ໄດ້ ກວດສອບຮູບແບບໄຟລ໌');
        console.error(err);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  return { init, refresh };
})();

document.addEventListener('DOMContentLoaded', App.init);
