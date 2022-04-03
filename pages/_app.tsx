import type { AppProps } from 'next/app';

import '../normalize.css';

function FreeFallApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default FreeFallApp;
