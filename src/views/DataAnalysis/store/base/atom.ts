import dayjs from 'dayjs'

import { atom } from 'recoil'

export const startEndDateAtom = atom({
  key: 'startEndDate',
  default: [dayjs(), dayjs()],
})
