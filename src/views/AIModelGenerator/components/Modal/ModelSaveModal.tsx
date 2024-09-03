import styled from '@emotion/styled'
import { Input, Row } from 'antd'
import { useState } from 'react'
import { CustomButton } from '../Modal/DataImportModal'

interface ModelRenameProps {
  data: { model_name: string; model_id: string }
  onClick: () => void
  onSave: (model_name: string) => string
}

const ModelSaveModal = ({ data, onSave }: ModelRenameProps) => {
  const [modelName, setModelName] = useState(data.model_name)
  // const [description, setDescription] = useState('')

  const handleClick = () => {
    onSave(modelName)
  }

  return (
    <div>
      <Row>
        <SubText>* Model Name</SubText>
        <Input
          style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
          placeholder="Type model name here...(Max length: 100)"
          maxLength={100}
          onChange={(e) => setModelName(e.target.value)}
          value={modelName}
          allowClear
        />
      </Row>
      {/* <Row className="mt-4">
          <TextArea
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Description"
            autoSize={{ minRows: 3, maxRows: 2 }}
            maxLength={50}
          />
        </Row> */}
      <CustomButton style={{ height: 40, marginTop: '30px', fontSize: 15, fontWeight: 'bold' }} onClick={handleClick}>
        Save
      </CustomButton>
    </div>
  )
}

export default ModelSaveModal

const MainText = styled.p`
  font-family: '본고딕';
  font-weight: bold;
  color: #002d65;
  font-size: 20px;
`
const SubText = styled.p`
  font-family: '본고딕';
  color: #002d65;
  font-size: 13px;
`
