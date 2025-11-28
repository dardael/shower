export interface IRemoveMenuItem {
  execute(id: string): Promise<void>;
}
