/* 镜渊官网原型 · 心理测评脚本 */

(function () {
  'use strict';

  var TOTAL = 10;
  var $intro = document.getElementById('qIntro');
  var $form = document.getElementById('qForm');
  var $result = document.getElementById('qResult');

  /* ---------- 开始 ---------- */
  window.quizStart = function () {
    $intro.style.display = 'none';
    $form.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- 进度条（随滚动实时刷新） ---------- */
  function refreshProgress() {
    var answered = 0;
    for (var i = 1; i <= TOTAL; i++) {
      var checked = document.querySelector('input[name="q' + i + '"]:checked');
      if (checked) answered++;
    }
    var num = Math.min(answered + 1, TOTAL);
    document.getElementById('qProgressNum').textContent = num;
    document.getElementById('qBar').style.width = (num / TOTAL * 100) + '%';
  }
  document.querySelectorAll('.q-item input').forEach(function (r) {
    r.addEventListener('change', refreshProgress);
  });
  document.addEventListener('scroll', refreshProgress);

  /* ---------- 提交 ---------- */
  window.quizSubmit = function () {
    // 校验：全部作答
    for (var i = 1; i <= TOTAL; i++) {
      if (!document.querySelector('input[name="q' + i + '"]:checked')) {
        alert('请完成第 ' + i + ' 题再提交');
        return;
      }
    }
    var nick = document.getElementById('nickname').value.trim() || '匿名访客';

    try { localStorage.setItem('jingyuan_nickname', nick); } catch (e) {}

    document.getElementById('rNick').textContent = nick;
    $form.style.display = 'none';
    $result.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- 重测 ---------- */
  window.quizReset = function () {
    document.querySelectorAll('.q-item input').forEach(function (r) { r.checked = false; });
    $result.style.display = 'none';
    $intro.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
})();
