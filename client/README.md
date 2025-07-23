# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Face Filters Feature

### ULTRA+ Premium Feature: Face Filters

ULTRA+ users can apply Instagram-style face filters to their partner's video during video calls.

#### Available Filters:
- **Free Filters**: Vintage, Black & White, No Filter
- **Premium Filters** (ULTRA+ only):
  - Heart Eyes 😍 - Adds heart eyes effect
  - Flower Crown 🌸 - Beautiful flower crown overlay
  - Sparkles ✨ - Magical sparkle effects
  - Soft Glow 🌟 - Romantic soft glow
  - Rose Tint 🌹 - Romantic rose color filter
  - Dreamy 💭 - Dreamy romantic effect
  - Golden Hour 🌅 - Warm golden lighting
  - Neon Glow 💫 - Futuristic neon effect

#### How to Use:
1. Upgrade to ULTRA+ premium plan (₹899 for 3 months)
2. During video calls, look for the 🎭 filter button
3. Select any filter to apply to your partner's video
4. Only you will see the filter effect
5. Tap "No Filter" to remove effects

#### Technical Implementation:
- CSS filters for basic effects (sepia, blur, etc.)
- Canvas-based rendering for advanced effects (overlays, animations)
- Real-time video processing with 30fps
- Optimized for mobile and desktop performance

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
