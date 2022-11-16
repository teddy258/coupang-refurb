import { Input, InputRef } from "antd";

import styled from "@emotion/styled";
import { useHttpRequest } from "../../hooks/useHttpRequest";

import { useEffect, useRef, useState } from "react";
import { ESortType, ICategoryModel, IItemModel, TSortType } from "../../types/item.interface";
import { genClassNames } from "../../utils/utils";
import { BreakPoint } from "../../utils/constatns";
import { useInterval } from "react-use";
import { DateTime } from "luxon";
import { getRefurbishedItemList } from "../../api";

import { FaTelegram } from "react-icons/fa";
import { gaClient } from "../../utils/ga";
import CategoryComponent from "../../components/CategoryComponent";

export default function Special() {
  const [category, setCategory] = useState<ICategoryModel>();
  const [sort, setSort] = useState<TSortType>("SALE");
  const [keyword, setKeyword] = useState("");
  const [now, setNow] = useState("");
  const [size, setSize] = useState(100);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, fetch, isLoading, isInit] = useHttpRequest((categoryId: string) =>
    getRefurbishedItemList({ category: categoryId, sort, title: keyword, size, page, brand: "APPLE" }).then((res) => {
      setTotal(res.data.totalCount);
      return res.data.data;
    })
  );

  useEffect(() => {
    if (!category) return;
    fetch(category.id);
    setNow(DateTime.now().toFormat("hh시 mm분 ss초"));
  }, [category, sort, size, page]);

  useInterval(() => {
    setNow(DateTime.now().toFormat("hh시 mm분 ss초"));
  }, 1000);

  function handleItemClick(item: IItemModel) {
    gaClient.event({ event_name: "click", event_category: "product", event_value: item.name });
    window.open(`https://link.coupang.com${item.url}`);
  }

  function handleTelegramClick() {
    gaClient.event({ event_name: "click", event_category: "telegram" });
    window.open("https://t.me/+vM15DX7dB085NGY9");
  }

  function handleSearch() {
    fetch(category?.id);
  }

  function handleCategoryChange(category: ICategoryModel) {
    gaClient.event({ event_name: "click", event_category: "category", event_value: category.name });
    setKeyword("");
    setCategory(category);
  }

  return (
    <Layout>
      <Container>
        <Title>애플 특별관</Title>
        <Time>{now} 실시간 최신가</Time>
        <CategoryComponent brand="APPLE" onCategoryChange={handleCategoryChange} />

        <SortRow>
          <SearchInput onChange={(e) => setKeyword(e.target.value)} value={keyword} onSearch={handleSearch} placeholder="검색" />
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
                <Item key={item.url} onClick={() => handleItemClick(item)}>
                  <div className="thumbnail">
                    <img src={item.image} />
                  </div>
                  <div className="title">{item.name.slice(0, 40)}</div>
                  <div className="desc">{item.detail}</div>
                  {!!item.originPrice && <div className="original-price">{Number(item.originPrice).toLocaleString()}</div>}

                  {!!item.cardPrice ? (
                    <div className="card-price">
                      <span>카드할인</span>
                      {Number(item.cardPrice).toLocaleString()}
                      <span style={{ marginLeft: "2px" }}></span>
                    </div>
                  ) : (
                    <div className="price">
                      {Number(item.price).toLocaleString()}
                      <span style={{ marginLeft: "2px" }}>원</span>
                    </div>
                  )}
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
                <Item key={item.url} onClick={() => handleItemClick(item)}>
                  <div className="thumbnail">
                    <img src={item.image} />
                  </div>
                  <div className="title">{item.name.slice(0, 40)}</div>

                  {!!item.originPrice && <div className="original-price">{Number(item.originPrice).toLocaleString()}</div>}

                  <div style={{ color: "#e97070" }}>품절</div>
                </Item>
              ))}

          {!isLoading && data?.length === 0 && <div style={{ margin: "0 auto", fontSize: "20px" }}>현재 모든 상품이 품절입니다</div>}
        </ItemList>
        <Footer>
          본 페이지는 쿠팡 파트너스 활동의 일환으로,
          <br /> 링크를 통해 구매하시게 되면 서버에 소정의 수익이 발생할 수 있습니다.
          <br /> 구매하시는 상품의 가격엔 영향이 없고,
          <br /> 모든 수익은 서버 유지 및 관리 비용으로 사용됩니다.
          <br />
          <br />
          이메일:&nbsp;
          <a href="mailto:ogetshopdev@gmail.com" target="_blank" rel="noreferrer">
            ogetshopdev@gmail.com
          </a>
          <br />
          <br />
          All content © 오늘의득템 2021. All rights reserved.
        </Footer>
        <TelegramIcon onClick={handleTelegramClick}>
          <FaTelegram className={genClassNames(["icon"])} />
          <div className="text">실시간 알람</div>
        </TelegramIcon>
      </Container>
    </Layout>
  );
}

const MarketingText = styled.div`
  margin-bottom: 10px;
  padding-left: 10px;
  margin-top: 46px;

  ${BreakPoint.Mobile} {
    font-size: 13px;
    margin-top: 24px;
    margin-bottom: 8px;
  }
`;

const OverlaySale = styled.div`
  display: flex;
  background-color: #ff2b2b;
  color: white;
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 13px;
  padding: 4px 6px 2px;
  z-index: 3;
  border-radius: 4px;
  line-height: 1;
`;

const OverlayFilter = styled.div`
  border-radius: 6px;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 100%);
  background-blend-mode: multiply;
  mix-blend-mode: normal;
  z-index: 1;
`;

const TelegramIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  position: absolute;

  top: 16px;
  right: 16px;

  ${BreakPoint.Mobile} {
    top: 10px;
    right: 10px;
  }

  & > .text {
    margin-top: 6px;
    font-size: 13px;
  }

  & > .icon {
    width: 34px;
    height: 34px;

    ${BreakPoint.Mobile} {
      width: 28px;
      height: 28px;
    }
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
  margin-top: 12px;
  box-sizing: border-box;
  padding: 0 10px;
  align-items: center;

  & > .list {
    display: flex;

    & > .sort-type {
      cursor: pointer;
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
  position: relative;
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

  width: calc(25% - 15px);
  min-width: calc(25% - 15px);

  margin-bottom: 20px;
  margin-right: 20px;
  min-height: 288px;

  ${BreakPoint.BiggerThanMobile} {
    &:nth-of-type(4n) {
      margin-right: 0px;
    }
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
    border-radius: 6px;
    width: 100%;
    padding-top: 100%;
    height: 0;
    position: relative;

    & > img {
      border-radius: 6px;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }

  & > .title {
    font-size: 16px;
    margin-top: 12px;
    margin-bottom: 8px;
    line-height: 1.14;

    ${BreakPoint.Mobile} {
      margin-bottom: 4px;
      margin-top: 10px;
      font-size: 14px;
    }
  }

  & > .desc {
    margin-bottom: 6px;
    line-height: 1.14;
    font-size: 14px;
    color: #5c5c5c;

    ${BreakPoint.Mobile} {
      font-size: 12px;
    }
  }

  & > .danawa-price {
    margin-top: 7px;
    & > span {
      color: #00c113;
      font-size: 11px;
      margin-right: 3px;
    }

    font-size: 12px;
  }

  & > .card-price {
    display: flex;
    margin-top: 5px;
    font-weight: bold;

    & > span {
      color: #ff5121;
      font-size: 14px;
      margin-right: 4px;

      ${BreakPoint.Mobile} {
        font-size: 11px;
        margin-right: 4px;
      }
    }

    font-size: 16px;

    ${BreakPoint.Mobile} {
      font-size: 13px;
    }
  }

  & > .original-price {
    font-size: 14px;
    letter-spacing: 0.6px;
    color: #959595;
    text-decoration: line-through;
    margin-bottom: 4px;

    ${BreakPoint.Mobile} {
      font-size: 13px;
    }
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

  min-height: 40vh;

  ${BreakPoint.Mobile} {
    padding: 0 10px;
  }
`;

const CategoryRow = styled.div`
  display: flex;
  width: calc(100% - 12px);
  flex-wrap: wrap;

  margin: 40px 6px 42px;

  ${BreakPoint.Mobile} {
    margin: 28px 6px 26px;
  }

  & > .item-type {
    min-width: fit-content;
    max-width: fit-content;
    font-size: 16px;
    flex: 1;
    padding: 12px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;

    ${BreakPoint.Mobile} {
      padding: 8px;
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

  ${BreakPoint.Mobile} {
    font-size: 12px;
  }
`;

const Divider = styled.div`
  width: 90%;
  margin: 20px auto;
  height: 1px;
  background-color: #e9e9e9;
`;
