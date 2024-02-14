import { atom } from 'recoil'

// export interface ProgressState {
//     progress: number;
//     isLoading : boolean;
// }

export const ProgressState = atom({
  key: 'progress',
  default: {
    progress: 0,
    isLoading: false,
  },
})
