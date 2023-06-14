import axios from 'axios'
import { useSetRecoilState } from 'recoil'
import { TagListArrState, ShowLoadingState } from 'views/hmid_config/recoil/config/atoms'

export const getTagList = () => {
  const setTagList = useSetRecoilState(TagListArrState)
  const setLoadingState = useSetRecoilState(ShowLoadingState)

  const params: any = {
    com_id: localStorage.getItem('companyId'),
    search_type: 'hmid',
  }

  axios
    .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', params)
    .then((response) => {
      console.log('[ Tag List Response Data ] : ')
      console.log(response.data)

      setTagList(response.data)
    })
    .catch((error) => {
      console.log(error)
      setLoadingState(false)
    })
}

export default { getTagList }
