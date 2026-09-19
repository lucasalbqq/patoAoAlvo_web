import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../config/game.php', import.meta.url), 'utf8');
const expectedBows = [
    ['Arco de Madeira', 'Flecha de Madeira'],
    ['Arco Reforçado', 'Flecha Reforçada'],
    ['Arco de Caçador', 'Flecha de Caçador'],
    ['Arco de Ferro', 'Flecha de Ferro'],
    ['Arco Flamejante', '🔥 Flecha de Fogo'],
    ['Arco Congelante', '❄️ Flecha de Gelo'],
    ['Arco Elétrico', '⚡ Flecha Elétrica'],
    ['Arco de Cristal', '💎 Flecha de Cristal'],
    ['Arco Lendário', '🌟 Flecha Lendária'],
    ['Arco Supremo', '👑 Flecha Suprema'],
];
const expectedDucks = ['Pato Comum', 'Pato Azul', 'Pato Vermelho', 'Pato Roxo', 'Pato Dourado', 'Pato Rei'];

assert.match(config, /'title'\s*=>\s*'Pato ao Alvo'/, 'O nome oficial deve permanecer Pato ao Alvo.');
for (const [bow, arrow] of expectedBows) {
    assert.ok(config.includes(`'name' => '${bow}'`), `${bow} deve estar configurado.`);
    assert.ok(config.includes(`'arrowName' => '${arrow}'`), `${arrow} deve estar configurada.`);
}
assert.equal((config.match(/'arrowName'\s*=>/g) ?? []).length, 10, 'A configuração deve conter dez flechas.');
for (const price of [0, 150, 400, 800, 1400, 2200, 3200, 4500, 6500, 9000]) {
    assert.match(config, new RegExp(`'price'\\s*=>\\s*${price}`), `O preço ${price} deve estar configurado.`);
}
for (const effect of ['fire', 'freeze', 'chain', 'crystal', 'legendary', 'supreme']) {
    assert.ok(config.includes(`'specialEffect' => '${effect}'`), `O gancho futuro ${effect} deve existir.`);
}
assert.equal(
    (config.match(/'specialEffectEnabled'\s*=>\s*false/g) ?? []).length,
    10,
    'Nenhum efeito especial pode estar ativo nesta versão.',
);
for (const duck of expectedDucks) {
    assert.ok(config.includes(`'name' => '${duck}'`), `${duck} deve permanecer na configuração.`);
}
for (const health of [2, 3, 4, 6, 8, 12]) {
    assert.match(config, new RegExp(`'health'\\s*=>\\s*${health}`), `A vida ${health} deve estar configurada.`);
}
assert.doesNotMatch(config, /MathuPomo|Pombo ao Alvo/i, 'Nomes antigos não podem aparecer na configuração.');

console.log('✓ Configuração central validada: nome, dez arcos e dez flechas oficiais.');
