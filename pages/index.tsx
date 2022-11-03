import { Input } from "antd";

import styled from "@emotion/styled";
import { useHttpRequest } from "../hooks/useHttpRequest";

import { useEffect, useState } from "react";
import { EItemType, ESortType, TItemType, TSortType } from "../types/item.interface";
import { genClassNames } from "../utils/utils";
import { BreakPoint } from "../utils/constatns";
import { useInterval } from "react-use";
import { DateTime } from "luxon";
import { getRefurbishedItems } from "../api";

import { FaTelegram } from "react-icons/fa";

export default function Home() {
  const [type, setType] = useState<TItemType>("PHONE");
  const [sort, setSort] = useState<TSortType>("PRICE");
  const [keyword, setKeyword] = useState("");
  const [now, setNow] = useState("");

  const [data, fetch, isLoading, isInit] = useHttpRequest(() => getRefurbishedItems(type, sort, encodeURIComponent(keyword)));

  useEffect(() => {
    fetch();
    setNow(DateTime.now().toFormat("hh시 mm분 ss초"));
  }, [type, sort, keyword]);

  useInterval(() => {
    setNow(DateTime.now().toFormat("hh시 mm분 ss초"));
  }, 1000);

  function handleItemClick(url: string) {
    window.open(url);
  }

  function handleTelegramClick() {
    window.open("https://t.me/+vM15DX7dB085NGY9");
  }

  function handleSearch(val: string) {
    setKeyword(val);
  }

  return (
    <Layout>
      <Container>
        <Title>오늘의 득템</Title>
        <Time>{now} 실시간 최신가</Time>
        <CategoryRow>
          {Object.entries(EItemType).map(([key, value]) => (
            <div
              key={key}
              onClick={() => setType(key as TItemType)}
              className={genClassNames(["item-type"], ["selected", type === (key as TItemType)])}
            >
              {value}
            </div>
          ))}
        </CategoryRow>

        <SortRow>
          <SearchInput onSearch={handleSearch} placeholder="검색" />
          <div className="list">
            {Object.entries(ESortType).map(([key, value]) => (
              <div
                key={key}
                onClick={() => setSort(key as TSortType)}
                className={genClassNames(["sort-type"], ["selected", sort === (key as TSortType)])}
              >
                {value}
              </div>
            ))}
          </div>
        </SortRow>
        <Divider />
        <ItemList>
          {!isLoading &&
            isInit &&
            data
              ?.filter((item) => item.price !== null)
              .map((item) => (
                <Item key={item.url} onClick={() => handleItemClick(item.url)}>
                  <div className="thumbnail">
                    <img src={item.image} />
                  </div>
                  <div className="title">{item.name.slice(0, 40)}</div>
                  {!!item.originPrice && <div className="original-price">{Number(item.originPrice).toLocaleString()}</div>}
                  <div className="price">
                    {Number(item.price).toLocaleString()}
                    <span style={{ marginLeft: "2px" }}>원</span>
                  </div>
                  {!!item.danawaPrice && (
                    <div className="danawa-price">
                      <span>다나와</span>
                      {Number(item.danawaPrice).toLocaleString()}
                    </div>
                  )}
                </Item>
              ))}

          {!isLoading &&
            isInit &&
            data
              ?.filter((item) => item.price === null)
              .map((item) => (
                <Item key={item.url} onClick={() => handleItemClick(item.url)}>
                  <div className="thumbnail">
                    <img src={item.image} />
                  </div>
                  <div className="title">{item.name.slice(0, 40)}</div>

                  {!!item.originPrice && <div className="original-price">{Number(item.originPrice).toLocaleString()}</div>}

                  <div style={{ color: "#e97070" }}>품절</div>

                  {!!item.danawaPrice && (
                    <div className="danawa-price">
                      <span>다나와</span>
                      {Number(item.danawaPrice).toLocaleString()}
                    </div>
                  )}
                </Item>
              ))}
        </ItemList>
        <Footer>
          본 페이지는 쿠팡 파트너스 활동의 일환으로,
          <br /> 링크를 통해 구매하시게 되면 서버에 소정의 수익이 발생할 수 있습니다.
          <br /> 구매하시는 상품의 가격엔 영향이 없고,
          <br /> 모든 수익은 서버 유지 및 관리 비용으로 사용됩니다.
        </Footer>
      </Container>
      <TelegramIcon onClick={handleTelegramClick} />
    </Layout>
  );
}

const TelegramIcon = styled(FaTelegram)`
  cursor: pointer;

  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;

  ${BreakPoint.Mobile} {
    bottom: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }
`;

const SearchInput = styled(Input.Search)`
  width: 280px;

  ${BreakPoint.Mobile} {
    width: 160px;
  }
`;

const SortRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 0 10px;
  align-items: center;

  & > .list {
    display: flex;

    & > .sort-type {
      margin: 0 8px;
      padding-bottom: 3px;

      font-size: 16px;

      ${BreakPoint.Mobile} {
        margin: 0 5px;
        font-size: 13px;
      }

      &.selected {
        font-weight: bold;
        border-bottom: 3px solid #191919;

        ${BreakPoint.Mobile} {
          border-width: 2px;
        }
      }
    }
  }
`;

const Layout = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 940px;
`;

const Time = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  margin-top: 16px;

  ${BreakPoint.Mobile} {
    font-size: 14px;
    margin-top: 12px;
  }
`;

const Title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-top: 28px;

  ${BreakPoint.Mobile} {
    font-size: 26px;
    margin-top: 24px;
  }
`;

const Item = styled.div`
  cursor: pointer;

  width: calc(20% - 16px);
  min-width: calc(20% - 16px);

  margin-bottom: 20px;
  margin-right: 20px;
  min-height: 288px;

  &:nth-of-type(5n) {
    margin-right: 0px;
  }

  ${BreakPoint.Mobile} {
    width: calc(33.33% - 8px);
    min-width: calc(33.33% - 8px);
    min-height: 232px;

    margin-right: 12px;

    &:nth-of-type(3n) {
      margin-right: 0px;
    }
  }

  & > .thumbnail {
    width: 100%;
    padding-top: 100%;
    height: 0;
    position: relative;

    & > img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }

  & > .title {
    margin-top: 12px;
    margin-bottom: 8px;
    line-height: 1.14;

    ${BreakPoint.Mobile} {
      margin-top: 10px;
      font-size: 14px;
    }
  }

  & > .danawa-price {
    margin-top: 6px;
    & > span {
      color: #00c113;
      font-size: 11px;
      margin-right: 3px;
    }

    font-size: 12px;
  }

  & > .original-price {
    font-size: 13px;
    letter-spacing: 0.6px;
    color: #808080;
    text-decoration: line-through;
    margin-bottom: 4px;
  }

  & > .price {
    font-size: 16px;
    letter-spacing: 0.6px;
    font-weight: bold;

    ${BreakPoint.Mobile} {
      font-size: 14px;
      line-height: 1.1;
    }
  }
`;

const ItemList = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-top: 40px;

  padding: 0 20px;

  ${BreakPoint.Mobile} {
    padding: 0 10px;
  }
`;

const CategoryRow = styled.div`
  display: flex;
  width: calc(100% - 12px);
  border-radius: 4px;
  border: 1px solid #808080;
  flex-wrap: wrap;

  margin: 42px 6px 0px;

  ${BreakPoint.Mobile} {
    margin: 26px 6px 0px;
  }

  & > .item-type {
    font-size: 16px;
    flex: 1;
    padding: 8px;
    border-right: 1px solid #808080;
    text-align: center;
    cursor: pointer;

    ${BreakPoint.Mobile} {
      padding: 8px 4px;
      font-size: 13px;
    }

    &.selected {
      background: #191919;
      color: white;
    }

    &:nth-last-of-type(1) {
      border: none;
    }
  }
`;
const Footer = styled.div`
  text-align: center;
  font-size: 14px;
  color: #898989;
  line-height: 1.4;
  margin: 50px 0;
`;

const Divider = styled.div`
  width: 90%;
  margin: 20px auto;
  height: 1px;
  background-color: #e9e9e9;
`;
