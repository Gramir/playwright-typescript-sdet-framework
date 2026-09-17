import type { FullConfig } from '@playwright/test';
import { getWorkerBaseUrl } from './utils/worker-url';

async function globalSetup(config: FullConfig) {
  const targetUrl = getWorkerBaseUrl(0);

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      console.warn(`[GlobalSetup] Target URL returned status: ${response.status}`);
    }
  } catch (error) {
    console.warn(`[GlobalSetup] Warning: Could not reach ${targetUrl}:`, error);
  }
}

export default globalSetup;
