import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,         // para usar describe/it/expect sin import
    environment: 'node',   // importante para Express/Node
    include: ['test/**/*.test.ts'], // patrón para tus tests
  },
});