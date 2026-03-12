/**
 * PokemonStore - データ取得とモデル管理
 * Cordova では状態管理ライブラリは不要。
 * モジュールパターンで Store を表現する。
 */
const PokemonStore = (() => {
  const API_URL =
    'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json';

  let _pokemon = [];



  /**
   * PokeAPI の公式スプライト URL を返す（HTTPS・安定して動作）
   * serebii.net の画像はリンク切れのため差し替え。
   * id は数値（1, 2, 3...）で受け取る。
   */
  const spriteUrl = (id) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;



  /** 全ポケモンを取得して内部に保持する */
  const fetchAll = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    // img を PokeAPI スプライトに差し替える
    _pokemon = data.pokemon.map((p) => ({ ...p, img: spriteUrl(p.id) }));
    return _pokemon;
  };



  /** num（"001" 形式）でポケモンを取得 */
  const getByNum = (num) => _pokemon.find((p) => p.num === num) || null;



  /**
   * 進化チェーンを配列で返す
   * [ ...prev_evolution, current, ...next_evolution ]
   * それぞれ PokemonStore 内のオブジェクトに解決済み
   */
  const getEvolutionChain = (pokemon) => {
    const chain = [];

    if (pokemon.prev_evolution) {
      pokemon.prev_evolution.forEach((e) => {
        const p = getByNum(e.num);
        if (p) chain.push(p);
      });
    }

    chain.push(pokemon);

    if (pokemon.next_evolution) {
      pokemon.next_evolution.forEach((e) => {
        const p = getByNum(e.num);
        if (p) chain.push(p);
      });
    }

    return chain;
  };



  /** 進化チェーン内での現在ポケモンのインデックス */
  const getCurrentIndexInChain = (pokemon, chain) =>
    chain.findIndex((p) => p.num === pokemon.num);


  
  return { fetchAll, getByNum, getEvolutionChain, getCurrentIndexInChain };
})();
