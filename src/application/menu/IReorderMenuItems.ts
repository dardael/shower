export interface IReorderMenuItems {
  execute(orderedIds: string[]): Promise<void>;
}
