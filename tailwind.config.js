const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      borderWidth: {
         "1": "1px"
      },
      colors: {
        background: 'hsl(var(--BG-BACKGROUND))',
        muted: 'hsl(var(--BG-FOREGROUND))',
        popover: 'hsl(var(--BG-POPOVER))',
        foreground: 'hsl(var(--TEXT-BASE))',
        accent: 'hsl(var(--TEXT-ACCENT))',
        solved: 'hsl(var(--TEXT-SOLVED))',
        unsolved: 'hsl(var(--TEXT-UNSOLVED))',
        info: 'hsl(var(--INFO))',
        error: 'hsl(var(--ERROR))',
        success: 'hsl(var(--SUCCESS))',
        warning: 'hsl(var(--WARNING))'
      },
      textColor: {
        code: {
          base: 'hsl(var(--CODE-BASE))',
          keyword: 'hsl(var(--CODE-KEYWORD))',
          class: 'hsl(var(--CODE-CLASS))',
          object: 'hsl(var(--CODE-OBJECT))',
          closures: 'hsl(var(--CODE-CLOSURES))',
          function: 'hsl(var(--CODE-FUNCTION))',
          action: 'hsl(var(--CODE-ACTION))',
          comment: 'hsl(var(--CODE-COMMENT))',
        }
      },
    },
  },
  plugins: [
    plugin(({addVariant}) => {
      const THEMES = {
        light: [
            "purple",
            "pink"
        ],
        dark: [
            "green"
        ]
      }
      THEMES.dark.forEach(e=>addVariant(e,`#${e} &`))
      THEMES.light.forEach(e=>addVariant(e,`#${e} &`))
    })
  ],
}

