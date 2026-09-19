<?php

declare(strict_types=1);

return [
    'title' => 'Pato ao Alvo',
    'version' => '1.2.1',
    'roundDuration' => 60,
    'bows' => [
        1 => [
            'name' => 'Básico',
            'price' => 0,
            'damage' => 1,
            'precision' => 1.00,
            'range' => 1.00,
            'arrowSpeed' => 1.00,
            'shotsPerSecond' => .80,
            'color' => '#b96832',
            'arrowShaft' => '#e8d3a2',
            'description' => 'Equilibrado e fácil de controlar.',
        ],
        2 => [
            'name' => 'Melhorado',
            'price' => 300,
            'damage' => 2,
            'precision' => 1.15,
            'range' => 1.20,
            'arrowSpeed' => 1.06,
            'shotsPerSecond' => 1.05,
            'color' => '#39a9ff',
            'arrowShaft' => '#c9e8f5',
            'description' => 'Mais estável, veloz e preciso.',
        ],
        3 => [
            'name' => 'Épico',
            'price' => 800,
            'damage' => 3,
            'precision' => 1.30,
            'range' => 1.45,
            'arrowSpeed' => 1.12,
            'shotsPerSecond' => 1.35,
            'color' => '#ffbd2e',
            'arrowShaft' => '#ffe08a',
            'description' => 'Forte, dourado e de grande alcance.',
        ],
        4 => [
            'name' => 'Lendário',
            'price' => 1500,
            'damage' => 4,
            'precision' => 1.50,
            'range' => 1.75,
            'arrowSpeed' => 1.18,
            'shotsPerSecond' => 1.70,
            'color' => '#b84dff',
            'arrowShaft' => '#ebc7ff',
            'description' => 'Poder mágico e desempenho máximo.',
        ],
    ],
    'ducks' => [
        'common' => [
            'name' => 'Pato Comum', 'points' => 5, 'coins' => 4, 'health' => 2,
            'speedMultiplier' => 1.00, 'movement' => 'wave', 'size' => 1.00,
            'bodyColor' => '#f4f1dc', 'wingColor' => '#c9914c', 'headColor' => '#26a968',
        ],
        'blue' => [
            'name' => 'Pato Azul', 'points' => 8, 'coins' => 6, 'health' => 3,
            'speedMultiplier' => 1.35, 'movement' => 'swift', 'size' => .94,
            'bodyColor' => '#dff5ff', 'wingColor' => '#4ca4e8', 'headColor' => '#2587dc',
        ],
        'red' => [
            'name' => 'Pato Vermelho', 'points' => 12, 'coins' => 8, 'health' => 4,
            'speedMultiplier' => 1.15, 'movement' => 'zigzag', 'size' => 1.00,
            'bodyColor' => '#ffe3d6', 'wingColor' => '#d94a45', 'headColor' => '#e63d42',
        ],
        'purple' => [
            'name' => 'Pato Roxo', 'points' => 18, 'coins' => 12, 'health' => 6,
            'speedMultiplier' => .90, 'movement' => 'heavy', 'size' => 1.08,
            'bodyColor' => '#eee0ff', 'wingColor' => '#8e4bc1', 'headColor' => '#923dcc',
        ],
        'golden' => [
            'name' => 'Pato Dourado', 'points' => 30, 'coins' => 22, 'health' => 8,
            'speedMultiplier' => 1.25, 'movement' => 'swift', 'size' => 1.02,
            'bodyColor' => '#fff0a3', 'wingColor' => '#e9a91b', 'headColor' => '#ffc62e',
        ],
        'king' => [
            'name' => 'Pato Rei', 'points' => 60, 'coins' => 45, 'health' => 12,
            'speedMultiplier' => .75, 'movement' => 'royal', 'size' => 1.24,
            'bodyColor' => '#fff4d2', 'wingColor' => '#d59a31', 'headColor' => '#237f59',
        ],
    ],
];
