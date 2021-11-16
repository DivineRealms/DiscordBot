const { createCanvas } = require("canvas");

const alternateCapitals = (str) => [...str]
    .map((char, i) => char[`to${i % 2 ? "Upper" : "Lower"}Case`]())
    .join("");

const randomText = () => alternateCapitals(Math.random().toString(36).substring(2, 8));

const FONTBASE = 200;
const FONTSIZE = 35;

const relativeFont = (width) => {
    const ratio = FONTSIZE / FONTBASE;
    const size = width * ratio;
    return `${size}px arial`;
};

const arbitraryRandom = (min, max) => Math.random() * (max - min) + min;

const configureText = (ctx, width, height) => {
    ctx.font = relativeFont(width);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "magenta";

    const text = randomText();
    ctx.fillText(text, width / 2, height / 2);
    return text;
};

const generate = (width, height) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#161B21";
    ctx.fillRect(0, 0, width, height);

    const text = configureText(ctx, width, height);

    return {
        image: canvas.toBuffer(),
        text: text,
    };
};

module.exports = generate;