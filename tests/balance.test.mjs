import assert from 'node:assert/strict';
import test from 'node:test';
import { BalanceTracker } from '../public/js/systems/BalanceTracker.js';

test('registra e limita o histórico às dez partidas mais recentes', () => {
    const tracker = new BalanceTracker([], 10);

    for (let score = 0; score < 12; score += 1) {
        tracker.record({ score, shots: 10, hits: 5, bowLevel: 1, playedAt: score + 1 });
    }

    assert.equal(tracker.history.length, 10);
    assert.equal(tracker.history[0].score, 11);
    assert.equal(tracker.history.at(-1).score, 2);
});

test('calcula médias, totais e arco favorito para o balanceamento', () => {
    const tracker = new BalanceTracker([
        { score: 100, shots: 10, hits: 5, bowLevel: 2, playedAt: 1 },
        { score: 200, shots: 10, hits: 7, bowLevel: 2, playedAt: 2 },
        { score: 300, shots: 10, hits: 9, bowLevel: 3, playedAt: 3 },
    ]);

    assert.deepEqual(tracker.getSummary(), {
        rounds: 3,
        averageScore: 200,
        averageAccuracy: 70,
        bestScore: 300,
        totalHits: 21,
        favoriteBow: 2,
    });
});

test('normaliza dados inválidos antes de salvá-los', () => {
    const tracker = new BalanceTracker();
    const entry = tracker.record({ score: -20, coinsEarned: '8.9', hits: 9, shots: 3, bowLevel: 99 });

    assert.equal(entry.score, 0);
    assert.equal(entry.coinsEarned, 8);
    assert.equal(entry.hits, 3);
    assert.equal(entry.accuracy, 100);
    assert.equal(entry.bowLevel, 4);
});

test('gera incentivo de acordo com o resultado da rodada', () => {
    const tracker = new BalanceTracker();

    assert.match(tracker.getFeedback({ shots: 0 }), /primeiro disparo/i);
    assert.match(tracker.getFeedback({ shots: 10, accuracy: 70, score: 100 }), /mira afiada/i);
    assert.match(tracker.getFeedback({ shots: 10, accuracy: 20, score: 50 }), /cada tentativa/i);
});
