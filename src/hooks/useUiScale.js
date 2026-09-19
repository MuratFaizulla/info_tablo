import { useEffect, useState } from 'react';

/**
 * Общий множитель табло в пикселях — тот самый размер шрифта корня из
 * index.css.
 *
 * Нужен там, где размер задаётся не стилями, а числом в коде: Chart.js рисует
 * подписи на canvas и rem не понимает. Без этого диаграмма шаңырақов —
 * единственное место табло, которое не меняется вместе с экраном: на
 * телевизоре подписи остаются мелкими, на ноутбуке налезают друг на друга.
 *
 * Читаем вычисленное значение, а не повторяем формулу: правило записано один
 * раз, в CSS, и остаётся единственным.
 */
const readScale = () =>
  parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

export function useUiScale() {
  const [scale, setScale] = useState(readScale);

  useEffect(() => {
    const onResize = () => setScale(readScale());
    window.addEventListener('resize', onResize);
    // Первое чтение могло случиться до того, как применились шрифты и стили.
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return scale;
}

export default useUiScale;
