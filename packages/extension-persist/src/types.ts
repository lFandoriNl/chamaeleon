export interface StorageOptions {
  /**
   * @property {Number} [expireIn] A value in milliseconds to determine when the data in storage should not be retrieved by getItem.
   * @default Infinite
   */
  expireIn?: number;
  storage?: StorageController;
}

export interface StorageController {
  /**
   * The function that will retrieved the storage data by a specific identifier.
   *
   * @function
   * @param {String} key
   * @return {Promise<String | Object>}
   */
  getItem<T>(key: string): T | string | null | Promise<T | string | null>;
  /**
   * The function that will remove data from storage by a specific identifier.
   *
   * @function
   * @param {String} key
   * @return {Promise<void>}
   */
  removeItem(key: string): void | Promise<void>;
  /**
   * The function that will save data to the storage by a specific identifier.
   *
   * @function
   * @param {String} key
   * @param {String | Object} value
   * @return {Promise<void>}
   */
  setItem(key: string, value: any): void | Promise<void>;
}
