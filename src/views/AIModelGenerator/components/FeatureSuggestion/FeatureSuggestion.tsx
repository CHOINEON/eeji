import { Button, message } from 'antd'
import { useState } from 'react'

const FeatureSuggestion = (selectedVarY: Array<any>) => {
  const [btnLoading, setBtnLoading] = useState(false)
  const [messageApi, msgContextHolder] = message.useMessage()

  const handleFeatureSuggest = () => {
    // if (selectedTagsY && selectedTagsY.length > 0) {
    //   fetchFeatureSuggest(selectedTagsY[0])
    // } else {
    //   alert('타겟변수를 선택해주세요')
    // }
  }

  // const fetchFeatureSuggest = (y: any) => {
  //   setBtnLoading(true)

  //   const param = {
  //     y_value: selectedTagsY[0],
  //     x_value: selectedTagsX,
  //     com_id: localStorage.getItem('companyId'),
  //     user_id: localStorage.getItem('userId'),
  //     dataset_id: selectedDataSet,
  //     file_nm: selectedDataFile,
  //   }

  //   console.log('param:', param)
  //   axios
  //     .post(process.env.REACT_APP_API_SERVER_URL + '/api/boruta', param)
  //     .then((response) => {
  //       console.log('boruta resp:', response)

  //       const suggestedArr = response.data
  //       const newSelection: Array<any> = []

  //       if (suggestedArr.length > 0) {
  //         for (let i = 0; i < suggestedArr.length; i++) {
  //           if (selectedVarX.includes(suggestedArr[i]))
  //             newSelection.push(selectedVarX.filter((x: any) => x === suggestedArr[i])[0])
  //         }

  //         if (selectedVarX.every((item: any) => newSelection.includes(item))) {
  //           messageApi.open({
  //             type: 'success',
  //             content: '모든 추천 변수가 선택 되었습니다.',
  //             duration: 1,
  //             style: {
  //               margin: 'auto',
  //             },
  //           })
  //         } else {
  //           setSelectedTagsX(newSelection)
  //         }
  //       } else {
  //         messageApi.open({
  //           type: 'error',
  //           content: '추천 변수가 없습니다.',
  //           duration: 1,
  //           style: {
  //             margin: 'auto',
  //           },
  //         })
  //       }
  //       setBtnLoading(false)
  //     })
  //     .catch((error) => {
  //       console.log('error:', error)
  //       setBtnLoading(false)
  //     })
  // }

  return (
    <div style={{ width: '90%', margin: '6px' }}>
      {selectedVarY.length > 0 && (
        <Button
          type="default"
          style={{ width: '100%' }}
          onClick={handleFeatureSuggest}
          // icon={<AssistantOutlinedIcon />}
          loading={btnLoading}
        >
          Feature Suggestion
        </Button>
      )}
    </div>
  )
}

export default FeatureSuggestion
