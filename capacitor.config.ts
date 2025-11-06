import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Exercise Daily',
  webDir: 'www',
  server: {
    // url: 'http://10.4.26.236:8100',
    // cleartext: true
    androidScheme: 'http'
  }
};

export default config;
