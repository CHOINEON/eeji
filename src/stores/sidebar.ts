import { atom } from 'recoil'

type SideBarItem = {
  id: string
  label: string
  created: string
  progress: number
  starred: boolean
  deleteYN: boolean
}

export type SideBarContents = {
  id: number
  label: string
  children: Array<SideBarItem>
}

export const SideBarState = atom({
  key: 'sidebarState',
  default: null,
})
