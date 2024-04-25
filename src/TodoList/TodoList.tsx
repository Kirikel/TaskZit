import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  deleteTodo,
  selectMaxId,
  selectNonSubtasks,
  selectTasks,
} from './state';
import List from '@mui/material/List';
import { ListItem } from './components';
import { useEffect, useState } from 'react';
import { TaskModalSwitch } from './components';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { Tooltip, Typography } from '@mui/material';
import { createEmptyTask } from '../helpers';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { IconWrapper } from './components/UI';
import { Todo } from '../models';

const Root = styled.div`
  width: 1000px;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export interface EmptyTask {
  entity: Todo;
  parentId?: number;
}

const TodoList = () => {
  const nonSubtasksList = useSelector(selectNonSubtasks);
  const maxId = useSelector(selectMaxId);
  const allTasks = useSelector(selectTasks);
  const dispatch = useDispatch();

  const [modalTodoId, setModalTodoId] = useState<number | null>(null);
  const [isCreateNewTaskModal, setIsCreateNewTaskModal] = useState(false);
  const [emptyTask, setEmptyTask] = useState<EmptyTask | null>(null);
  const [checked, setChecked] = useState<number[]>(
    new Array(maxId + 1).fill(0)
  );

  const handleCreateEmptyTask = (parentId?: number) => {
    const isSubtask = typeof parentId === 'number';

    const task = createEmptyTask(maxId + 1, isSubtask);
    setEmptyTask({ entity: task, parentId });
    setIsCreateNewTaskModal(true);
    setModalTodoId(task.id);
  };

  const resetChecked = () => {
    setChecked(new Array(maxId + 1).fill(0));
  };

  const handleDelete = () => {
    checked.map((c, idx) => {
      if (c) {
        dispatch(deleteTodo(idx));
      }
    });

    resetChecked();
  };

  useEffect(() => {
    if (modalTodoId === null) {
      setIsCreateNewTaskModal(false);
      setEmptyTask(null);
    }
  }, [modalTodoId]);

  useEffect(() => {
    resetChecked();
  }, [allTasks]);

  return (
    <Root>
      <TitleWrapper>
        <Typography variant='h5'>Todo List</Typography>
        <Tooltip title='New Task' placement='right'>
          <AddTaskIcon
            color='primary'
            sx={{ cursor: 'pointer' }}
            onClick={() => handleCreateEmptyTask()}
          />
        </Tooltip>
      </TitleWrapper>

      <List>
        {nonSubtasksList.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            checked={checked}
            setChecked={setChecked}
            setModalTodoId={setModalTodoId}
            handleCreateEmptyTask={handleCreateEmptyTask}
          />
        ))}
      </List>

      <IconWrapper>
        <Tooltip title='Delete selected tasks' placement='right'>
          <DeleteSweepIcon onClick={handleDelete} />
        </Tooltip>
      </IconWrapper>

      <TaskModalSwitch
        emptyTask={emptyTask}
        modalTodoId={modalTodoId}
        isCreateNewTaskModal={isCreateNewTaskModal}
        resetChecked={resetChecked}
        setModalTodoId={setModalTodoId}
      />
    </Root>
  );
};

export { TodoList };
