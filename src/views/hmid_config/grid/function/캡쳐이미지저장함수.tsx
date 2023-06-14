import domtoimage from 'dom-to-image'
import axios from 'axios'
import { useSetRecoilState } from 'recoil'
import { AlertMessageState, AlertModalState } from 'views/hmid_config/recoil/config/atoms'

export const SaveLayoutImage = (lay_id: number) => {
  const formData: any = new FormData()

  const setMessage = useSetRecoilState(AlertMessageState)
  const setShowModal = useSetRecoilState(AlertModalState)

  const file: any = domtoimage.toBlob(document.querySelector('#DashboardBox')).then((blob) => {
    let id: any = ''
    if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
      id = lay_id
    } else {
      id = lay_id
    }
    const myfile = new File([blob], id + '.png', { type: 'image/png', lastModified: new Date().getTime() })
    formData.append('com_id', window.localStorage.getItem('companyId'))
    if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
      formData.append('lay_id', lay_id)
    } else {
      formData.append('lay_id', lay_id)
    }
    formData.append('file', myfile)
  })

  file.then(function (result: any) {
    // FormData의 key 확인
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout/img', formData)
      .then((response) => {
        console.log('[ Save Dashboard Image Response Data ] : ')
        console.log(response.data)
        setMessage('레이아웃 이미지 저장이 완료 되었습니다.')
        setShowModal(true)
      })
      .catch((error) => {
        console.log(error)
        setMessage('이미지 저장 오류. 관리자에게 문의 바랍니다.')
        setShowModal(true)
      })
  })
}

export default { SaveLayoutImage }
