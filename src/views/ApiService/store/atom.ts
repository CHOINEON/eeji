import { atom } from 'recoil'

interface IPublishResult {
  api_key: string
  request: object
  response: { syntax: string }
}

export const publishResultState = atom({
  key: 'publishResultState',
  default: {} as IPublishResult,
})
