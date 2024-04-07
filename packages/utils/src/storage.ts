interface ProxyStorage {
  setItem: <T>(k: string, v: T) => void;
  getItem: <T>(k: string) => T;
  removeItem: (k: string) => void;
  clear: () => void;
}
// sessionStorage operate
class sessionStorageProxy implements ProxyStorage {
  protected storage: ProxyStorage;

  private serialize(val: any) {
    return JSON.stringify(val);
  }

  private deserialize(val: any) {
    if (typeof val !== "string")
      return undefined;

    try {
      return JSON.parse(val);
    }
    catch {
      return val || undefined;
    }
  }

  constructor(storageModel: any) {
    this.storage = storageModel;
  }

  // 存
  public setItem<T>(key: string, value: T): void {
    this.storage.setItem(key, this.serialize(value));
  }

  // 取
  public getItem<T>(key: string): T {
    return this.deserialize(this.storage.getItem(key));
  }

  // 删
  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  // 清空
  public clear(): void {
    this.storage.clear();
  }
}

// localStorage operate
class localStorageProxy extends sessionStorageProxy implements ProxyStorage {
  constructor(localStorage: any) {
    super(localStorage);
  }
}

export const storageSession = new sessionStorageProxy(sessionStorage);

export const storageLocal = new localStorageProxy(localStorage);
