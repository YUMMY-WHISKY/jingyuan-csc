/* 官网历史版本异常（2026-08-15 · docx 七）：同一页面「当前版本 / 历史版本」切换
   - 2026-08-16 支线统一后移：读完第三层日记（diary3_done）后出现切换器（此前官网一切正常）
   - 历史版本显示与当前版本冲突的字段（ver-pair 双文本切换）
   - 终局接管（final_done）后不再提供切换——版本已统一 */
(function () {
  'use strict';

  var unlocked = false, done = false;
  try {
    unlocked = localStorage.getItem('diary3_done') === '1';
    done = localStorage.getItem('final_done') === '1';
  } catch (e) {}
  if (!unlocked || done) return;

  var hist = false;
  try { hist = localStorage.getItem('hist_version') === '1'; } catch (e) {}

  /* 样式：双文本切换 */
  var css = document.createElement('style');
  css.textContent =
    '.ver-pair .v-hist{display:none}.hist-ver .ver-pair .v-cur{display:none}' +
    '.hist-ver .ver-pair .v-hist{display:inline;color:#B03A3A;font-weight:600}' +
    '#verSwitch{position:fixed;left:16px;bottom:16px;z-index:998;display:flex;align-items:center;gap:2px;' +
    'background:#fff;border:1px solid #C9D8E8;border-radius:20px;padding:4px 6px;font-size:12px;' +
    'box-shadow:0 2px 10px rgba(0,0,0,.08)}' +
    '#verSwitch .v-lbl{color:#9AA8B6;padding:0 8px 0 6px;letter-spacing:1px}' +
    '#verSwitch .v-btn{border:none;background:transparent;color:#5B7FA6;padding:4px 12px;border-radius:14px;cursor:pointer;font-size:12px}' +
    '#verSwitch .v-btn.active{background:#5B7FA6;color:#fff}' +
    '#verSwitch.hist .v-btn.hist-b{background:#B03A3A;color:#fff}' +
    '#verSwitch.hist .v-btn.cur-b.active{background:#B03A3A}';

  var w = document.createElement('div');
  w.id = 'verSwitch';
  w.innerHTML = '<span class="v-lbl">版本</span>' +
    '<button class="v-btn cur-b" type="button">当前</button>' +
    '<button class="v-btn hist-b" type="button">历史</button>';
  document.body.appendChild(css);
  document.body.appendChild(w);

  function apply(v) {
    hist = v;
    document.body.classList.toggle('hist-ver', v);
    w.classList.toggle('hist', v);
    w.querySelector('.cur-b').classList.toggle('active', !v);
    w.querySelector('.hist-b').classList.toggle('active', v);
    try { localStorage.setItem('hist_version', v ? '1' : '0'); } catch (e) {}
  }
  w.querySelector('.cur-b').addEventListener('click', function () { apply(false); });
  w.querySelector('.hist-b').addEventListener('click', function () { apply(true); });
  apply(hist);
})();
