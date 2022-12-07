import Color from "color";

export const getOverlayColor = (awards) => {
  if (awards.filter((award) => award.name === "Gold").length > 0) {
    return "linear-gradient(188deg,rgba(255,230,0,.15) 1.7%,rgba(255,230,0,0) 46%),hsla(0,0%,100%,0)";
  } else if (awards.filter((award) => award.name === "Starry").length > 0) {
    return "linear-gradient(188deg,rgba(89,186,18,.25) 1.7%,rgba(255,230,0,0) 46%),hsla(0,0%,100%,0)";
  } else {
    return "tranparent";
  }
};

export const isColorDark = (hexColor) => {
  const color = Color(hexColor);
  return color.isDark();
};

export const createImageBlurData = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
