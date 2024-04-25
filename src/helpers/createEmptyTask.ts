import dayjs from 'dayjs';
import { Todo } from '../models';

export const createEmptyTask = (
  nextId: number,
  isSubtask: boolean = false
): Todo => {
  return new Todo({
    id: nextId,
    title: '',
    description: '',
    isSubtask,
    subtaskIds: [],
    expireTime: dayjs().add(1, 'day').toISOString(),
    notificationTime: dayjs().add(1, 'hour').toISOString(),
  });
};
