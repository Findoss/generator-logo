/**
 * Утилита для создания пустого массива
 * @param n - array
 * @returns
 */
export const newArray = (n) => {
  return new Array(n).fill(null);
};

/**
 * Рандомно целое число в пределах min - max
 * @param min
 * @param max
 * @returns число
 */
export const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Выбирает рандомный элемент из массива
 * @param array массив
 * @returns возвращает элемент массива
 */
export const randomArrayElement = (array) => {
  const randomIndex = randomInteger(1, array.length);
  const element = array[randomIndex];
  return element;
};

/**
 * Рандомный латинский символ от A до Z
 * @returns символ
 */
export const randomChars = (min, max) => {
  const count = randomInteger(min, max);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const char = () => characters[randomInteger(0, characters.length)];

  return newArray(count)
    .map(() => char())
    .join("");
};

/**
 * Конвертация из hsl в hex (rgb)
 * @param hsl
 * @returns строка hex
 */
export const HSLToHex = (hsl) => {
  const { h, s, l } = hsl;

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Генерирует массив цветов в формате hsl
 * @param saturation насыщеность
 * @param lightness яркость
 * @param alpha альфа канал
 * @param amount количество цветов
 * @returns массив цветов в формате hsl
 */
export const generateHslaColors = (saturation, lightness, alpha, amount) => {
  let colors = [];
  let huedelta = Math.trunc(360 / amount);

  for (let i = 0; i < amount; i++) {
    let hue = i * huedelta;
    colors.push({ h: hue, s: saturation, l: lightness, a: alpha });
  }

  return colors;
};

/**
 * Сохраняет файл с текстовыми данными
 * @param name имя файла
 * @param content содержимое
 * @param ext расширение
 */
export const saveText = (name, content, ext) => {
  const link = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = `${name}.${ext}`;
  link.click();
  URL.revokeObjectURL(link.href);
};

