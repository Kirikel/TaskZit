import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTaskById } from '../../state';
import { RootState } from '../../../store';
import { TaskEdit, TaskModalWrapper, TaskView } from './components';
import { EmptyTask } from '../../TodoList';

export enum ModalMode {
  NEW = 'new',
  EDIT = 'edit',
  VIEW = 'view',
}

interface Props {
  emptyTask: EmptyTask | null;
  modalTodoId: number | null;
  isCreateNewTaskModal?: boolean;
  resetChecked: () => void;
  setModalTodoId: Dispatch<SetStateAction<number | null>>;
}

const TaskModalSwitch = (props: Props) => {
  const {
    modalTodoId,
    emptyTask,
    isCreateNewTaskModal,
    resetChecked,
    setModalTodoId,
  } = props;

  const taskFromStore = useSelector((state: RootState) =>
    selectTaskById(state, modalTodoId)
  );

  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.VIEW);

  useEffect(() => {
    setModalMode(isCreateNewTaskModal ? ModalMode.NEW : ModalMode.VIEW);
  }, [isCreateNewTaskModal]);

  switch (modalMode) {
    case 'edit': {
      if (!taskFromStore) return null;
      return (
        <TaskModalWrapper
          modalTodoId={modalTodoId}
          setModalTodoId={setModalTodoId}
        >
          <TaskEdit task={taskFromStore} setModalMode={setModalMode} />
        </TaskModalWrapper>
      );
    }

    case 'view': {
      if (!taskFromStore) return null;
      return (
        <TaskModalWrapper
          modalTodoId={modalTodoId}
          setModalTodoId={setModalTodoId}
        >
          <TaskView
            task={taskFromStore}
            setModalMode={setModalMode}
            resetChecked={resetChecked}
          />
        </TaskModalWrapper>
      );
    }

    case 'new': {
      if (!emptyTask) return null;
      return (
        <TaskModalWrapper
          modalTodoId={modalTodoId}
          setModalTodoId={setModalTodoId}
        >
          <TaskEdit
            task={emptyTask.entity}
            parentId={emptyTask.parentId}
            modalMode={modalMode}
            setModalMode={setModalMode}
            setModalTodoId={setModalTodoId}
          />
        </TaskModalWrapper>
      );
    }

    default:
      return null;
  }
};

export { TaskModalSwitch };
