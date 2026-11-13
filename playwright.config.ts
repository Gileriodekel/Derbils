import {existsSync} from 'node:fs';
import {defineConfig} from '@playwright/test';
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
export default defineConfig({testDir:'tests/browser',timeout:120000,expect:{timeout:20000},workers:1,fullyParallel:false,
  use:{baseURL:'http://127.0.0.1:4173/garden/',headless:true,launchOptions:{executablePath,args:['--no-sandbox']}},
  webServer:{command:'node scripts/static-host.mjs',url:'http://127.0.0.1:4173/garden/',reuseExistingServer:true},
});
