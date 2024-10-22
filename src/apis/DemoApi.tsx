import { InputDataType } from 'views/HRCView/HRCView'
import { axiosPrivate } from './axios'

const DemoApi = {
  getHRCInputList: async (): Promise<InputDataType> => {
    const { data } = await axiosPrivate.get('api/v2/economy/hrc_input')

    return data
  },

  getHRCResultList: async (): Promise<Array<unknown>> => {
    const { data } = await axiosPrivate.get('api/v2/economy/hrc_result')

    return data
  },
}

export default DemoApi
