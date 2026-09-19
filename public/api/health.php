<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

echo json_encode([
    'success' => true,
    'game' => 'Pato ao Alvo',
    'status' => 'ready',
    'timestamp' => gmdate(DATE_ATOM),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

