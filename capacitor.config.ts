import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'BFU E-Services',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  webDir: 'www'
};

export default config;
