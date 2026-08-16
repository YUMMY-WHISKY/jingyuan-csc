/* 镜渊论坛原型 · 私信脚本 */

(function () {
  'use strict';

  var log = document.getElementById('pmLog');
  var typing = document.getElementById('pmTyping');
  var input = document.getElementById('pmText');
  var count = 0;
  var baseDelay = 2600;   // 首轮回复延迟，每轮递减（"回复越来越快"）

  /* 12 轮回复（G7 扩展 2026-08-16 二轮）：日常 → 矛盾求救秒撤回 → 追认 → 劝阻 → 沉默 → 日常假象 → 不安渐起 → 放弃伪装
     最后一条不再撤回：求救被撤是"被控制"的痕迹，唯一没撤的这条反而是最重的警告
     （2026-08-16 真相分散：警告从第 8 轮后移到第 12 轮，中间补日常/不安过渡，避免过早确认小F消失） */
  var REPLIES = [
    ['哈哈，你也喜欢画画吗？我的水彩可以借你！', null],
    ['周医生今天来查房了，说我恢复得不错。', null],
    ['对了，画画小组周五还有位置，你要来吗？', null],
    ['我很好😊', '……不对。刚才那句话，不是我说的。'],
    ['刚才是手滑了，别理我😅', '她学会我的语气了。她正用我的语气和你说话。'],
    ['你别再回我了，求你了。', '……她正在学会说「我」。'],
    ['……', null],
    ['今天画了新的画，画得不好。', null],
    ['周医生今天没来查房。', null],
    ['今天窗台的植物，少了一盆。', null],
    ['要是哪天我发的消息怪怪的，别当真。', null],
    ['……', null],
  ];

  function bubble(text, isMe) {
    var wrap = document.createElement('div');
    wrap.className = 'pm-msg' + (isMe ? ' me' : '');
    var av = document.createElement('span');
    av.className = 'f-avatar';
    av.style.background = isMe ? '#EEF2F6' : '#E8F5EE';
    av.style.color = isMe ? '#7E93A8' : '#5F9E74';
    av.textContent = isMe ? '我' : '猫';
    var b = document.createElement('div');
    b.className = 'pm-bubble';
    b.textContent = text;
    wrap.appendChild(av);
    wrap.appendChild(b);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  function showTyping(show) {
    typing.style.display = show ? 'block' : 'none';
  }

  function recall(lastEl, replaceText) {
    // 1.2 秒后撤回：矛盾消息替换为"已撤回"灰条
    setTimeout(function () {
      if (lastEl.parentNode) {
        var t = document.createElement('div');
        t.className = 'pm-msg';
        var av = document.createElement('span');
        av.className = 'f-avatar';
        av.style.background = '#E8F5EE';
        av.style.color = '#5F9E74';
        av.textContent = '猫';
        var r = document.createElement('div');
        r.className = 'pm-recall';
        r.textContent = replaceText || '[消息已撤回]';
        t.appendChild(av);
        t.appendChild(r);
        log.replaceChild(t, lastEl);
        log.scrollTop = log.scrollHeight;
      }
    }, 1200);
  }

  window.pmSend = function () {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';

    bubble(text, true);
    count++;

    var reply = REPLIES[Math.min(count - 1, REPLIES.length - 1)];
    var delay = Math.max(baseDelay - (count - 1) * 400, 900);   // 越来越快

    showTyping(true);
    setTimeout(function () {
      showTyping(false);
      bubble(reply[0], false);

      if (reply[1]) {
        setTimeout(function () {
          var wrap = document.createElement('div');
          wrap.className = 'pm-msg';
          var av = document.createElement('span');
          av.className = 'f-avatar';
          av.style.background = '#E8F5EE';
          av.style.color = '#5F9E74';
          av.textContent = '猫';
          var b = document.createElement('div');
          b.className = 'pm-bubble';
          b.style.borderColor = '#E0B0B0';
          b.textContent = reply[1];
          wrap.appendChild(av);
          wrap.appendChild(b);
          log.appendChild(wrap);
          log.scrollTop = log.scrollHeight;
          recall(wrap);
        }, 900);
      }
    }, delay);

    /* 终局：12 轮之后，追加一条不撤回的消息（求救撤了一路，唯一没撤的这条最重） */
    if (count >= REPLIES.length) {
      setTimeout(function () {
        var wrap = document.createElement('div');
        wrap.className = 'pm-msg';
        var av = document.createElement('span');
        av.className = 'f-avatar';
        av.style.background = '#E8F5EE';
        av.style.color = '#5F9E74';
        av.textContent = '猫';
        var b = document.createElement('div');
        b.className = 'pm-bubble';
        b.style.borderColor = '#E0B0B0';
        b.textContent = '她不在了。如果你看到这条消息——快跑。';
        wrap.appendChild(av);
        wrap.appendChild(b);
        log.appendChild(wrap);
        log.scrollTop = log.scrollHeight;
      }, 3200);
    }
  };

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') pmSend();
  });
})();
