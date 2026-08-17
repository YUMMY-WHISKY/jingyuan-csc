/* 镜渊官网原型 · 通用脚本：返回顶部 + 页脚年份 + 行为追踪 */

(function () {
  'use strict';

  /* 调试重置：URL 加 ?reset=1 清除全部本地进度（主题/线索/访问统计），
     清完去掉参数刷新，避免再触发一次 reset 逻辑 */
  if (location.search.indexOf('reset=1') >= 0) {
    try { localStorage.clear(); } catch (e) {}
    location.replace(location.origin + location.pathname);
  }

  /* 页面门禁（T2.3 进度锁模拟 · 2026-08-16 全站补全）：
     未达进度直接访问 → 显示「404 · 页面不存在」式提示（diegetic，不剧透）
     ?unlock=1 调试放行；key = localStorage 标记（forum_unlocked / diary_unlocked /
     diary2_done / diary3_done / archive_unlocked） */
  window.pageGate = function (key, msg) {
    try {
      if (new URLSearchParams(location.search).get('unlock') === '1') return true;
      if (localStorage.getItem(key) === '1') return true;
    } catch (e) { return true; }
    var inForum = location.pathname.indexOf('/forum/') !== -1 || location.pathname.indexOf('forum/') !== -1;
    document.body.innerHTML =
      '<div style="max-width:520px;margin:110px auto;padding:0 24px;text-align:center;font-size:14px;color:#9AA8B6;line-height:2.2">' +
      '<p style="font-size:44px;margin-bottom:16px;color:#C8D0D8;font-weight:200">404</p>' +
      '<p>页面不存在，或你没有访问权限。</p>' +
      (msg ? '<p style="font-size:12px;color:#B8C2CC;margin-top:6px">' + msg + '</p>' : '') +
      '<p style="font-size:12px;margin-top:24px"><a href="' + (inForum ? 'index.html' : '../index.html') + '" style="color:#5B7FA6">← 返回首页</a></p>' +
      '</div>';
    return false;
  };

  /* 返回顶部 */
  var btn = document.getElementById('backTop');
  if (btn) {
    window.addEventListener('scroll', function () {
      btn.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 主题切换（T12）：按进度标记换 UI 风格
     2026-08-15：黑红 theme-g4 的触发节点后移——看完第三层日记（diary3_done）后才变黑；
     读第一层日记（diary_unlocked）仍只到冷色 theme-g3 */
  try {
    var t = '';
    if (localStorage.getItem('diary3_done') === '1') t = 'theme-g4';
    else if (localStorage.getItem('diary_unlocked') === '1' || localStorage.getItem('g5_unlocked') === '1') t = 'theme-g3';
    if (t) document.body.classList.add(t);
  } catch (e) {}

  /* 顶栏「内部邮箱」入口（2026-08-17）：mail.html 已解锁（forum_unlocked）后，
     在论坛顶部导航（首页/全部帖子/病友档案/私信）追加「内部邮箱」链接；
     不再与立项黑幕链（deep-links）的 3 个归档入口混排。 */
  try {
    if (localStorage.getItem('forum_unlocked') === '1') {
      var navUl = document.querySelector('header .f-nav, .f-nav');
      if (navUl) {
        var hasMail = Array.prototype.some.call(navUl.querySelectorAll('a'),
          function (a) { return /mail\.html/i.test(a.getAttribute('href') || ''); });
        if (!hasMail) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '../mail.html';
          a.textContent = '内部邮箱';
          li.appendChild(a);
          navUl.appendChild(li);
        }
      }
    }
  } catch (e) {}

  /* 设计系统 v2：滚动显现（2026-08-17）
     给 <main> 的结构块加 .reveal-up（初始隐藏），进入视口后加 .in 播放浮起动效。
     仅作用于官网结构块（.section/.hero/.stats），不影响论坛/日记/邮件等页面专属结构。
     IO 不可用或页面短内容时放行展示，绝不隐藏内容。 */
  try {
    if ('IntersectionObserver' in window) {
      var rev = document.querySelectorAll('main .section, main .hero, main .stats, main .page-head');
      if (rev.length) {
        var revIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add('in'); revIO.unobserve(en.target); }
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: .10 });
        rev.forEach(function (el) { el.classList.add('reveal-up'); revIO.observe(el); });
      }
    } else {
      document.documentElement.classList.add('no-reveal');   // 兜底：无 IO 时直接展示
    }
  } catch (e) { document.documentElement.classList.add('no-reveal'); }

  /* 行为追踪（T2.4 模拟）：页面停留时长（2026-08-12：搜索词维度已整体移除） */
  try {
    var page = (location.pathname.split('/').pop() || 'index').replace('.html', '');
    var t0 = Date.now();
    function saveVisits() {
      var sec = Math.round((Date.now() - t0) / 1000);
      t0 = Date.now();
      if (sec < 1) return;
      var visits = JSON.parse(localStorage.getItem('visits') || '{}');
      visits[page] = (visits[page] || 0) + sec;
      localStorage.setItem('visits', JSON.stringify(visits));
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) saveVisits();
      else t0 = Date.now();
    });
    window.addEventListener('beforeunload', saveVisits);

    /* 访问序号（G10/G11 兜底"访客#序号"用） */
    var vc = (parseInt(localStorage.getItem('visit_count'), 10) || 0) + 1;
    localStorage.setItem('visit_count', String(vc));
  } catch (e) {}

  /* 隐藏线索收集（T16.6）：幂等写入 localStorage.hiddenClues
     原型可自动检测的线索：h3 镜字3击（diary.js）/ h4 访问H4页（该页内联）/ h5 已删除
     H1（查看源码）与 H2（录音0:47）在正式版接入对应写入源 */
  window.markClue = function (key) {
    try {
      var c = {};
      try { c = JSON.parse(localStorage.getItem('hiddenClues') || '{}'); } catch (e) {}
      if (!c[key]) {
        c[key] = true;
        localStorage.setItem('hiddenClues', JSON.stringify(c));
      }
    } catch (e) {}
  };
  window.getClues = function () {
    try { return JSON.parse(localStorage.getItem('hiddenClues') || '{}'); }
    catch (e) { return {}; }
  };

  /* 叙事回响步骤标记（方案A）：幂等记录玩家完成的关键行为，驱动各载体"角色回应" */
  window.markStep = function (key) {
    try {
      var s = JSON.parse(localStorage.getItem('steps') || '[]');
      if (s.indexOf(key) === -1) {
        s.push(key);
        localStorage.setItem('steps', JSON.stringify(s));
      }
    } catch (e) {}
  };
  window.getSteps = function () {
    try { return JSON.parse(localStorage.getItem('steps') || '[]'); }
    catch (e) { return []; }
  };
  window.hasStep = function (key) {
    return window.getSteps().indexOf(key) !== -1;
  };

  /* 回响出现信号（方案A）：NEW 徽标 + 淡入 + 短暂高亮 + 标题前缀；点击/悬停后消退 */
  window.echoNew = function (el, label) {
    if (!el) return;
    el.style.display = '';
    el.style.position = 'relative';
    /* 淡入上浮（自包含，不依赖外部 CSS） */
    el.style.transition = 'opacity .9s ease, transform .9s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(5px)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
    /* NEW 徽标 */
    var badge = document.createElement('span');
    badge.textContent = label || '新';
    badge.style.cssText = 'position:absolute;top:-9px;left:-9px;background:#E53E3E;color:#fff;font-size:11px;padding:2px 9px;border-radius:10px;z-index:5;letter-spacing:1px';
    el.appendChild(badge);
    /* 短暂高亮 */
    el.style.boxShadow = '0 0 0 2px rgba(229,62,62,.45)';
    setTimeout(function () { el.style.boxShadow = ''; }, 2400);
    /* 标题前缀（切回标签页可见） */
    var origTitle = document.title;
    if (origTitle.indexOf('（新）') !== 0) document.title = '（新）' + origTitle;
    var done = function () {
      badge.remove();
      document.title = origTitle;
    };
    el.addEventListener('click', done, { once: true });
    el.addEventListener('mouseenter', done, { once: true });
  };

  /* G10 弹窗数据读取（所有值均来自玩家游戏内主动输入，无系统级读取）
     2026-08-12：搜索词维度已移除，仅保留昵称 + 停留时长 */
  window.getTracking = function () {
    var out = {
      nickname: '',      // 问卷昵称 / 兜底 访客#序号
      longestPage: '',   // 停留最久的页面
      longestTime: ''    // 该页面停留时长 "X分Y秒"
    };
    try {
      var nick = localStorage.getItem('jingyuan_nickname');
      if (nick) out.nickname = nick;
      else out.nickname = '访客#' + (localStorage.getItem('visit_count') || '1');
      var visits = JSON.parse(localStorage.getItem('visits') || '{}');
      var bestKey = '', bestSec = 0;
      Object.keys(visits).forEach(function (k) {
        if (visits[k] > bestSec) { bestSec = visits[k]; bestKey = k; }
      });
      if (bestKey) {
        out.longestPage = bestKey;
        var m = Math.floor(bestSec / 60), s = bestSec % 60;
        out.longestTime = (m > 0 ? m + '分' : '') + s + '秒';
      }
    } catch (e) {}
    return out;
  };

  /* 终局官网接管（2026-08-14）：final_done 标记 → 官网全站被镜接管（仅官网页面，不含 /forum/、mail、observing）：
     ① 所有图片（含轮播图、研究员照片、logo）→ lookingatyou.png
     ② 所有文字（全部可见文本节点）→ 「我一直在注视着你」 */
  try {
    if (localStorage.getItem('final_done') === '1') {
      var pg = location.pathname || '';
      /* 排除论坛、邮箱、观察室、以及根目录下的特定互动解谜页面（如 7-24_...html 等），
         这些页面虽然是根目录，但属于游戏核心内容，不应被接管 */
      if (!/forum/i.test(pg) && !/mail/i.test(pg) && !/observing/i.test(pg) && !/\d+[-_]\d+[-_]/i.test(pg)) {
        document.title = '本系统已由镜接管';
        document.body.classList.add('taken-over');   /* 接管样式：轮播图放大等 */
        document.querySelectorAll('img').forEach(function (im) {
          im.src = 'img/lookingatyou.png';
          im.alt = '本系统已由镜接管';
        });
        document.querySelectorAll('[placeholder]').forEach(function (el) {
          el.placeholder = '本系统已由镜接管';
        });
        /* 遍历所有可见文本节点（跳过纯空白与 script/style 内部） */
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: function (n) {
            if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            var p = n.parentNode;
            if (p && (p.tagName === 'SCRIPT' || p.tagName === 'STYLE')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        var textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach(function (n) { n.nodeValue = '本系统已由镜接管'; });
        /* 数字元素（统计数字 / 新闻日期 / 问卷编号）→ 眼睛图标 */
        document.querySelectorAll('.stat b, .date, .num').forEach(function (el) {
          el.innerHTML = '<img src="img/lookingatyou.png" alt="本系统已由镜接管" style="height:1.1em;width:auto;display:inline-block;vertical-align:-.2em;border-radius:2px">';
        });

        /* 终局收尾（2026-08-16）：右上角摄像头指示灯常亮，hover 触发最后一段很慢的打字机 */
        var camDot = document.createElement('div');
        camDot.id = 'camFinal';
        camDot.innerHTML = '<span class="cam-dot"></span>';
        document.body.appendChild(camDot);
        var camLayer = document.createElement('div');
        camLayer.id = 'camLayer';
        document.body.appendChild(camLayer);
        var camLines = [
          '游戏已结束。',
          '',
          '你的观察已确认完毕。',
          '感谢你的配合。'
        ];
        camDot.addEventListener('mouseenter', function () {
          if (camLayer.dataset.done) return;
          camLayer.dataset.done = '1';
          camLayer.style.display = 'flex';
          var i = 0;
          (function next() {
            if (i >= camLines.length) return;
            var p = document.createElement('p');
            p.textContent = camLines[i];
            camLayer.appendChild(p);
            i++;
            setTimeout(next, camLines[i - 1] === '' ? 500 : 340);   /* 很慢的打字机 */
          })();
        });
        camDot.addEventListener('click', function () { camLayer.style.display = 'none'; });
      }
    }
  } catch (e) {}

  /* 全局新邮件浮窗（2026-08-16）：任意页面检测到「已解锁但尚未闭环」的新邮件，
     就在页面顶部弹出提示，点击跳转内部邮箱。
     mail_seen：在邮箱页浏览后写入；mail_global_notified：全局浮窗已提示过的批次（避免每页每次都弹）。
     解锁映射必须与 mail.html 保持一致。 */
  try {
    (function globalMailToast() {
      function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
      function arrGet(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
      function arrSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

      /* 与 mail.html 一致的解锁映射
         keys：任一标记为 1 即解锁该批邮件
         allKeys：需全部为 1 才解锁（m15 = 口令A archive_id + 口令B archive_deep） */
      var unlockRules = [
        { keys: ['diary_unlocked'], ids: ['m1', 'm2', 'm3'] },
        { keys: ['diary2_done'], ids: ['m4', 'm5', 'm6', 'm7'] },
        { keys: ['diary3_done'], ids: ['m8', 'm9', 'm10', 'm13', 'm14'] },
        { keys: ['final_done'], ids: ['m11'] },
        { allKeys: ['archive_id', 'archive_deep'], ids: ['m15'] }
      ];

      /* 计算「已解锁但玩家尚未看过且本页未提示过」的新邮件 id */
      function computeFresh() {
        var unlocked = [];
        unlockRules.forEach(function (rule) {
          if (rule.allKeys) {
            var all = true;
            for (var i = 0; i < rule.allKeys.length; i++) {
              if (lsGet(rule.allKeys[i]) !== '1') { all = false; break; }
            }
            if (all) unlocked = unlocked.concat(rule.ids);
          } else {
            for (var j = 0; j < rule.keys.length; j++) {
              if (lsGet(rule.keys[j]) === '1') { unlocked = unlocked.concat(rule.ids); break; }
            }
          }
        });
        if (window.hasStep && window.hasStep('r5')) unlocked.push('mr5');
        var seen = arrGet('mail_seen');
        var noted = arrGet('mail_global_notified');
        return unlocked.filter(function (id) {
          return seen.indexOf(id) === -1 && noted.indexOf(id) === -1;
        });
      }

      /* 单次尝试弹出：有可提示的新邮件才弹，并把本批写进 mail_global_notified 去重 */
      function run() {
        if (window.__suppressMailToast === true) return;
        var fresh = computeFresh();
        if (fresh.length === 0) return;

        /* 先标记已提示，避免重复弹 */
        arrSet('mail_global_notified', arrGet('mail_global_notified').concat(fresh));

        /* 动画关键帧（一次性注入） */
        if (!document.getElementById('mtKeyframes')) {
          var st = document.createElement('style');
          st.id = 'mtKeyframes';
          st.textContent = '@keyframes mtFade{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}';
          document.head.appendChild(st);
        }

        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:14px;left:50%;transform:translate(-50%,0);z-index:9999;' +
          'background:rgba(16,20,26,.97);border:1px solid #3A78B8;border-left:3px solid #3A78B8;' +
          'border-radius:6px;padding:12px 20px;font-size:13px;color:#fff;letter-spacing:1px;' +
          'box-shadow:0 6px 24px rgba(0,0,0,.45);cursor:pointer;animation:mtFade .4s ease;' +
          'display:flex;align-items:center;gap:14px;';
        /* 邮箱页固定在根目录，不用 forum 相对路径：在 forum 子页面里会落去不存在的 forum/mail.html */
        var mailHref = location.pathname.indexOf('forum') !== -1 ? '../mail.html' : 'mail.html';
        var link = document.createElement('a');
        link.href = mailHref;
        link.textContent = '收到 ' + fresh.length + ' 封新邮件 · 查看 →';
        link.style.cssText = 'color:#fff;text-decoration:none;white-space:nowrap;';
        var close = document.createElement('span');
        close.textContent = '×';
        close.style.cssText = 'color:#6E7E90;cursor:pointer;font-size:15px;line-height:1;';
        close.addEventListener('click', function (e) { e.stopPropagation(); toast.remove(); });
        toast.appendChild(link);
        toast.appendChild(close);
        toast.addEventListener('click', function () { location.href = mailHref; });
        document.body.appendChild(toast);

        /* 自动消失（12s） */
        setTimeout(function () { if (toast.parentNode) toast.remove(); }, 12000);
      }

      run();
      /* 暴露给全站：在任意「解锁动作」完成后可手动调用，立即检测新解锁邮件并弹出 */
      window.__checkMailToast = run;
      /* 2026-08-17：浮窗必须"及时弹出"而不是等刷新。
         玩家常在当前页完成解锁（读日志/输口令/下载），此时 JS 不会自动重跑。
         这里用 pageshow / visibilitychange / 轮询 反复检查，一旦有新解锁邮件立即弹出。 */
      window.addEventListener('pageshow', run);
      document.addEventListener('visibilitychange', function () { if (!document.hidden) run(); });
      setInterval(run, 800);
    })();
  } catch (e) {}
})();
