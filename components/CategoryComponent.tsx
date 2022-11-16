import { getCategories } from "../api";
import { Col, Row, Select } from "antd";
import { useHttpRequest } from "../hooks/useHttpRequest";
import { ICategoryModel } from "../types/item.interface";
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { BreakPoint } from "../utils/constatns";
import { css } from "@emotion/react";

type TProps = {
  brand?: string;
  onCategoryChange: (category: ICategoryModel) => void;
};
export default function CategoryComponent({ brand, onCategoryChange }: TProps) {
  const [data, fetch, isLoading, isInit] = useHttpRequest(() => getCategories(brand).then((res) => res.data.data));

  const [depth1, setDepth1] = useState<string>();
  const [depth2, setDepth2] = useState<string>();

  useEffect(() => {
    if (!depth1) return;
    onCategoryChange(data.find((cate) => depth1 === cate.id));
    setDepth2(null);
  }, [depth1]);

  useEffect(() => {
    console.log(depth1, depth2);
    if (!depth2 && !!depth1) return onCategoryChange(data.find((cate) => depth1 === cate.id));
    else if (!depth2) return;

    onCategoryChange(data.find((cate) => depth2 === cate.id));
  }, [depth2]);

  useEffect(() => {
    fetch(null, { onSuccess: (res) => setDepth1(res.find((cate) => cate.depth === 0)?.id) });
  }, []);

  return (
    <Container>
      <Row gutter={[12, 12]} style={{ boxSizing: "border-box", padding: "0px 10px" }}>
        <Col>
          <Select css={SelectCSS} onChange={setDepth1} value={depth1} placeholder="선택해주세요">
            {data
              ?.filter((menu) => menu.depth == 0)
              .map((menu) => (
                <Select.Option key={menu.id}>{menu.name}</Select.Option>
              ))}
          </Select>
        </Col>
        {depth1 && (
          <Col>
            <Select css={SelectCSS} onChange={setDepth2} value={depth2} placeholder="선택해주세요" allowClear onClear={() => setDepth2(null)}>
              {data
                ?.filter((menu) => menu.depth == 1 && menu.parentId === depth1)
                .map((menu) => (
                  <Select.Option key={menu.id}>{menu.name}</Select.Option>
                ))}
            </Select>
          </Col>
        )}
      </Row>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-top: 40px;

  ${BreakPoint.Mobile} {
    margin-top: 20px;
  }
`;

const SelectCSS = css`
  min-width: 160px;

  ${BreakPoint.Mobile} {
    min-width: 120px;
  }
`;
