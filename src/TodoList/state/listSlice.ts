import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { RootState } from '../../store';
import { getAllSubtaskIds } from '../../helpers/getAllSubtasks';
import { isNumber } from '../../helpers';
import { Todo } from '../../models';

interface ListState {
  entities: { [id: number]: Todo };
}

const todos: Todo[] = [
  {
    id: 0,
    title: 'Your new task',
    description: 'Delete or edit this task',
    subtaskIds: [2],
    isSubtask: false,
    expireTime: dayjs().add(1, 'day').toISOString(),
    notificationTime: dayjs().add(1, 'hour').toISOString(),
  },
  {
    id: 2,
    title: 'Your new subtask',
    description: 'Delete or edit this task',
    subtaskIds: [],
    parentId: 0,
    isSubtask: true,
    expireTime: dayjs().add(1, 'day').toISOString(),
    notificationTime: dayjs().add(1, 'hour').toISOString(),
  },
];

const storage = localStorage.getItem('todo-spectrum-exit-data');

const initialState: ListState = {
  entities: storage
    ? JSON.parse(storage)
    : todos.reduce((acc, todo) => {
        acc[todo.id] = todo;
        return acc;
      }, {} as { [id: number]: Todo }),
};

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<Todo>) {
      state.entities[action.payload.id] = action.payload;
    },
    updateTodo(state, action: PayloadAction<Todo>) {
      if (state.entities[action.payload.id]) {
        state.entities[action.payload.id] = action.payload;
      }
    },
    deleteTodo(state, action: PayloadAction<number>) {
      if (!Boolean(state.entities[action.payload])) return;

      const parentId = state.entities[action.payload].parentId;
      if (parentId)
        state.entities[parentId].subtaskIds = state.entities[
          parentId
        ].subtaskIds.filter((s) => s !== action.payload);

      const allSubtaskIds = getAllSubtaskIds(action.payload, state.entities);

      for (const s of allSubtaskIds) {
        delete state.entities[s];
      }

      delete state.entities[action.payload];
    },
    addSubtaskId(
      state,
      action: PayloadAction<{ parentId: number; subtaskId: number }>
    ) {
      state.entities[action.payload.parentId].subtaskIds.push(
        action.payload.subtaskId
      );
    },
  },
});

const entities = (state: RootState) => state.listSlice.entities;

export const selectTaskById = (
  state: RootState,
  id: number | null
): Todo | null => {
  if (id === null) return null;

  return state.listSlice.entities[id] || null;
};

export const selectTasks = (state: RootState) => state.listSlice;

export const selectNonSubtasks = createSelector(entities, (entities) => {
  return Object.values(entities).filter((todo) => !todo.isSubtask);
});

export const selectMaxId = (state: RootState): number => {
  const val = Math.max(...Object.keys(state.listSlice.entities).map(Number));
  if (isNumber(val)) return val;
  return 0;
};

export const selectFirstLayerSubtasks = createSelector(
  [entities, (_, taskId: number) => taskId],
  (entities, taskId) => {
    const ids = entities[taskId].subtaskIds;

    return Object.values(entities).filter((value) =>
      ids.some((i) => i === Number(value.id))
    );
  }
);

export const selectSubtasksByTaskId = createSelector(
  [entities, (_, taskId: number) => taskId],
  (entities, taskId) => {
    const ids = getAllSubtaskIds(taskId, entities);

    return Object.values(entities).filter((value) =>
      ids.some((i) => i === Number(value.id))
    );
  }
);

export const { addTodo, updateTodo, deleteTodo, addSubtaskId } =
  listSlice.actions;

export default listSlice.reducer;
