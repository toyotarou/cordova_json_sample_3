// Cordovaの準備が完了したら onDeviceReady を呼ぶ
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
initApp();
}

// ブラウザで確認するとき用（cordovaがない環境でも動くように）
if (!window.cordova) {
initApp();
}



// アプリの初期化
async function initApp() {

    // 起動時はローディングを表示
    setLoading(true);

    try {
        // pokemon.js の関数でデータ取得
        const pokemonList = await fetchPokemonList(151);

        // 1匹ずつカードを描画（ui.js の関数を使う）
        pokemonList.forEach(pokemon => renderPokemonCard(pokemon));

    } catch (e) {
        // 通信失敗などのエラー時はメッセージを表示
        const errEl = document.getElementById('error-message');
        errEl.textContent = 'データの読み込みに失敗しました: ' + e.message;
        errEl.style.display = 'block';

    } finally {
        // 成功でも失敗でも、ローディングは必ず消す
        setLoading(false);
    }

    // --- イベント設定 ---

    // ✕ボタンでダイアログを閉じる
    document.getElementById('dialog-close').addEventListener('click', () => {
        document.getElementById('dialog-overlay').style.display = 'none';
    });

    // ダイアログの外側（暗い部分）をタップしても閉じる
    document.getElementById('dialog-overlay').addEventListener('click', (e) => {
        // e.target はクリックされた要素
        // e.currentTarget はイベントを設定した要素（overlay自身）
        // 両方が同じ = overlay自身をタップした = 外側をタップした
        if (e.target === e.currentTarget) {
            e.currentTarget.style.display = 'none';
        }
    });

    // スライダーの矢印ボタン
    let currentSlide = 0;

    document.getElementById('prev-btn').addEventListener('click', () => {
        const slider = document.getElementById('evolution-slider');
        const slides = slider.querySelectorAll('.slide');

        if (currentSlide > 0) {
            currentSlide--;
            // スムーズにスクロール
            slider.scrollTo({ left: currentSlide * slider.offsetWidth, behavior: 'smooth' });
            updateSliderUI(currentSlide);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        const slider = document.getElementById('evolution-slider');
        const slides = slider.querySelectorAll('.slide');

        if (currentSlide < slides.length - 1) {
            currentSlide++;
            slider.scrollTo({ left: currentSlide * slider.offsetWidth, behavior: 'smooth' });
            updateSliderUI(currentSlide);
        }
    });
}
