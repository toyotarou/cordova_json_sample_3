// ローディング表示の切り替え
// visible が true なら表示、false なら非表示
function setLoading(visible) {
    const el = document.getElementById('loading');
    el.style.display = visible ? 'flex' : 'none';
}

// ポケモン1匹分のカードをリストに追加する
// pokemon: fetchPokemonList() で取得した1件分のデータ
function renderPokemonCard(pokemon) {
    const list = document.getElementById('pokemon-list');

    // idを3桁にする（例: 1 → "001"）
    // これは画像URLの形式に合わせるため
    const id = String(pokemon.id).padStart(3, '0');

    // 画像URL（同じGitHubリポジトリにスプライト画像がある）
    const imgUrl =
    `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/sprites/${id}.png`;

    // <li> 要素を作成
    const li = document.createElement('li');
    li.className = 'pokemon-card';

// カードの中身をHTMLで組み立てる
li.innerHTML = `
<img src="${imgUrl}" alt="${pokemon.name.english}">
<div class="card-info">
<span class="pokemon-number">#${id}</span>
<span class="pokemon-name">${pokemon.name.english}</span>
<div class="type-badges">
${pokemon.type.map(t =>
`<span class="type-badge type-${t.toLowerCase()}">${t}</span>`
).join('')}
</div>
</div>
`;

    // カードをタップしたらダイアログを表示する
    li.addEventListener('click', () => showDialog(pokemon));

    // リストに追加
    list.appendChild(li);
}



// ダイアログを表示する
function showDialog(pokemon) {
    const overlay = document.getElementById('dialog-overlay');
    const slider = document.getElementById('evolution-slider');

    // タイトルにポケモン名をセット
    document.getElementById('dialog-title').textContent = pokemon.name.english;

    // 前回の内容をリセット
    slider.innerHTML = '';

    // --- スライド1: 基本情報 ---
    const id = String(pokemon.id).padStart(3, '0');
    const slide1 = document.createElement('div');
    slide1.className = 'slide';
slide1.innerHTML = `
<img
src="https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/sprites/${id}.png"
alt="${pokemon.name.english}">
<h2>${pokemon.name.english}</h2>
<p>日本語名：${pokemon.name.japanese}</p>
<div class="type-badges">
${pokemon.type.map(t =>
`<span class="type-badge type-${t.toLowerCase()}">${t}</span>`
).join('')}
</div>
`;

    // --- スライド2: ステータス ---
    const slide2 = document.createElement('div');
    slide2.className = 'slide';
slide2.innerHTML = `
<h3>Base Stats</h3>
${Object.entries(pokemon.base).map(([key, val]) => `
<div class="stat-row">
<span class="stat-label">${key}</span>
<div class="stat-bar-bg">
<div class="stat-bar" style="width:${Math.min(val / 255 * 100, 100)}%"></div>
</div>
<span class="stat-value">${val}</span>
</div>
`).join('')}
`;

    // スライダーに追加
    slider.appendChild(slide1);
    slider.appendChild(slide2);

    // ドットとカウンターを初期化（1枚目を表示）
    updateSliderUI(0);

    // ダイアログを表示
    overlay.style.display = 'flex';
}



// スライダーのドットとカウンターを更新する
// index: 現在表示中のスライド番号（0始まり）
function updateSliderUI(index) {
    const slider = document.getElementById('evolution-slider');
    const slides = slider.querySelectorAll('.slide');

    // "1 / 2" のような表示
    document.getElementById('slide-counter').textContent =
    `${index + 1} / ${slides.length}`;

// ドットを作り直す（現在地をactiveにする）
document.getElementById('slider-dots').innerHTML =
Array.from(slides).map((_, i) =>
`<span class="dot ${i === index ? 'active' : ''}"></span>`
).join('');
}
