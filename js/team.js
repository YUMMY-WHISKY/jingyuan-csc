/* 镜渊官网原型 · 团队页脚本 */

(function () {
  'use strict';

  var el = document.getElementById('avatarZhou');
  if (!el) return;

  /* 终局接管（2026-08-14）：官网已被镜接管，照片固定为眼睛，不再随机切换 */
  try {
    if (localStorage.getItem('final_done') === '1') {
      el.src = 'img/lookingatyou.png';
      return;
    }
  } catch (e) {}

  /* G2（T14.1）：周晏照片刷新随机切换——正常版 / F-00 版（"另一种表情"）
     名字职称不变，照片在两种眼神之间随机（注意：周晏本人照片文件是 lin.png） */
  var version = Math.random() < 0.5 ? 'lin' : 'f-00';
  el.src = 'img/' + version + '.png';
})();
