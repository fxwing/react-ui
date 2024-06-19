import formPlugin from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";
import tailwindcssChildren from "tailwindcss-children";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      lineHeight: {
        16: "4rem",
      },
      spacing: {
        8: "2rem",
        16: "4rem",
        24: "6rem",
      },
      backgroundColor: {
        primary: "#cc3",
      },
      borderColor: {
        primary: "#cc3",
      },
    },
  },
  plugins: [formPlugin, aspectRatio, typography, tailwindcssChildren],
};
