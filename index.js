// Привожу документацию своих проектов, решил оформить им хорошую доку (для портфолио). Нужны лого, вот я решил написать генератор для лого. Что понадобилось - учебник по геоиметрии за 9 класс, теория цветов и крывые безье. Хороший градиент - большая часть впечатления

import {
  newArray,
  randomChars,
  randomInteger,
  generateHslaColors,
  randomArrayElement,
  HSLToHex,
  saveText,
} from "./utils.js";

// создает рандомный градиент
const randomColors = (params) => {
  const l = params.l ?? 80; // насыщенность
  const s = params.s ?? 50; // яркость
  const count = params.count ?? 3; // количество цветов в градиенте
  const segment = params.segment ?? 90; // сегмент в котором идет выборка цветов для градиента

  const step = segment / count; // -1 потому что 1 цвет рандомный
  const collectColors = generateHslaColors(l, s, 1.0, 360); // коллеция цветов
  const startColor = randomArrayElement(collectColors);
  const degStartColor = startColor.h;

  const colors = newArray(count).map((v, i) => {
    const degStep = step * (i + 1);

    const deg =
      degStartColor + degStep < 360
        ? degStartColor + degStep
        : degStartColor + degStep - 360;

    return collectColors[deg];
  });

  return [startColor, ...colors].map((v) => HSLToHex(v));
};

//
const randomCoord = (params) => {
  const size = params.size ?? 300;
  const radius = params.radius ?? {
    min: 100,
    max: 150,
  };
  const dots = params.dots
    ? randomInteger(params.dots.min, params.dots.max)
    : randomInteger(5, 7);

  const centerCanvas = size / 2;
  const segment = 360 / dots;

  const coords = newArray(dots).map((v, i) => {
    const r = randomInteger(radius.min, radius.max);
    const deg = randomInteger(i * segment, (i + 1) * segment);
    const x = Math.floor(centerCanvas + r * Math.sin(deg * (Math.PI / 180)));
    const y = Math.floor(centerCanvas + r * Math.cos(deg * (Math.PI / 180)));
    return [x, y];
  });
  coords.push(coords[0]);

  return coords;
};

const genFigure = (param) => {
  const el = param.el ?? ".generation";
  const id = randomInteger(1, 1000000);
  const size = param.size ?? 300;
  const center = size / 2;
  const size1_2 = size / 2;
  const size1_3 = size / 3;
  const size2_3 = (size / 3) * 2;
  const size1_5 = size / 5;
  const size1_6 = size / 6;
  const size1_14 = size / 14;
  const size1_20 = size / 20;

  const title = param.title ?? randomChars(2, 4);
  const text = param.text ?? "";
  const font = param.font ?? "Helvetica";

  const countPolygon = param.countPolygon ?? 1;
  const countDotPolygon = param.countDotPolygon ?? {
    min: 7,
    max: 9,
  };
  const radiusPolygon = param.radiusPolygon ?? {
    min: size1_3 + size1_5 / 2,
    max: size1_2 - size1_5,
  };

  const polygons =
    param.polygons ??
    newArray(countPolygon).map((v, i) => {
      return {
        colors: randomColors({}),
        coords: randomCoord({
          size: size,
          dots: countDotPolygon,
          radius: radiusPolygon,
        }),
      };
    });

  const backgroundColor = param.backgroundColor ?? "#fff";

  let draw = SVG()
    .addTo(el)
    .size(size, size)
    .attr({ id: `_${id}` });

  draw.rect(size, size).attr({ fill: backgroundColor });

  polygons.forEach((polygon) => {
    const gradient = draw
      .gradient("linear", (ctx) => {
        polygon.colors.forEach((color, i) =>
          ctx.stop(i / polygon.colors.length, color)
        );
      })
      .from(0, 0)
      .to(1, 1);

    draw.polyline(polygon.coords.join()).fill(gradient).stroke({
      color: gradient,
      width: size1_5,
      linecap: "round",
      linejoin: "round",
    });
  });

  draw.circle(size2_3).move(size1_6, size1_6).attr({ fill: "#000" });

  draw
    .text(title.toUpperCase())
    .move(center, center)
    .font({
      family: font,
      size: `${size1_5}px`,
      anchor: "middle",
      leading: "1.5em",
      "dominant-baseline": "middle",
      x: "50%",
      y: "52%",
    })
    .fill("#fff");

  draw
    .text(text.toUpperCase())
    .move(center, center)
    .font({
      family: font,
      size: `${size1_14}px`,
      anchor: "middle",
      leading: "1.5em",
      "dominant-baseline": "middle",
      x: "50%",
      y: "67%",
    })
    .fill("#fff");

  draw
    .circle(size1_20)
    .move(center - size1_5 / 3 / 2, center - size1_5 * 1.3) // todo
    .attr({ fill: "#fff" });

  const paramsFigure = JSON.stringify({
    id,
    size,
    title,
    text,
    font,
    countPolygon,
    countDotPolygon,
    radiusPolygon,
    polygons,
  });

  const svgFigure = document.querySelector(`#_${id}`).outerHTML;

  document.querySelector(`#_${id}`).addEventListener("click", () => {
    saveText(`logo-${title}-${text}-${id}-params`, paramsFigure, "json");
    saveText(`logo-${title}-${text}-${id}`, svgFigure, "svg");
  });

  return paramsFigure;
};

const save1 = {
  size: 300,
  title: "PG",
  text: "front",
  font: "Helvetica",
  countPolygon: 1,
  countDotPolygon: { min: 7, max: 9 },
  radiusPolygon: { min: 130, max: 90 },
  polygons: [
    {
      colors: ["#7c19e6", "#e219e6", "#e61983", "#e6191d"],
      coords: [
        [205, 224],
        [272, 166],
        [247, 84],
        [138, 48],
        [62, 85],
        [55, 138],
        [88, 239],
        [205, 224],
      ],
    },
  ],
};

const save2 = {
  size: 300,
  title: "LAJ",
  text: "backend",
  font: "Helvetica",
  countPolygon: 1,
  countDotPolygon: { min: 7, max: 9 },
  radiusPolygon: { min: 130, max: 90 },
  polygons: [
    {
      colors: ["#35e619", "#19e664", "#19e6ca", "#199be6"],
      coords: [
        [171, 262],
        [270, 177],
        [252, 148],
        [203, 60],
        [91, 63],
        [52, 122],
        [50, 200],
        [103, 230],
        [171, 262],
      ],
    },
  ],
};

const saveLogos = [save1, save2];

saveLogos.forEach((logoParam) => {
  genFigure({ el: ".saves", ...logoParam });
});

newArray(4)
  .map(() => ({}))
  .forEach((logoParam) => {
    genFigure(logoParam);
  });
