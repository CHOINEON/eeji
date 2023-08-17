import { DefaultValue, SerializableParam, atom, atomFamily, selectorFamily } from 'recoil'

export const importModalAtom = atom({
  key: 'dataImportModal',
  default: false,
})

export const listModalAtom = atom({
  key: 'dataListModal',
  default: false,
})

export const saveModalAtom = atom({
  key: 'saveModalAtom',
  default: false,
})
