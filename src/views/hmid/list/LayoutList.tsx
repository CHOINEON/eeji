import React from 'react'
import axios from 'axios'
import { Box, useColorModeValue, Stack, Button, Checkbox } from '@chakra-ui/react'

// interface LayoutListProps {
//   company_id: string
//   setLayoutId: (layout_id: string) => void
// }

export default function LayoutList() {
  const [ButtonDisabled, setButtonDisabled] = React.useState<boolean>(true)
  const [OpenLayoutModal, setOpenLayoutModal] = React.useState<boolean>(false)
  const [GridInfo, setGridInfo] = React.useState<string>()
  const [ItemColor, setItemColor] = React.useState('#0044620f')

  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  const theme = useColorModeValue('navy.700', 'white')
  console.log(theme)

  // React.useEffect(() => {
  //   getLayoutList(props.company_id)
  // }, [props.company_id])

  const getLayoutList = (company_id: string) => {
    axios
      .get('http://192.168.1.27:8000/hmid/getLayout?company_id=' + company_id, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ get Layout List axios response data ] : ')
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  return (
    <>
      <div>test</div>
    </>
  )
}
