import { FileAddOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { SquareItemBox } from '../DataInfo/DescriptionBox'

type AddItemButtonProps = {
  onClick: () => void
}

const AddItemButton = ({ onClick }: AddItemButtonProps) => {
  return (
    <>
      <AddItemWrapper onClick={onClick}>
        <FileAddOutlined className="text-[30px] text-[#002d65]" />
      </AddItemWrapper>
    </>
  )
}

export default AddItemButton

const AddItemWrapper = styled(SquareItemBox)`
  line-height: 100px;
  cursor: pointer;
  &:hover {
    background-color: #d5dcef;
    color: #fff;
  }
`
