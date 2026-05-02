/* ========================================
   テンプレート共通レンダラー（v3）
   - フォーム式 / テキスト式 両対応
   - カテゴリヘッダー対応
   - お気に入り、💡ポイント、番号、検索対応
   ======================================== */
(function() {
  'use strict';

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function fieldIdFor(tpl, key) {
    // 日本語キーも一意なIDに（encodeURIComponentで全文字をASCII化）
    return tpl.id + '_' + encodeURIComponent(key).replace(/%/g, '');
  }

  function highlightPlaceholders(text) {
    var html = escapeHtml(text);
    return html.replace(/【([^】]+)】/g, '<span class="placeholder">【$1】</span>');
  }

  function assembleBlank(tpl) {
    return tpl.template.replace(/\{([^}]+)\}/g, function(m, key) {
      return '【' + key + '】';
    });
  }

  function assembleFilled(tpl) {
    var result = tpl.template;
    if (!tpl.fields) return assembleBlank(tpl);
    tpl.fields.forEach(function(f) {
      var inputId = fieldIdFor(tpl, f.key);
      var el = document.getElementById(inputId);
      var value = el && el.value && el.value.trim() ? el.value.trim() : '【' + f.key + '】';
      result = result.split('{' + f.key + '}').join(value);
    });
    return result;
  }

  function findTemplate(templates, id) {
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].id === id) return templates[i];
    }
    return null;
  }

  function renderCard(tpl, container, pageKey) {
    var card = document.createElement('section');
    card.className = 'template-card';
    card.id = tpl.id;

    var num = tpl.num || '';
    var html = '';

    html += '<button type="button" class="fav-toggle" data-fav-id="' + escapeHtml(tpl.id) + '" aria-label="お気に入り" title="お気に入り">★</button>';
    if (num) html += '<div class="template-num">' + escapeHtml(num) + '</div>';
    html += '<h3 class="template-title">' + escapeHtml(tpl.title) + '</h3>';
    html += '<p class="desc">' + escapeHtml(tpl.desc || '') + '</p>';

    if (tpl.mode === 'text') {
      var promptText = assembleBlank(tpl);
      html += '<div class="prompt-text-display">' + highlightPlaceholders(promptText) + '</div>';
      html += '<div class="btn-row">';
      html += '<button type="button" class="btn btn-primary" data-action="copy-text" data-tpl="' + tpl.id + '">📋 このプロンプトをコピー</button>';
      html += '</div>';
    } else {
      (tpl.fields || []).forEach(function(f) {
        var inputId = fieldIdFor(tpl, f.key);
        html += '<div class="field-group">';
        html += '<label class="field-label" for="' + inputId + '">' + escapeHtml(f.label) + '</label>';
        if (f.type === 'textarea') {
          html += '<textarea class="field-textarea" id="' + inputId + '" data-store="' + inputId + '" placeholder="' + escapeHtml(f.placeholder || '') + '" rows="2"></textarea>';
        } else {
          html += '<input type="text" class="field-input" id="' + inputId + '" data-store="' + inputId + '" placeholder="' + escapeHtml(f.placeholder || '') + '">';
        }
        html += '</div>';
      });
      html += '<div class="btn-row">';
      html += '<button type="button" class="btn btn-primary" data-action="copy-filled" data-tpl="' + tpl.id + '">入力した内容でコピー</button>';
      html += '<button type="button" class="btn btn-secondary" data-action="copy-blank" data-tpl="' + tpl.id + '">空欄のままコピー</button>';
      html += '</div>';
      html += '<details><summary>テンプレ全文を見る</summary><div class="preview-text" id="prev_' + tpl.id + '"></div></details>';
    }

    if (tpl.point) {
      html += '<button type="button" class="point-toggle"><span>ポイントを見る</span></button>';
      html += '<div class="point-box">' + escapeHtml(tpl.point) + '</div>';
    }

    card.innerHTML = html;
    container.appendChild(card);

    if (tpl.mode !== 'text') {
      var prev = document.getElementById('prev_' + tpl.id);
      if (prev) prev.textContent = assembleBlank(tpl);
    }

    var starBtn = card.querySelector('.fav-toggle');
    if (starBtn && window.fav && window.fav.is(tpl.id)) starBtn.classList.add('is-fav');
    if (starBtn) {
      starBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var entry = { id: tpl.id, page: pageKey, num: num, title: tpl.title };
        var added = window.fav.toggle(entry);
        starBtn.classList.toggle('is-fav', added);
        var panel = document.getElementById('favs-panel');
        if (panel) window.renderFavsPanel('favs-panel', pageKey);
      });
    }
  }

  function wireButtons(container, templates) {
    container.querySelectorAll('[data-action]').forEach(function(btn) {
      if (btn.dataset._wired) return;
      btn.dataset._wired = '1';
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var action = btn.getAttribute('data-action');
        var tplId = btn.getAttribute('data-tpl');
        var tpl = findTemplate(templates, tplId);
        if (!tpl) return;
        var text;
        if (action === 'copy-text') text = assembleBlank(tpl);
        else if (action === 'copy-filled') text = assembleFilled(tpl);
        else text = assembleBlank(tpl);
        window.copyText(text);
      });
    });
    container.querySelectorAll('[data-store]').forEach(function(field) {
      if (field.dataset._wired) return;
      field.dataset._wired = '1';
      var key = 'wb_' + field.getAttribute('data-store');
      var saved = window.lsGet(key);
      if (saved !== null) field.value = saved;
      field.addEventListener('input', function() { window.lsSet(key, field.value); });
    });
  }

  /**
   * テンプレを描画（カテゴリヘッダー対応）
   * @param {Array} templates テンプレ配列
   * @param {string} containerId 描画先要素ID
   * @param {string} pageKey ページ識別子
   * @param {Object} options { categories: [{id,name,emoji}], showCategoryHeaders: boolean }
   */
  function renderTemplates(templates, containerId, pageKey, options) {
    options = options || {};
    var container = document.getElementById(containerId);
    if (!container) return;

    if (options.showCategoryHeaders && options.categories) {
      var lastCat = null;
      templates.forEach(function(tpl) {
        if (tpl.cat && tpl.cat !== lastCat) {
          var cinfo = options.categories.filter(function(c) { return c.id === tpl.cat; })[0];
          if (cinfo) {
            var count = templates.filter(function(t) { return t.cat === tpl.cat; }).length;
            var header = document.createElement('div');
            header.className = 'cat-header';
            header.id = 'cat-' + tpl.cat;
            header.innerHTML =
              '<span class="cat-header-emoji">' + escapeHtml(cinfo.emoji || '') + '</span>' +
              '<span class="cat-header-name">' + escapeHtml(cinfo.name) + '</span>' +
              '<span class="cat-header-count">' + count + '本</span>';
            container.appendChild(header);
          }
          lastCat = tpl.cat;
        }
        renderCard(tpl, container, pageKey);
      });
    } else {
      templates.forEach(function(tpl) {
        renderCard(tpl, container, pageKey);
      });
    }

    wireButtons(container, templates);
  }
  window.renderTemplates = renderTemplates;

  /* カテゴリジャンプメニュー描画 */
  function renderCategoryNav(navId, categories, prompts) {
    var nav = document.getElementById(navId);
    if (!nav) return;
    var html = '';
    categories.forEach(function(c) {
      var count = prompts.filter(function(p) { return p.cat === c.id; }).length;
      if (count === 0) return;
      html += '<a href="#cat-' + c.id + '" class="cat-nav-link" data-cat="' + c.id + '">';
      html += '<span class="cat-nav-emoji">' + escapeHtml(c.emoji || '') + '</span>';
      html += '<span class="cat-nav-name">' + escapeHtml(c.name) + '</span>';
      html += '<span class="cat-nav-count">' + count + '</span>';
      html += '</a>';
    });
    nav.innerHTML = html;

    // スムーススクロール
    nav.querySelectorAll('.cat-nav-link').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var cat = a.getAttribute('data-cat');
        var target = document.getElementById('cat-' + cat);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
  window.renderCategoryNav = renderCategoryNav;
})();

/* ========================================
   SOS：急ぎ・困ったとき（5本）
   トラブル系のシチュエーションプロンプト＋謝罪メール
   ======================================== */
window.SOS_ENTRIES = [
  { id: 'sit_e1', page: 'prompts', file: 'prompts.html',  cat: '緊急', title: 'ミス発覚直後の自己整理',           blurb: '次にすべき行動を時系列で整理' },
  { id: 'sit_e2', page: 'prompts', file: 'prompts.html',  cat: '緊急', title: '締切に間に合わない時の連絡',         blurb: '事実→新期限→代替案で連絡文を作成' },
  { id: 'sit_e3', page: 'prompts', file: 'prompts.html',  cat: '緊急', title: 'クレーム受けた直後の対応',           blurb: '5分以内のすべきこと整理' },
  { id: 'sit_e4', page: 'prompts', file: 'prompts.html',  cat: '緊急', title: 'メール誤送信に気づいた時のフロー',   blurb: '訂正メールの即時対応' },
  { id: 'tpl_email_e', page: 'templates', file: 'templates.html', cat: 'メール', title: '謝罪・訂正メール',  blurb: 'フォーム入力で謝罪文を即生成' }
];

/* SOSリスト描画 */
window.renderSOSList = function(listId, currentPage) {
  var listEl = document.getElementById(listId);
  if (!listEl) return;
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  var html = '';
  window.SOS_ENTRIES.forEach(function(e) {
    var sameAsCurrent = (e.page === currentPage);
    var href = sameAsCurrent ? '#' + e.id : e.file + '#' + e.id;
    html += '<a href="' + escapeHtml(href) + '" class="sos-link" data-id="' + escapeHtml(e.id) + '" data-same="' + (sameAsCurrent ? '1' : '0') + '">';
    html += '<span class="sos-link-title"><span class="sos-cat-tag">' + escapeHtml(e.cat) + '</span>' + escapeHtml(e.title) + '</span>';
    html += '<span class="sos-link-desc">' + escapeHtml(e.blurb) + '</span>';
    html += '</a>';
  });
  listEl.innerHTML = html;
  listEl.querySelectorAll('.sos-link').forEach(function(a) {
    if (a.getAttribute('data-same') === '1') {
      a.addEventListener('click', function(ev) {
        ev.preventDefault();
        var id = a.getAttribute('data-id');
        var overlay = document.getElementById('sos-overlay');
        if (overlay) {
          overlay.classList.remove('visible');
          document.body.style.overflow = '';
        }
        if (window.scrollToTemplate) window.scrollToTemplate(id);
      });
    }
  });
};

/* ========================================
   スターターセット（5本）：最初に試すおすすめ
   ======================================== */
window.STARTER_PICKS = [
  'sit_a1',       // 朝のタスク優先順位付け
  'tpl_email_a',  // 社内報告メール
  'tpl_meet_b',   // 会議メモ→議事録
  'tpl_doc_a',    // ヒアリングシート
  'sit_g2'        // 1週間の振り返り
];
