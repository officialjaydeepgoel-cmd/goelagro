import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goelagro.trade',
  appName: 'Goel Agro Global',
  webDir: 'www',
  server: {
    url: 'https://trade-seven-bay.vercel.app',
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: null,
    },
  },
};

export default config;
