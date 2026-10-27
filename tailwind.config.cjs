/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro,md,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#141413",
          700: "#3D3D3A",
          500: "#5E5D59",
          400: "#87867F",
        },
        paper: {
          DEFAULT: "#F0EEE6",
          50: "#FAF9F5",
          200: "#E8E6DC",
        },
        line: {
          DEFAULT: "#DEDCD1",
          strong: "#C9C6BA",
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", ...defaultTheme.fontFamily.sans],
        serif: [
          '"Source Serif 4 Variable"',
          '"Source Serif 4"',
          ...defaultTheme.fontFamily.serif,
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.ink.700"),
            "--tw-prose-headings": theme("colors.ink.DEFAULT"),
            "--tw-prose-lead": theme("colors.ink.500"),
            "--tw-prose-links": theme("colors.ink.DEFAULT"),
            "--tw-prose-bold": theme("colors.ink.DEFAULT"),
            "--tw-prose-counters": theme("colors.ink.400"),
            "--tw-prose-bullets": theme("colors.ink.400"),
            "--tw-prose-hr": theme("colors.line.DEFAULT"),
            "--tw-prose-quotes": theme("colors.ink.DEFAULT"),
            "--tw-prose-quote-borders": theme("colors.line.strong"),
            "--tw-prose-captions": theme("colors.ink.500"),
            "--tw-prose-code": theme("colors.ink.DEFAULT"),
            "--tw-prose-th-borders": theme("colors.line.strong"),
            "--tw-prose-td-borders": theme("colors.line.DEFAULT"),
            "h1, h2, h3, h4": {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontWeight: "500",
              letterSpacing: "-0.01em",
            },
            a: {
              fontWeight: "500",
              textDecorationColor: theme("colors.line.strong"),
              textUnderlineOffset: "3px",
              transitionProperty: "text-decoration-color",
              transitionDuration: "150ms",
            },
            "a:hover": {
              textDecorationColor: theme("colors.ink.DEFAULT"),
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            ":not(pre) > code": {
              backgroundColor: theme("colors.paper.200"),
              border: "1px solid",
              borderColor: theme("colors.line.DEFAULT"),
              padding: "0.125rem 0.375rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
