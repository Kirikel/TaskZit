import { Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { addSubtaskId, addTodo, updateTodo } from '../../../state';
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

interface Props {
  task: Todo;
  parentId?: number;
  modalMode?: ModalMode;
  setModalMode: Dispatch<SetStateAction<ModalMode>>;
  setModalTodoId?: Dispatch<SetStateAction<number | null>>;
}

const TaskEdit = (props: Props) => {
  const { task, parentId, modalMode, setModalMode, setModalTodoId } = props;

  const dispatch = useDispatch();

  const [titleText, setTitleText] = useState<string>(task.title);
  const [descriptionText, setDescriptionText] = useState<string>(
    task.description
  );
  const [notificationDate, setNotificationDate] = useState<Dayjs>(() =>
    dayjs(task.notificationTime)
  );
  const [expirationDate, setExpirationDate] = useState<Dayjs>(() =>
    dayjs(task.expireTime)
  );

  const handleSave = () => {
    const newTask: Todo = {
      ...task,
      title: titleText,
      description: descriptionText,
      notificationTime: notificationDate.toISOString(),
      expireTime: expirationDate.toISOString(),
    };

    if (modalMode === ModalMode.NEW) {
      dispatch(addTodo({ ...newTask, parentId }));
      typeof parentId === 'number' &&
        !isNaN(parentId) &&
        dispatch(addSubtaskId({ parentId, subtaskId: task.id }));
    } else {
      dispatch(updateTodo(newTask));
    }

    setModalMode(ModalMode.VIEW);
  };

  const handleCancel = () => {
    if (modalMode === ModalMode.NEW) {
      setModalTodoId?.(null);
    } else {
      setModalMode(ModalMode.VIEW);
    }
  };

  return (
    <>
      <TextFieldWrapper>
        <TextField
          placeholder='Title...'
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
        />

        <TextField
          multiline
          placeholder='Description...'
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
        />
      </TextFieldWrapper>

      <Controls>
        <DateControls>
          <DateTimePicker
            label='Notification time'
            value={notificationDate}
            onChange={(newValue) => {
              if (newValue) setNotificationDate(newValue);
            }}
          />

          <DateTimePicker
            label='Expiration time'
            value={expirationDate}
            onChange={(newValue) => {
              if (newValue) setExpirationDate(newValue);
            }}
          />
        </DateControls>

        <ControlsWrapper>
          <Button variant='outlined' size='small' onClick={handleSave}>
            Save
          </Button>

          <Button variant='contained' size='small' onClick={handleCancel}>
            Cancel
          </Button>
        </ControlsWrapper>
      </Controls>
    </>
  );
};
export { TaskEdit };
