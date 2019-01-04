// contains all configuration for dev and prod environment

export let isDev = process.env.IS_DEV || true; // isDev will be true by default
export let isProd = process.env.IS_PROD || false; // isProd will be false by default
