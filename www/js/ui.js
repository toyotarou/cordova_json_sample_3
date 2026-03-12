/**
 * UI モジュール - レンダリングとインタラクション
 */
const UI = (() => {
  // ---------- ポケモンリスト ----------

  /** ポケモンリストをレンダリングする */
  const renderList = (pokemonList) => {
    const listEl = document.getElementById('pokemon-list');
    listEl.innerHTML = '';

    pokemonList.forEach((pokemon) => {
      const item = _createListItem(pokemon);
      listEl.appendChild(item);
    });
  };



  const _createListItem = (pokemon) => {
    const li = document.createElement('li');
    li.className = 'pokemon-item';
    li.innerHTML = `
      <img class="pokemon-thumb" src="${pokemon.img}" alt="${pokemon.name}" loading="lazy">
      <div class="pokemon-info">
        <span class="pokemon-num">No. ${pokemon.num}</span>
        <span class="pokemon-name">${pokemon.name}</span>
      </div>
    `;
    li.addEventListener('click', () => openDialog(pokemon));
    return li;
  };



  // ---------- ダイアログ（進化チェーン PageView）----------

  /** ダイアログを開く */
  const openDialog = (pokemon) => {
    const chain = PokemonStore.getEvolutionChain(pokemon);
    const startIndex = PokemonStore.getCurrentIndexInChain(pokemon, chain);

    _buildSlider(chain, startIndex);

    const overlay = document.getElementById('dialog-overlay');
    overlay.classList.add('active');
  };



  /** ダイアログを閉じる */
  const closeDialog = () => {
    const overlay = document.getElementById('dialog-overlay');
    overlay.classList.remove('active');
  };



  /**
   * 進化チェーン PageView（スライダー）を構築する
   * CSS scroll-snap でページ送りを実現する。
   * Cordova / モバイル WebView でネイティブのスワイプ操作が使える。
   */
  const _buildSlider = (chain, startIndex) => {
    const slider = document.getElementById('evolution-slider');
    const dots = document.getElementById('slider-dots');
    const counter = document.getElementById('slide-counter');

    slider.innerHTML = '';
    dots.innerHTML = '';

    chain.forEach((pokemon, i) => {
      // スライド
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = _slideTemplate(pokemon);
      slider.appendChild(slide);

      // ドットインジケーター
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === startIndex ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dots.appendChild(dot);
    });

    // スライド枚数表示を更新する関数をスコープ外でも使えるよう保持
    const updateIndicators = (index) => {
      counter.textContent = `${index + 1} / ${chain.length}`;
      dots.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    };

    /** スクロール位置からカレントインデックスを計算してインジケーターを更新 */
    const onScroll = () => {
      const index = Math.round(slider.scrollLeft / slider.offsetWidth);
      updateIndicators(index);
    };

    slider.removeEventListener('scroll', slider._scrollHandler);
    slider._scrollHandler = onScroll;
    slider.addEventListener('scroll', onScroll);

    // 矢印ボタン
    document.getElementById('prev-btn').onclick = () => {
      const cur = Math.round(slider.scrollLeft / slider.offsetWidth);
      goToSlide(Math.max(0, cur - 1));
    };
    document.getElementById('next-btn').onclick = () => {
      const cur = Math.round(slider.scrollLeft / slider.offsetWidth);
      goToSlide(Math.min(chain.length - 1, cur + 1));
    };

    const goToSlide = (index) => {
      slider.scrollTo({ left: index * slider.offsetWidth, behavior: 'smooth' });
      updateIndicators(index);
    };

    // ダイアログタイトル
    document.getElementById('dialog-title').textContent = 'Evolution Chain';

    // 初期位置へジャンプ（smooth だと開くアニメーションと競合するため instant）
    requestAnimationFrame(() => {
      slider.scrollTo({ left: startIndex * slider.offsetWidth, behavior: 'instant' });
      updateIndicators(startIndex);
    });
  };



  const _slideTemplate = (pokemon) => {
    const types = pokemon.type.map((t) => `<span class="type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
    const weaknesses = pokemon.weaknesses
      ? pokemon.weaknesses.map((w) => `<span class="weakness-badge">${w}</span>`).join('')
      : '';
    return `
      <div class="slide-inner">
        <img class="slide-img" src="${pokemon.img}" alt="${pokemon.name}">
        <h2 class="slide-name">${pokemon.name}</h2>
        <p class="slide-num">No. ${pokemon.num}</p>
        <div class="slide-types">${types}</div>
        <div class="slide-stats">
          <div class="stat"><span class="stat-label">Height</span><span>${pokemon.height}</span></div>
          <div class="stat"><span class="stat-label">Weight</span><span>${pokemon.weight}</span></div>
          <div class="stat"><span class="stat-label">Egg</span><span>${pokemon.egg}</span></div>
        </div>
        ${weaknesses ? `<div class="slide-weaknesses"><p class="weak-label">Weaknesses</p>${weaknesses}</div>` : ''}
      </div>
    `;
  };



  // ---------- ローディング表示 ----------
  const showLoading = () => {
    document.getElementById('loading').style.display = 'flex';
  };



  const hideLoading = () => {
    document.getElementById('loading').style.display = 'none';
  };



  const showError = (message) => {
    const el = document.getElementById('error-message');
    el.textContent = message;
    el.style.display = 'block';
  };


  
  // ---------- 初期化（イベント登録）----------
  const init = () => {
    // オーバーレイ背景クリックで閉じる
    document.getElementById('dialog-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeDialog();
    });
    // 閉じるボタン
    document.getElementById('dialog-close').addEventListener('click', closeDialog);
  };



  return { renderList, openDialog, closeDialog, showLoading, hideLoading, showError, init };
})();
