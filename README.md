# Social U

The modern social media for connecting people with similar interests and objectives. With the idea of developing a strong communities inside universities.

## Features

This webApp have several essential features:

- Server side rendering setup for Mantine
- Color scheme is stored in cookie to avoid color scheme mismatch after hydration
- Storybook with color scheme toggle
- Jest with react testing library
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## npm scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `export` – exports static website to `out` folder
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier

## TO DO

### V1 First Version

All the things that is left to finish the first version of the app

- [x] Session auth persistance
- [ ] Session state persistance
- [ ] Rendering optimization
- [ ] SEO optimization
- [ ] Post page Connection with API
- [ ] Profile connection with API
- [ ] Real anonimicity
- [ ] Sidebar
- [ ] Sign In with email
- [ ] Sign up with email
- [ ] Complete the profile
- [ ] Restart password
- [ ] User app configuration
- [ ] Meeting asistantts #Feature
- [ ] Commentaries #Feature
- [ ] Image Procesing #Feature
- [ ] Adult content filtering
- [ ] Ordering of the Posts
