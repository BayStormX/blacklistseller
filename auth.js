/* ===================================================
   auth.js
   ระบบ login / session management
   =================================================== */

const Auth = (() => {
  const SESSION_KEY = 'blacklist_session_v1';
  const USERS_KEY   = 'blacklist_users_v1';

  /* ---------- ค่าเริ่มต้น: admin / admin1234 ---------- */
  function _initDefaultUsers() {
    if (localStorage.getItem(USERS_KEY)) return;
    const defaults = [
      { username: 'admin', password: 'admin1234', role: 'admin', displayName: 'ผู้ดูแลระบบ' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  }

  function _getUsers() {
    _initDefaultUsers();
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }

  /* ---------- Session ---------- */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }

  function isLoggedIn() {
    const s = getSession();
    if (!s) return false;
    // หมดอายุใน 8 ชั่วโมง
    if (Date.now() - s.loginAt > 8 * 60 * 60 * 1000) {
      logout();
      return false;
    }
    return true;
  }

  /* ---------- Login ---------- */
  function login(username, password) {
    const users = _getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return { ok: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };

    const session = {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      loginAt: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  }

  /* ---------- Logout ---------- */
  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  /* ---------- Guard: redirect ถ้ายังไม่ login ---------- */
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
    }
  }

  /* ---------- Guard: redirect ถ้า login แล้ว ---------- */
  function redirectIfAuthed(dest = 'index.html') {
    if (isLoggedIn()) {
      window.location.href = dest;
    }
  }

  /* ---------- จัดการผู้ใช้ (admin เท่านั้น) ---------- */
  function addUser(username, password, displayName = '', role = 'user') {
    const users = _getUsers();
    if (users.find(u => u.username === username)) {
      return { ok: false, error: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' };
    }
    users.push({ username, password, role, displayName: displayName || username });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  }

  function removeUser(username) {
    const s = getSession();
    if (s && s.username === username) return { ok: false, error: 'ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่' };
    let users = _getUsers().filter(u => u.username !== username);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  }

  function listUsers() {
    return _getUsers().map(({ username, displayName, role }) => ({ username, displayName, role }));
  }

  function changePassword(username, newPassword) {
    const users = _getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { ok: false, error: 'ไม่พบผู้ใช้' };
    users[idx].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  }

  return { login, logout, isLoggedIn, getSession, requireAuth, redirectIfAuthed, addUser, removeUser, listUsers, changePassword };
})();
