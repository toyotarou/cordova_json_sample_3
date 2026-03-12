/**
 * app.js - エントリーポイント
 *
 * Cordova では window.onload ではなく "deviceready" イベントを使う。
 * deviceready は Cordova のネイティブ機能が使える状態になったタイミングで発火する。
 * fetch など Web API はそれ以前でも動くが、統一して deviceready 内で処理する。
 */
document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
  UI.init();
  UI.showLoading();

  try {
    const pokemonList = await PokemonStore.fetchAll();
    // prev_evolution がないものだけ表示（基本形のポケモン）
    const baseList = pokemonList.filter((p) => !p.prev_evolution);
    UI.renderList(baseList);
  } catch (err) {
    console.error('Failed to load Pokémon data:', err);
    UI.showError('データの読み込みに失敗しました。ネットワーク接続を確認してください。');
  } finally {
    UI.hideLoading();
  }
}
