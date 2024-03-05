import { atom } from 'recoil'
export const ModelStore = atom({
  key: 'ModelStoreResult',
  default: {
    modelaccuracy: null,
    mae: null,
    mse: null,
    rmse: null,
  },
})
