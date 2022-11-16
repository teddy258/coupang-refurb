import styled from "@emotion/styled";
import { Button, Card, Col, Image, InputNumber, message, Modal, Row, Space, Typography } from "antd";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { deleteUserItemAlarmPrice, getUserItemList } from "../../api";
import { useHttpRequest } from "../../hooks/useHttpRequest";
import { userPriceModifyModalStore } from "../../store/modal";
import { IUserItemModel } from "../../types/item.interface";
import { BreakPoint } from "../../utils/constatns";
import { genClassNames } from "../../utils/utils";

export default function AlarmManager() {
  const router = useRouter();
  const chatId = router.query?.chatId as string;
  const [, setUserPriceModifyModalProps] = useAtom(userPriceModifyModalStore);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);

  const [data, fetch, isLoading, isInit] = useHttpRequest(() =>
    getUserItemList({ chatId: chatId as string, page, size }).then((res) => {
      return res.data.data;
    })
  );

  useEffect(() => {
    if (!chatId) return;

    fetch(null, { onError: () => message.error("알 수 없는 유저 정보입니다.") });
  }, [chatId]);

  function handleModifyClick(item: IUserItemModel) {
    setUserPriceModifyModalProps({ userItem: item, chatId, open: true, onAfterSuccess: fetch });
  }

  function handleDeleteClick(pid: number) {
    Modal.confirm({
      title: "알람을 삭제하시겠습니까?",
      onOk() {
        deleteUserItemAlarmPrice({ chatId: chatId, pid }).then(() => fetch());
      },
    });
  }

  if (!chatId || typeof chatId !== "string") return null;

  return (
    <Layout>
      <Container>
        <Row justify="center" align="middle" gutter={[12, 20]}>
          <Col span={24}>
            <Typography.Title style={{ textAlign: "center" }} level={2}>
              나의 알림 리스트
            </Typography.Title>
          </Col>

          {data?.map((item) => (
            <Item key={item.id}>
              <div className="left">
                <Image preview={false} src={item.image} />
              </div>
              <div className="right">
                <div className={genClassNames(["name"], ["sold-out", item.soldOut])}>
                  {item.name} {item.soldOut && `(품절)`}
                </div>
                <div className="price">{item.userPrice.toLocaleString()} 원 이하 알림 발생</div>
                <div className="buttons">
                  <Button onClick={() => handleModifyClick(item)}>가격 수정</Button>
                  <Button danger onClick={() => handleDeleteClick(item.id)}>
                    알람 제거
                  </Button>
                </div>
              </div>
            </Item>
          ))}
        </Row>
      </Container>
    </Layout>
  );
}

const Item = styled.div`
  width: 100%;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  margin-bottom: 12px;

  & > .left {
    width: 8%;

    ${BreakPoint.Mobile} {
      width: 22.5%;
    }
  }

  & > .right {
    & > .sold-out {
      color: red;
    }

    & > .name {
      font-size: 14px;
      line-height: 1.14;

      ${BreakPoint.Mobile} {
        font-size: 13px;
      }
    }

    & > .price {
      margin-top: 6px;
      font-size: 16px;
    }

    & > .buttons {
      display: flex;
      width: 100%;
      margin-top: 6px;

      column-gap: 12px;
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
  margin-top: 30px;
`;
