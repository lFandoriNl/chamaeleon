import { StorageOptions } from './types';

export class StorageAdapter {
  private readonly options: StorageOptions;

  constructor(options: StorageOptions) {
    this.options = options;
  }

  async setItem<T extends Record<string, unknown>>(
    key: string,
    item: T,
  ): Promise<void> {
    const data = this.options.expireIn
      ? JSON.stringify({
          data: item,
          expireAt: Date.now() + this.options.expireIn,
        })
      : JSON.stringify({ data: item });

    return await this.options.storage?.setItem(key, data);
  }

  async getItem<T extends Record<string, any>>(key: string): Promise<T> {
    const storageData = await this.options.storage?.getItem<T>(key);

    let parsedData: T;

    try {
      parsedData = JSON.parse(storageData as string) || {};
    } catch (error) {
      parsedData = (storageData as T) || {};
    }

    const dateTimeNow = new Date().getTime();
    const dateTimeExpiration = new Date(parsedData.expireAt).getTime();

    const hasExpired = dateTimeExpiration <= dateTimeNow;

    if (hasExpired) {
      await this.removeItem(key);
    }

    return parsedData.data;
  }

  async removeItem(key: string): Promise<void> {
    await this.options.storage?.removeItem(key);
  }
}
