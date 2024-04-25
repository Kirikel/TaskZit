import { Typography, Button, Popover } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import styled from 'styled-components';
import { deleteTodo } from '../../../state';
import { Dispatch, SetStateAction, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { ModalMode } from '../TaskModalSwitch';
import { Todo } from '../../../../models';

const TextFieldWrapper = styled.div`
  width: 100%;
  max-height: 400px;

  display: flex;
  flex-direction: column;
  gap: 5px;

  overflow: auto;
`;

const Controls = styled.div`
  width: 100%;

  padding-top: 10px;

  display: flex;
  flex-direction: column;
`;

const ControlsWrapper = styled.div`
  height: 30px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 5px;
`;

const DateControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DeleteButtonsWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
`;

interface Props {
  task: Todo;
  resetChecked: () => void;
  setModalMode: Dispatch<SetStateAction<ModalMode>>;
}

const TaskView = (props: Props) => {
  const { task, resetChecked, setModalMode } = props;

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  if (!task) return null;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteTodo(task.id));
    resetChecked();
  };

  const id = Boolean(anchorEl) ? 'simple-popover' : undefined;

  return (
    <>
      <TextFieldWrapper>
        <Typography id='modal-modal-title' variant='h6'>
          {task.title}
        </Typography>

        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          {task.description}
        </Typography>
      </TextFieldWrapper>

      <Controls>
        <DateControls>
          <DateTimePicker
            readOnly
            label='Notification time'
            value={dayjs(task?.notificationTime)}
          />

          <DateTimePicker
            readOnly
            label='Expiration time'
            value={dayjs(task?.expireTime)}
          />
        </DateControls>

        <ControlsWrapper>
          <Button
            variant='outlined'
            size='small'
            onClick={() => setModalMode(ModalMode.EDIT)}
          >
            Edit
          </Button>

          <Button variant='contained' size='small' onClick={handleClick}>
            Delete
          </Button>
          <Popover
            id={id}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Wrapper>
              <Typography sx={{ p: 2 }}>Confirm delete task?</Typography>
              <DeleteButtonsWrapper>
                <Button onClick={handleDelete}>Confirm</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DeleteButtonsWrapper>
            </Wrapper>
          </Popover>
        </ControlsWrapper>
      </Controls>
    </>
  );
};
export { TaskView };
