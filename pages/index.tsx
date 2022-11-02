import Head from "next/head";
import Image from "next/image";

import styled from "@emotion/styled";
import { useHttpRequest } from "../hooks/useHttpRequest";
import axios from "axios";
import { useEffect, useState } from "react";
import { EItemType, IItemModel, TItemType } from "../types/item.interface";
import { injectClassNames } from "../utils/utils";
import { BreakPoint } from "../utils/constatns";

export default function Home() {
  const [type, setType] = useState<TItemType>("AIRPOT");

  const [data, fetch, isLoading, isInit] = useHttpRequest(() =>
    axios.get<{ data: IItemModel[] }>(`http://13.125.204.4:5000/api/v1/hoon/product/returnItem?type=${type}`).then((res) => res.data.data)
  );

  useEffect(() => {
    fetch();
  }, [type]);

  function handleItemClick(url: string) {
    window.open(url);
  }

  return (
    <Layout>
      <Container>
        <Title>쿠팡 리퍼몰</Title>
        <CategoryRow>
          {Object.entries(EItemType).map(([key, value]) => (
            <div onClick={() => setType(key)} className={injectClassNames({ name: "item-type" }, { name: "selected", condition: type === key })}>
              {value}
            </div>
          ))}
        </CategoryRow>
        <ItemList>
          {!isLoading &&
            isInit &&
            data?.map((item) => (
              <Item onClick={() => handleItemClick(item.url)}>
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
        </ItemList>
      </Container>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 550px;
`;

const Title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
`;

const Item = styled.div`
  cursor: pointer;

  width: calc(33.33% - 8px);
  min-height: calc(33.33% - 8px);

  margin-bottom: 26px;
  margin-right: 12px;

  &:nth-of-type(3n) {
    margin-right: 0px;
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
    margin-top: 8px;
    margin-bottom: 8px;

    ${BreakPoint.Mobile} {
      font-size: 14px;
      line-height: 1.1;
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
  margin-top: 20px;

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
  margin: 0px 6px;

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