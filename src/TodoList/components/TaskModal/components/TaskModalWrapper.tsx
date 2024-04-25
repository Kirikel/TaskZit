import { Modal } from '@mui/material';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 600px;
  height: fit-content;
  min-height: 400px;
  max-height: 650px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 10px;

  background-color: aliceblue;
  border: 2px solid rgb(24, 114, 206, 0.3);
  border-radius: 10px;
  box-shadow: 24;
`;

interface Props {
  children: ReactNode;
  modalTodoId: number | null;
  setModalTodoId: Dispatch<SetStateAction<number | null>>;
}

const TaskModalWrapper = (props: Props) => {
  const { children, modalTodoId, setModalTodoId } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (modalTodoId === null || isNaN(modalTodoId)) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [modalTodoId]);

  return (
    <Modal open={open} onClose={() => setModalTodoId(null)}>
      <Root>
        <>{children}</>
      </Root>
    </Modal>
  );
};
export { TaskModalWrapper };
