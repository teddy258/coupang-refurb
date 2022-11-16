import "../styles/font.css";
import "antd/dist/antd.css";
import "../styles/globals.css";

import { ConfigProvider } from "antd";
import koKR from "antd/es/locale/ko_KR";
import type { AppProps } from "next/app";
import Head from "next/head";
import { gaClient } from "../utils/ga";
import UserPriceModifyModal from "../components/modal/UserPriceModifyModal";

gaClient.init();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={koKR}>
      <Head>
        <title>오늘의 득템</title>
        <meta name="description" content="실시간 특가, 신품급 리퍼, 카드할인 핫딜 상품 전문몰" />
        <meta name="keywords" content="특가,리퍼,중고,애플,삼성,LG,노트북,맥북,에어팟,아이폰,맥미니,아이맥,갤럭시,이어폰,블루투스,헤드셋,헤드폰" />
      </Head>
      <UserPriceModifyModal />
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
