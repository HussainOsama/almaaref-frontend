type StorageLike = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};

let asyncStorageModule: any = null;
try {
  // Dynamically require to avoid build crash if not installed yet
  asyncStorageModule = require("@react-native-async-storage/async-storage");
} catch (e) {
  asyncStorageModule = null;
}

const memory: Record<string, string> = {};

export const safeStorage: StorageLike = asyncStorageModule?.default
  ? asyncStorageModule.default
  : {
      getItem: (key: string) => memory[key] ?? null,
      setItem: (key: string, value: string) => {
        memory[key] = value;
      },
      removeItem: (key: string) => {
        delete memory[key];
      },
    };
