/* ========================================
   Web特典ページ 共通スクリプト
   - クリップボード（API + execCommandフォールバック）
   - localStorage 入力保持
   - トースト通知
   ======================================== */

(function() {
  'use strict';

  /* ----------------------------------------
     トースト通知
     ---------------------------------------- */
  function showToast(message, isError) {
    var existing = document.querySelector('.toast');
    if (existing) {
      existing.remove();
    }
    var toast = document.createElement('div');
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    // 強制リフロー後にshowクラスを付ける（アニメーションのため）
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, 1800);
  }
  window.showToast = showToast;

  /* ----------------------------------------
     クリップボードコピー（最重要機能）
     - Clipboard APIを試行
     - 失敗 or 非対応 → execCommandフォールバック
     - HTTP環境・iPhone Safariでも動作
     ---------------------------------------- */
  function copyToClipboard(text) {
    return new Promise(function(resolve, reject) {
      // 方法1: Clipboard API（HTTPS必須・モダン環境）
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function() {
          resolve('clipboard-api');
        }).catch(function(err) {
          // 失敗したらフォールバックへ
          fallbackCopy(text, resolve, reject);
        });
      } else {
        // 方法2: execCommandフォールバック（HTTP・古いブラウザ・iPhone Safari保険）
        fallbackCopy(text, resolve, reject);
      }
    });
  }

  function fallbackCopy(text, resolve, reject) {
    try {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      // iOS Safari対策：画面外に配置 + readonly + フォントサイズ16px（ズーム防止）
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.fontSize = '16px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);

      // iOS Safari対策：選択範囲を明示的に設定
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        var range = document.createRange();
        range.selectNodeContents(textarea);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textarea.setSelectionRange(0, text.length);
      } else {
        textarea.select();
      }

      var successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        resolve('execCommand');
      } else {
        reject(new Error('execCommand returned false'));
      }
    } catch (err) {
      reject(err);
    }
  }

  // コピーボタンの共通ハンドラー
  function copyText(text) {
    copyToClipboard(text).then(function() {
      showToast('コピーしました');
    }).catch(function(err) {
      console.error('Copy failed:', err);
      showToast('コピーできませんでした。長押しで選択してください', true);
    });
  }
  window.copyText = copyText;

  /* ----------------------------------------
     localStorage 安全ラッパ
     - プライベートブラウズ等で例外が出ても落ちない
     ---------------------------------------- */
  function lsGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function lsSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function lsRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
  window.lsGet = lsGet;
  window.lsSet = lsSet;
  window.lsRemove = lsRemove;

  /* ----------------------------------------
     入力フィールドの自動保存・復元
     data-store="キー名" 属性のついたinput/textareaを自動管理
     ---------------------------------------- */
  function initFieldStorage() {
    var fields = document.querySelectorAll('[data-store]');
    fields.forEach(function(field) {
      var key = 'wb_' + field.getAttribute('data-store');
      var saved = lsGet(key);
      if (saved !== null) {
        if (field.type === 'checkbox') {
          field.checked = saved === '1';
        } else {
          field.value = saved;
        }
      }
      // 入力時に保存
      var eventName = field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(eventName, function() {
        if (field.type === 'checkbox') {
          lsSet(key, field.checked ? '1' : '0');
        } else {
          lsSet(key, field.value);
        }
      });
    });
  }

  /* ----------------------------------------
     テンプレート組み立て
     - フォーム入力値を埋め込んでプロンプトを生成
     ---------------------------------------- */
  function buildTemplate(templateText, fields) {
    var result = templateText;
    Object.keys(fields).forEach(function(key) {
      var value = fields[key];
      // 【キー名】 をユーザー入力で置き換え（空なら【キー名】のまま）
      var placeholder = '【' + key + '】';
      if (value && value.trim() !== '') {
        result = result.split(placeholder).join(value.trim());
      }
    });
    return result;
  }
  window.buildTemplate = buildTemplate;

  /* ----------------------------------------
     コピーボタンの自動配線
     data-copy-target="ID" → そのIDの要素のテキストをコピー
     data-copy-text="..." → 直接指定したテキストをコピー
     ---------------------------------------- */
  function initCopyButtons() {
    var buttons = document.querySelectorAll('[data-copy-target], [data-copy-text]');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var text;
        var targetId = btn.getAttribute('data-copy-target');
        if (targetId) {
          var target = document.getElementById(targetId);
          if (!target) return;
          text = target.textContent || target.innerText || target.value;
        } else {
          text = btn.getAttribute('data-copy-text') || '';
        }
        copyText(text);
      });
    });
  }

  /* ----------------------------------------
     初期化
     ---------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initFieldStorage();
    initCopyButtons();
  }
})();

/* ========================================
   追加機能：検索・お気に入り・SOS・ポイント
   ======================================== */
(function() {
  'use strict';

  /* ----- お気に入り ----- */
  // お気に入りリストはページ横断で1つ：wb_favs = JSON配列 [{id, page, num, title}]
  function getFavs() {
    var raw = window.lsGet('favs');
    if (!raw) return [];
    try {
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch(e) {
      return [];
    }
  }
  function setFavs(favs) {
    window.lsSet('favs', JSON.stringify(favs));
  }
  function isFav(id) {
    return getFavs().some(function(f) { return f.id === id; });
  }
  function toggleFav(entry) {
    var favs = getFavs();
    var idx = -1;
    for (var i = 0; i < favs.length; i++) {
      if (favs[i].id === entry.id) { idx = i; break; }
    }
    if (idx >= 0) {
      favs.splice(idx, 1);
      setFavs(favs);
      window.showToast('お気に入りから外しました');
      return false;
    } else {
      favs.push(entry);
      setFavs(favs);
      window.showToast('★ お気に入りに追加');
      return true;
    }
  }
  window.fav = { get: getFavs, set: setFavs, is: isFav, toggle: toggleFav };

  /* ----- お気に入りパネルの描画 ----- */
  // Page filter: only show favorites belonging to "this page" group
  // Favorites entry: {id, page, num, title}
  // page values: 'email', 'meeting', 'document'
  function renderFavsPanel(panelId, currentPage) {
    var panel = document.getElementById(panelId);
    if (!panel) return;
    var favs = getFavs();
    var summary = panel.querySelector('summary');
    var listEl = panel.querySelector('.favs-list');
    var countEl = panel.querySelector('.fav-count');
    if (!listEl) return;

    if (countEl) countEl.textContent = String(favs.length);

    if (favs.length === 0) {
      listEl.innerHTML = '<div class="favs-list-empty">★ をタップしてよく使うプロンプトを登録してください</div>';
      return;
    }

    var pageNames = { prompts: 'プロンプト集', templates: 'テンプレート', starter: 'スターター' };
    var pageFiles = { prompts: 'prompts.html', templates: 'templates.html', starter: 'starter.html' };

    var html = '';
    favs.forEach(function(f) {
      var sameAsCurrent = (f.page === currentPage);
      var href = sameAsCurrent ? '#' + f.id : pageFiles[f.page] + '#' + f.id;
      var pageLabel = pageNames[f.page] || '';
      html += '<a href="' + href + '" class="fav-link" data-id="' + escapeAttr(f.id) + '" data-same="' + (sameAsCurrent ? '1' : '0') + '">';
      html += '<span class="fav-num">' + escapeHtml(f.num || '') + '</span>';
      html += '<span>' + escapeHtml(f.title) + '</span>';
      html += '<span class="fav-arrow">›</span>';
      html += '</a>';
    });
    listEl.innerHTML = html;

    // 同じページ内のリンクは preventDefault でスムーススクロール＋ハイライト
    listEl.querySelectorAll('.fav-link').forEach(function(a) {
      if (a.getAttribute('data-same') === '1') {
        a.addEventListener('click', function(e) {
          e.preventDefault();
          var id = a.getAttribute('data-id');
          scrollToTemplate(id);
          // パネルを閉じる
          panel.removeAttribute('open');
        });
      }
    });
  }
  window.renderFavsPanel = renderFavsPanel;

  /* ----- スクロール＋ハイライト ----- */
  function scrollToTemplate(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.remove('highlight-flash');
    void el.offsetWidth;
    el.classList.add('highlight-flash');
  }
  window.scrollToTemplate = scrollToTemplate;

  /* ----- 検索 ----- */
  function initSearch(inputId, clearBtnId, noResultId) {
    var input = document.getElementById(inputId);
    var clearBtn = document.getElementById(clearBtnId);
    var noResult = document.getElementById(noResultId);
    if (!input) return;

    function applyFilter() {
      var q = input.value.trim().toLowerCase();
      if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);
      var cards = document.querySelectorAll('.template-card');
      var visibleCount = 0;
      cards.forEach(function(card) {
        if (q === '') {
          card.classList.remove('search-hidden');
          visibleCount++;
          return;
        }
        var text = (card.textContent || '').toLowerCase();
        if (text.indexOf(q) >= 0) {
          card.classList.remove('search-hidden');
          visibleCount++;
        } else {
          card.classList.add('search-hidden');
        }
      });
      if (noResult) {
        noResult.classList.toggle('visible', q !== '' && visibleCount === 0);
      }
    }
    input.addEventListener('input', applyFilter);
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        input.value = '';
        applyFilter();
        input.focus();
      });
    }
  }
  window.initSearch = initSearch;

  /* ----- SOS パネル ----- */
  function initSOS() {
    var fab = document.getElementById('sos-fab');
    var overlay = document.getElementById('sos-overlay');
    var closeBtn = document.getElementById('sos-close');
    if (!fab || !overlay) return;

    function open() {
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }
    fab.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('visible')) close();
    });
  }
  window.initSOS = initSOS;

  /* ----- ハッシュリンクで開いた時の自動スクロール＋ハイライト ----- */
  function initHashScroll() {
    function processHash() {
      var hash = location.hash.replace('#', '');
      if (!hash) return;
      // テンプレ描画後に実行するため少し遅延
      setTimeout(function() {
        var el = document.getElementById(hash);
        if (el && el.classList.contains('template-card')) {
          scrollToTemplate(hash);
        }
      }, 100);
    }
    if (location.hash) processHash();
    window.addEventListener('hashchange', processHash);
  }
  window.initHashScroll = initHashScroll;

  /* ----- ポイント（💡）折りたたみ ----- */
  function initPointToggles() {
    document.addEventListener('click', function(e) {
      var t = e.target.closest('.point-toggle');
      if (!t) return;
      e.preventDefault();
      var box = t.nextElementSibling;
      if (!box || !box.classList.contains('point-box')) return;
      var expanded = box.classList.toggle('expanded');
      t.classList.toggle('expanded', expanded);
      t.firstChild && (t.firstChild.textContent = expanded ? 'ポイントを閉じる' : 'ポイントを見る');
    });
  }
  window.initPointToggles = initPointToggles;

  /* ----- ヘルパ ----- */
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

})();
