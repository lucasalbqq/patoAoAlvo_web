import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../config/game.php', import.meta.url), 'utf8');
const expectedBows = ['Básico', 'Melhorado', 'Épico', 'Lendário'];
const expectedDucks = ['Pato Comum', 'Pato Azul', 'Pato Vermelho', 'Pato Roxo', 'Pato Dourado', 'Pato Rei'];

assert.match(config, /'title'\s*=>\s*'Pato ao Alvo'/, 'O nome oficial deve permanecer Pato ao Alvo.');
assert.equal(
    expectedBows.filter((bow) => config.includes(`'name' => '${bow}'`)).length,
    4,
    'A configuração deve conter exatamente os quatro arcos oficiais.',
);
for (const price of [0, 300, 800, 1500]) {
    assert.match(
        config,
        new RegExp(`'price'\\s*=>\\s*${price}`),
        `O preço oficial de ${price} moedas deve permanecer na configuração.`,
    );
}
for (const duck of expectedDucks) {
    assert.ok(config.includes(`'name' => '${duck}'`), `${duck} deve permanecer na configuração.`);
}
for (const health of [2, 3, 4, 6, 8, 12]) {
    assert.match(config, new RegExp(`'health'\\s*=>\\s*${health}`), `A vida ${health} deve estar configurada.`);
}
for (const cadence of ['.80', '1.05', '1.35', '1.70']) {
    assert.ok(config.includes(`'shotsPerSecond' => ${cadence}`), `A cadência ${cadence} deve estar configurada.`);
}
for (const reward of ["'points' => 5, 'coins' => 4", "'points' => 60, 'coins' => 45"]) {
    assert.ok(config.includes(reward), `A recompensa reduzida ${reward} deve estar configurada.`);
}
assert.doesNotMatch(config, /MathuPomo|Pombo ao Alvo/i, 'Nomes antigos não podem aparecer na configuração.');

console.log('✓ Configuração central validada: nome e quatro arcos oficiais.');
