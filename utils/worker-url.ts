export function getWorkerBaseUrl(workerIndex: number = 0): string {
  const baseInstancesEnv = process.env.SWAGLABS_INSTANCES;
  if (baseInstancesEnv) {
    const instances = baseInstancesEnv.split(',').map((url) => url.trim());
    if (instances.length > 0) {
      return instances[workerIndex % instances.length];
    }
  }

  return process.env.BASE_URL || 'https://www.saucedemo.com';
}
