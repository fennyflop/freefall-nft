import type { AppProps } from 'next/app';

function FreeFallApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default FreeFallApp;
