/* ===================================================
   modal.js
   จัดการ modal เพิ่ม/แก้ไขรายชื่อแบล็กลิสต์
   =================================================== */

const Modal = (() => {
  let overlay, form, titleEl, editingId, tempImage;

  function init() {
    overlay = document.getElementById('modalOverlay');
    form = document.getElementById('entryForm');
    titleEl = document.getElementById('modalTitle');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.getElementById('modalCloseBtn').addEventListener('click', close);
    document.getElementById('modalCancelBtn').addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });

    const imageInput = document.getElementById('inputImage');
    if (imageInput) {
      imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          tempImage = ev.target.result;
          const preview = document.getElementById('imagePreview');
          if (preview) {
            preview.src = tempImage;
            preview.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      });
    }

    form.addEventListener('submit', onSubmit);
  }

  function openForCreate() {
    editingId = null;
    tempImage = null;
    titleEl.textContent = 'แจ้งแบล็กลิสต์';
    form.reset();
    clearErrors();
    resetImagePreview();
    overlay.classList.add('active');
    document.getElementById('inputName').focus();
  }

  function openForEdit(id) {
    const entry = Storage.getById(id);
    if (!entry) return;
    editingId = id;
    tempImage = entry.imageData || null;
    titleEl.textContent = 'แก้ไขข้อมูล';
    document.getElementById('inputName').value = entry.name;
    document.getElementById('inputContact').value = entry.contact;
    document.getElementById('inputTag').value = entry.tag;
    document.getElementById('inputDesc').value = entry.desc;
    document.getElementById('inputEvidence').value = entry.evidenceUrl || '';
    document.getElementById('inputReporter').value = entry.reporter || '';
    clearErrors();
    const preview = document.getElementById('imagePreview');
    if (preview) {
      if (entry.imageData) {
        preview.src = entry.imageData;
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
        preview.src = '';
      }
    }
    overlay.classList.add('active');
  }

  function resetImagePreview() {
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.style.display = 'none';
      preview.src = '';
    }
    const imageInput = document.getElementById('inputImage');
    if (imageInput) imageInput.value = '';
  }

  function close() {
    overlay.classList.remove('active');
    editingId = null;
  }

  function clearErrors() {
    document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
  }

  function validate() {
    clearErrors();
    let valid = true;

    const name = document.getElementById('inputName').value.trim();
    const desc = document.getElementById('inputDesc').value.trim();

    if (!name) {
      document.getElementById('inputName').closest('.form-group').classList.add('error');
      valid = false;
    }

    if (!desc) {
      document.getElementById('inputDesc').closest('.form-group').classList.add('error');
      valid = false;
    }

    return valid;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      Toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const data = {
      name: document.getElementById('inputName').value.trim(),
      contact: document.getElementById('inputContact').value.trim(),
      tag: document.getElementById('inputTag').value,
      desc: document.getElementById('inputDesc').value.trim(),
      evidenceUrl: document.getElementById('inputEvidence').value.trim(),
      reporter: document.getElementById('inputReporter').value.trim() || 'ไม่ระบุชื่อ',
      imageData: tempImage || ''
    };

    if (editingId) {
      Storage.update(editingId, data);
      Toast.success('แก้ไขข้อมูลเรียบร้อยแล้ว');
    } else {
      Storage.add(data);
      Toast.success('บันทึกรายชื่อเรียบร้อยแล้ว');
    }

    close();
    if (typeof App !== 'undefined') App.refresh();
  }

  return { init, openForCreate, openForEdit, close };
})();
