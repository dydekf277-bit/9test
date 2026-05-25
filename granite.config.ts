import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: '9personality',
  brand: {
    displayName: '9가지 성격 테스트',
    primaryColor: '#EF9F27',
    icon: 'https://static.toss.im/appsintoss/35251/2316d26e-b92f-422c-8ed0-a5850f2ea343.png',
  },
  web: {
    host: '192.168.219.199',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
