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

const saveLS = (value) => {
  localStorage.setItem("params-gen", JSON.stringify(value));
};

const loadLS = () => {
  return JSON.parse(localStorage.getItem("params-gen"));
};

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
  const size = Number(param.size) ?? 300;
  const center = size / 2;
  const size1_3 = size / 3;
  const size2_3 = (size / 3) * 2;
  const size1_5 = size / 5;
  const size1_6 = size / 6;
  const size1_14 = size / 14;
  const size1_20 = size / 20;

  const title = param.title ?? randomChars(2, 4);
  const text = param.text ?? "";
  const font = param.font ?? "Helvetica";

  const sizeFontTitleConf = [0.4, 1.3, 1.2, 1, 0.8, 0.6];
  const sizeFontTextConf = [1, 1.3, 1.2, 1.1];

  const sizeFontTitle =
    size1_5 * sizeFontTitleConf[title.length] || size1_5 * sizeFontTitleConf[0];

  const sizeFontText =
    size1_14 * sizeFontTextConf[text.length] || size1_14 * sizeFontTextConf[0];

  const countDotPolygonMin = param.countDotPolygonMin ?? 7;
  const countDotPolygonMax = param.countDotPolygon ?? 9;

  const radiusPolygon = {
    min: size1_3 + size1_20,
    max: size1_3 + size1_20,
  };

  const polygon = param.polygon ?? {
    colors: randomColors({}),
    coords: randomCoord({
      size: size,
      dots: {
        min: Number(countDotPolygonMin),
        max: Number(countDotPolygonMax),
      },
      radius: radiusPolygon,
    }),
  };

  const backgroundColor = param.backgroundColor ?? "none";

  (() => {
    let draw = SVG()
      .addTo(el)
      .size(size, size)
      .attr({ id: `_${id}` });

    draw.rect(size, size).attr({ fill: backgroundColor });

    const gradient = draw
      .gradient("linear", (ctx) => {
        polygon.colors.forEach((color, i) =>
          ctx.stop(i / polygon.colors.length, color)
        );
      })
      .from(0, 0)
      .to(1, 1);

    draw
      .polyline(polygon.coords.join())
      .fill(gradient)
      .stroke({
        color: gradient,
        width: size1_5,
        linecap: "round",
        linejoin: "round",
      })
      .animate({
        duration: 20000,
        times: Infinity,
      })
      .ease("-")
      .rotate(360);

    draw.circle(size2_3).move(size1_6, size1_6).attr({ fill: "#000" });

    draw
      .text(title.toUpperCase())
      .move(center, center)
      .font({
        family: font,
        size: `${sizeFontTitle}px`,
        anchor: "middle",
        "dominant-baseline": "middle",
        x: "50%",
        y: "50%",
      })
      .fill("#fff");

    draw
      .text(text.toUpperCase())
      .move(center, center)
      .font({
        family: font,
        size: `${sizeFontText}px`,
        anchor: "middle",
        "dominant-baseline": "middle",
        x: "50%",
        y: "64%",
      })
      .fill("#fff");
  })();

  (() => {
    let draw = SVG()
      .addTo(el)
      .size(size / 3, size / 3)
      .attr({ id: `_${id}` });

    draw.rect(size / 3, size / 3).attr({ fill: backgroundColor });

    const gradient = draw
      .gradient("linear", (ctx) => {
        polygon.colors.forEach((color, i) =>
          ctx.stop(i / polygon.colors.length, color)
        );
      })
      .from(0, 0)
      .to(1, 1);

    draw
      .circle(size / 3)
      .move(0, 0)
      .attr({ fill: gradient })
      .animate({
        duration: 20000,
        times: Infinity,
      })
      .ease("-")
      .rotate(360);

    draw
      .circle(size2_3 / 3)
      .move(size1_6 / 3, size1_6 / 3)
      .attr({ fill: "#000" });

    draw
      .text(title.toUpperCase())
      .move(center, center)
      .font({
        family: font,
        size: `${sizeFontTitle / 3}px`,
        anchor: "middle",
        "dominant-baseline": "middle",
        x: "50%",
        y: "50%",
      })
      .fill("#fff");

    draw
      .text(text.toUpperCase())
      .move(center, center)
      .font({
        family: font,
        size: `${sizeFontText / 3}px`,
        anchor: "middle",
        "dominant-baseline": "middle",
        x: "50%",
        y: "64%",
      })
      .fill("#fff");
  })();

  (() => {
    let draw = SVG()
      .addTo(el)
      .size(size / 5, size / 5)
      .attr({ id: `_${id}-small` });

    draw.rect(size, size).attr({ fill: backgroundColor });

    const gradient = draw
      .gradient("linear", (ctx) => {
        polygon.colors.forEach((color, i) =>
          ctx.stop(i / polygon.colors.length, color)
        );
      })
      .from(0, 0)
      .to(1, 1);

    draw
      .circle(size / 5)
      .move(0, 0)
      .attr({ fill: gradient })
      .animate({
        duration: 20000,
        times: Infinity,
      })
      .ease("-")
      .rotate(360);

    draw
      .circle(size2_3 / 5)
      .move(size1_6 / 5, size1_6 / 5)
      .attr({ fill: "#000" });

    draw
      .text(title.toUpperCase())
      .move(center, center)
      .font({
        family: font,
        size: `${sizeFontTitle / 5}px`,
        anchor: "middle",
        "dominant-baseline": "middle",
        x: "50%",
        y: "52%",
      })
      .fill("#fff");
  })();

  (() => {
    let draw = SVG()
      .addTo(el)
      .size(size / 10, size / 10)
      .attr({ id: `_${id}-small` });

    draw.rect(size, size).attr({ fill: backgroundColor });

    const gradient = draw
      .gradient("linear", (ctx) => {
        polygon.colors.forEach((color, i) =>
          ctx.stop(i / polygon.colors.length, color)
        );
      })
      .from(0, 0)
      .to(1, 1);

    draw
      .circle(size / 10)
      .move(0, 0)
      .attr({ fill: gradient })
      .animate({
        duration: 20000,
        times: Infinity,
      })
      .ease("-")
      .rotate(360);

    draw
      .circle(size2_3 / 10)
      .move(size1_6 / 10, size1_6 / 10)
      .attr({ fill: "#000" });

    draw
      .text(title[0].toUpperCase())
      .move(center, center)
      .font({
        family: font,
        size: `${size1_5 / 5}px`,
        anchor: "middle",
        "dominant-baseline": "middle",
        x: "50%",
        y: "52%",
      })
      .fill("#fff");
  })();

  (() => {
    let draw = SVG()
      .addTo(el)
      .size(size / 14, size / 14)
      .attr({ id: `_${id}-small` });

    draw.rect(size, size).attr({ fill: backgroundColor });

    draw
      .circle(size2_3 / 14)
      .move(size1_6 / 14, size1_6 / 14)
      .attr({ fill: "#000" });

    draw
      .text(title[0].toUpperCase())
      .move(center, center)
      .font({
        family: font,
        size: `${size1_5 / 6}px`,
        anchor: "middle",
        "dominant-baseline": "middle",
        x: "50%",
        y: "52%",
      })
      .fill("#fff");
  })();

  const svgFigure = document.querySelector(`#_${id}`).outerHTML;

  document.querySelector(`#_${id}`).addEventListener("click", () => {
    saveText(`logo-${title}-${text}-${id}`, svgFigure, "svg");
  });
};

const updateFigure = () => {
  const form = document.querySelector(".generation-forms");
  const rawData = new FormData(form);
  const logoParam = {};
  for (let [key, value] of rawData) {
    logoParam[key] = value;
  }

  setTimeout(() => {
    saveLS(logoParam);
  }, 0);

  document.querySelector(".generation").innerHTML = "";

  genFigure(logoParam);
};

const initParams = () => {
  const params = loadLS();

  if (params !== null) {
    Object.entries(params).forEach(([k, v]) => {
      document.querySelector(`[name=${k}]`).value = v;
    });
  }
};

const init = () => {
  initParams();
  updateFigure();
};

document
  .querySelector(".generation-forms")
  .addEventListener("input", updateFigure);

document
  .querySelector(".generation-forms")
  .addEventListener("reset", updateFigure);

init();
