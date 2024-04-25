import { Todo } from '../models';

export function getAllSubtaskIds(
  taskId: number,
  tasks: {
    [id: number]: Todo;
  }
  
) {
  const task = tasks[taskId];
  if (!task) return [];

  const subtaskIds = task.subtaskIds;

  let allSubtasks = [...subtaskIds];

  subtaskIds.forEach((subId) => {
    allSubtasks = allSubtasks.concat(getAllSubtaskIds(subId, tasks));
  });

  allSubtasks.filter((s) => s !== task.id);

  return allSubtasks;
}
