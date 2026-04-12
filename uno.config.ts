import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import { defineConfig, presetAttributify, presetIcons, presetWebFonts, presetWind3, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.3em',
        'width': '1.3em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
        mono: 'DM Mono',
        condensed: 'Roboto Condensed',
        wisper: 'Bad Script',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
