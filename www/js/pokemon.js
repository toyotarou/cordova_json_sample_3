// PokeAPI データのURL
const POKEDEX_URL =
'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';

// ポケモン一覧を取得する関数
// limit: 何匹分取得するか（デフォルト151匹）
async function fetchPokemonList(limit = 151) {
    const res = await fetch(POKEDEX_URL);

    // 通信が失敗した場合はエラーを投げる
    if (!res.ok) throw new Error('データの取得に失敗しました');

    const data = await res.json();

    // 配列の先頭からlimit件だけ返す
    return data.slice(0, limit);
}
