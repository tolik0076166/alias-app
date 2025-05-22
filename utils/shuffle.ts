// src/utils/shuffle.ts
/**
 * Перемешивает массив «на месте» и возвращает копию.
 * Алгоритм — Fisher‑Yates (O(n), без повторений).
 */
export function shuffle<T>(array: T[]): T[] {
    // создаём поверх оригинала копию, чтобы не мутировать исходные данные
    const result = [...array];
  
    // проходим с конца и меняем местами с рандомным индексом ≤ текущего
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
  
    return result;
  }
  