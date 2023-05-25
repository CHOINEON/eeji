import { CompanyId, LayoutTitle } from './atoms'

import { selector } from 'recoil'

export const CompanyIdSelector = selector({
  key: 'CompanyIdSelector',
  get: ({ get }) => get(CompanyId),
  set: ({ set }, newValue) => set(CompanyId, newValue),
})

export const LayoutTitleSelector = selector({
  key: 'LayoutTitleSelector',
  get: ({ get }) => get(LayoutTitle),
  set: ({ set }, newValue) => set(LayoutTitle, newValue),
})
