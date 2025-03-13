/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          450: "rgb(132 139 152)",
          550: "rgb(91 100 114)",
          650: "rgb(65 75 90)",
          750: "rgb(43 53 68)",
          850: "rgb(24 33 47)",
        },
        blue: {
          550: "rgb(48 115 241)",
          650: "rgb(33 89 226)",
          750: "rgb(30 71 196)",
        },
        green: {
          550: "rgb(28 180 84)",
          650: "rgb(22 146 68)",
          750: "rgb(22 115 57)",
        },
        slate: {
          550: "rgb(86 101 122)",
          650: "rgb(61 75 95)",
        },
        emerald: {
          925: "rgb(4 61 47)",
        },
      },
      fontSize: {
        "sm-md": "0.9375rem",
        "md-lg": "1.0625rem",
        "lg-xl": "1.1875rem",
        "xl-2xl": "1.375rem",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        // 스크롤바 커스텀 스타일
        "::-webkit-scrollbar": {
          width: "18px",
        },
        "::-webkit-scrollbar-track": {
          background: theme("colors.gray.800"),
        },
        "::-webkit-scrollbar-thumb": {
          background: theme("colors.gray.550"),
          borderRadius: "6px",
          border: "3px solid",
          borderColor: theme("colors.gray.800"),
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: theme("colors.gray.500"),
        },

        // 수정된 슬라이드바 스타일
        'input[type="range"]': {
          "-webkit-appearance": "none",
          width: "100%",
          background: "transparent",
          "&::-webkit-slider-runnable-track": {
            width: "100%",
            height: "0.5rem",
            cursor: "pointer",
            background: `linear-gradient(to right, ${theme(
              "colors.blue.500"
            )} var(--range-progress), ${theme(
              "colors.gray.700"
            )} var(--range-progress))`,
            borderRadius: "0.25rem",
          },
          "&::-webkit-slider-thumb": {
            "-webkit-appearance": "none",
            height: "1rem",
            width: "1rem",
            borderRadius: "50%",
            background: theme("colors.blue.600"),
            cursor: "pointer",
            marginTop: "-0.25rem",
          },
          "&::-webkit-slider-runnable-track:hover": {
            background: `linear-gradient(to right, ${theme(
              "colors.blue.600"
            )} var(--range-progress), ${theme(
              "colors.gray.700"
            )} var(--range-progress))`,
          },
          "&::-webkit-slider-thumb:hover": {
            background: theme("colors.blue.700"),
          },
          "&::-webkit-slider-runnable-track:active": {
            background: `linear-gradient(to right, ${theme(
              "colors.blue.700"
            )} var(--range-progress), ${theme(
              "colors.gray.550"
            )} var(--range-progress))`,
          },
          "&::-webkit-slider-thumb:active": {
            background: theme("colors.blue.800"),
          },
          "&:focus": {
            outline: "none",
          },
        },
      });
    },
  ],
};
