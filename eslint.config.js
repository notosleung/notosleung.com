// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    // Enable or disable specific rules
    overrides: {
      // 'vue/block-order': ['error', {
      //   order: [['template', 'script'], 'style'],
      // }],
      'no-console': 'off',
      'vue/no-v-text-v-html-on-component': ['error', {
        allow: ['router-link', 'nuxt-link'],
        ignoreElementNamespaces: false,
      }],
      // 'vue/html-self-closing': ['error', {
      //   html: {
      //     normal: 'never',
      //   },
      // }],
    },
  },

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  formatters: {
    css: true,
  },
}, {
  // Override or add specific rules
  files: ['**/**/*.ts'],
  rules: {
    'no-console': 'off',
  },
})
