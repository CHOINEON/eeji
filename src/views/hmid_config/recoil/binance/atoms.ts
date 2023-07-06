/**
 * 2023-07-06 박윤희
 * recoil atoms state
 **/

// atoms.ts
import { atom } from 'recoil'
import { v1 } from 'uuid'

//state
export const Flag = atom({
  key: `Flag/${v1()}`,
  default: 1,
})

export default { Flag }
