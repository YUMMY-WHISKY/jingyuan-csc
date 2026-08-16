/* 镜渊官网原型 · 首页脚本：Hero 轮播 + 数据条数字滚动 */

(function () {
  'use strict';

  /* ---------- Hero 轮播 ---------- */
  var slides = document.querySelectorAll('.slide');
  var dots = document.querySelectorAll('.dot');
  var idx = 0;
  var timer = null;

  function show(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('active', k === idx); });
    dots.forEach(function (d, k) { d.classList.toggle('active', k === idx); });
  }

  function next() { show(idx + 1); }

  function play() { timer = setInterval(next, 5000); }
  function stop() { if (timer) clearInterval(timer); timer = null; }

  if (slides.length > 1) {
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { stop(); show(k); play(); });
    });
    slides.forEach(function (s) {
      s.addEventListener('mouseenter', stop);
      s.addEventListener('mouseleave', function () { if (!timer) play(); });
    });
    play();
  }

  /* ---------- 数据条数字滚动 ---------- */
  var stats = document.querySelectorAll('.stat b[data-count]');

  /* 终局接管（2026-08-14）：官网已被镜接管，数字已被眼睛图标替换，不再滚动覆盖 */
  try {
    if (localStorage.getItem('final_done') === '1') stats = [];
  } catch (e) {}

  function animateNum(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1200, 1);          // 1.2s 完成
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));  // easeOutCubic
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateNum(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { io.observe(el); });
  } else {
    stats.forEach(animateNum);
  }
})();
