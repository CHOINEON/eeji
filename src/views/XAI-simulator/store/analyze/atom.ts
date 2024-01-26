import { atom } from 'recoil'

export const customModelStore = atom({
  key: 'customModelSaveResult',
  default: { uuid: '', variable_list: [], selected_var: [], data: [] },
})
