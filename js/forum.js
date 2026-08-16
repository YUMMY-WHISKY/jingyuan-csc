/* 镜渊论坛原型 · 通用：在线人数模拟 + 登录口 + 主题切换 */

(function () {
  'use strict';

  /* ---------- 主题切换（T12）：按进度标记换 UI 风格 ----------
     2026-08-15：theme-g4（黑红）触发节点后移到看完第三层日记（diary3_done）之后 */
  try {
    var t = '';
    if (localStorage.getItem('diary3_done') === '1') t = 'theme-g4';
    else if (localStorage.getItem('diary_unlocked') === '1' || localStorage.getItem('g5_unlocked') === '1') t = 'theme-g3';
    if (t) document.body.classList.add(t);
  } catch (e) {}

  /* ---------- 在线人数 ---------- */
  function randomCount() {
    return 24 + Math.floor(Math.random() * 20);   // 24~43 人，阶段一正常区间
  }
  var top = document.getElementById('fCountTop');
  var side = document.getElementById('fCountSide');
  function refreshCount() {
    var n = randomCount();
    if (top) top.textContent = n;
    if (side) side.textContent = n;
  }
  refreshCount();
  setInterval(refreshCount, 10000);

  /* ---------- 登录口 ---------- */
  var INVITE_CODE = 'COG2024X';

  window.loginTry = function () {
    var input = document.getElementById('inviteCode');
    var hint = document.getElementById('loginHint');
    if (!input) return;

    var code = input.value.trim().toUpperCase();

    if (code === INVITE_CODE) {
      try { localStorage.setItem('forum_unlocked', '1'); } catch (e) {}
      hint.className = 'login-hint';
      hint.textContent = '邀请码正确，正在进入论坛…';
      setTimeout(function () { location.href = 'index.html'; }, 500);
    } else if (code === '') {
      hint.className = 'login-hint err';
      hint.textContent = '请输入邀请码（提示：完成官网心理测评，结果页会提供）';
    } else {
      hint.className = 'login-hint err';
      hint.textContent = '邀请码无效，请完成官网心理测评后获取';
    }
  };

  try {
    if (localStorage.getItem('forum_unlocked') === '1' &&
        location.pathname.indexOf('login.html') !== -1) {
      location.replace('index.html');
    }
  } catch (e) {}
})();
