export class Todo {
  id: number;
  title: string;
  description: string;
  subtaskIds: number[];
  parentId?: number;
  isSubtask: boolean;
  expireTime: string;
  notificationTime: string;

  constructor({
    id,
    title,
    description,
    subtaskIds,
    parentId,
    isSubtask,
    expireTime,
    notificationTime,
  }: Todo) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.subtaskIds = subtaskIds;
    this.parentId = parentId;
    this.isSubtask = isSubtask;
    this.expireTime = expireTime;
    this.notificationTime = notificationTime;
  }
}
