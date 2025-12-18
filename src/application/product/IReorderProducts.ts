export interface IReorderProducts {
  execute(productIds: string[]): Promise<void>;
}
