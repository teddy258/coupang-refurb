import "../styles/font.css";
import "antd/dist/antd.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>오늘의 득템</title>
        <meta name="description" content="실시간 핫딜을 알려드려요" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
