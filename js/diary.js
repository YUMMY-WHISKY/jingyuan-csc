/* 镜渊论坛原型 · 日记第一层脚本 */

(function () {
  'use strict';

  var pages = document.querySelectorAll('.diary-page');
  var prev = document.getElementById('dPrev');
  var next = document.getElementById('dNext');
  var num = document.getElementById('dNum');
  var idx = 0;
  var TOTAL = pages.length;

  /* 卡片高度由 CSS Grid 恒定（所有页叠同一单元格，行高=最高页），此处无需测量 */

  function show(i) {
    idx = Math.max(0, Math.min(i, TOTAL - 1));
    pages.forEach(function (p, k) { p.classList.toggle('active', k === idx); });
    prev.disabled = idx === 0;
    next.disabled = idx === TOTAL - 1;
    num.textContent = (idx + 1) + ' / ' + TOTAL;
  }

  prev.addEventListener('click', function () { show(idx - 1); });
  next.addEventListener('click', function () { show(idx + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  /* ---------- 页脚互动 ---------- */
  var h3 = document.getElementById('diaryH3');
  var overlay = document.getElementById('diaryOverlay');
  var clicks = 0;

  if (h3 && overlay) {
    h3.addEventListener('click', function () {
      clicks++;
      if (clicks >= 3) {
        clicks = 0;
        if (window.markClue) window.markClue('h3');   /* T16.6：H3 收集 */
        overlay.innerHTML = '';
        overlay.classList.add('show');
        /* 实测单组文字宽度，横向重复填满；纵向按行数平分全屏 */
        var probe = document.createElement('span');
        probe.style.cssText = 'visibility:hidden;white-space:nowrap;font-family:inherit;font-size:30px;letter-spacing:4px;position:absolute;left:-9999px;';
        probe.textContent = '她在骗你，别信她　';
        document.body.appendChild(probe);
        var w = probe.offsetWidth || 240;
        document.body.removeChild(probe);
        var perLine = Math.max(1, Math.ceil(window.innerWidth / w)) + 1;
        var lineText = '';
        for (var k = 0; k < perLine; k++) lineText += '她在骗你，别信她　';
        var rows = Math.max(8, Math.min(14, Math.ceil(window.innerHeight / 120)));
        for (var i = 0; i < rows; i++) {
          var lp = document.createElement('p');
          lp.textContent = lineText;
          overlay.appendChild(lp);
        }
        document.body.classList.add('shake');
        overlay.classList.add('glitch');
        setTimeout(function () { document.body.classList.remove('shake'); }, 2000);
        setTimeout(function () { overlay.classList.remove('show', 'glitch'); }, 2000);
      }
    });
  }

})();
