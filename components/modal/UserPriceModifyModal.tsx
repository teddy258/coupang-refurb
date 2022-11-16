import { Form, Input, InputNumber, message, Modal } from "antd";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { modifyUserItemAlarmPrice } from "../../api";
import { userPriceModifyModalStore } from "../../store/modal";

type TFormData = {
  userPrice: number;
};

export default function UserPriceModifyModal() {
  const [props, setProps] = useAtom(userPriceModifyModalStore);
  const [formRef] = Form.useForm();

  function handleClose() {
    setProps({ open: false, userItem: null, chatId: null });
  }

  function handleFinish(form: TFormData) {
    modifyUserItemAlarmPrice({ chatId: props.chatId, pid: props.userItem.id, price: form.userPrice }).then(() => {
      message.success("성공적으로 수정되었습니다.");
      handleClose();
      props.onAfterSuccess?.();
    });
  }

  useEffect(() => {
    if (!props) return;
    formRef.resetFields();
  }, [props]);

  if (!props.userItem) return null;

  return (
    <Modal title="알람 가격 수정하기" open={props.open} onCancel={handleClose} onOk={formRef.submit}>
      <Form form={formRef} onFinish={handleFinish}>
        <Form.Item name="userPrice" label="알람 가격" initialValue={props.userItem.userPrice}>
          <InputNumber
            style={{ width: "300px" }}
            formatter={(value) => `${value} 원`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\s?원|(,*)/g, "")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
