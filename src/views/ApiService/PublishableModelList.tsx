import styled from '@emotion/styled'
import { Empty } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModelRow from './table/ModelRow'

const SavedModelList = ({ data, onSelect }: any) => {
  const { t } = useTranslation()
  const [btnActive, setBtnActive] = useState(0)

  const toggleActive = (idx: number) => {
    setBtnActive(idx)
    onSelect(data[idx].model_id)
  }

  return (
    <PublishableModelList>
      <StyledColumn>
        <ColumnLabel className="w-1/12">{t('Model Creation Date')}</ColumnLabel>
        <ColumnLabel className="w-2/12">{t('Model Name')}</ColumnLabel>
        <ColumnLabel className="w-1/12">{t('Description')}</ColumnLabel>
        <ColumnLabel className="w-1/12">{t('Target Variable Name')}</ColumnLabel>
        <ColumnLabel className="w-3/12">{t('Input Variables')}</ColumnLabel>
        <ColumnLabel className="w-1/12">{t('Model Type')}</ColumnLabel>
        <ColumnLabel className="w-1/12">{t('Status')}</ColumnLabel>
        <ColumnLabel className="w-2/12">{t('API Key')}</ColumnLabel>
      </StyledColumn>
      {data?.length > 0 ? (
        data?.map((item: any, idx: number) => (
          <PredictionListWrapper key={idx}>
            <ModelRow id={idx} item={item} active={idx === btnActive} onClick={() => toggleActive(idx)} />
          </PredictionListWrapper>
        ))
      ) : (
        <div className="m-auto relative top-[50px]">
          <Empty />
        </div>
      )}
    </PublishableModelList>
  )
}

export default SavedModelList

const PublishableModelList = styled.div`
  margin: 20px auto;
  width: 100%;
  height: 300px;
  box-shadow: 0px 0px 10px #5951db33;
  background-color: #fff;
  border: 1px solid #d5dcef;
  border-radius: 25px;
  padding: 20px;
  overflow: auto;

  overflow-y: scroll;
  overflow: -moz-scrollbars-vertical;

  &::-webkit-scrollbar {
    background: #332bbf;
    border-radius: 30%; //width가 너무 작아서 안보임..
    width: 4px;
    height: 4px;
    display: flex;
    overflow: auto;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
  }

  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  color: #002d65;
  font-size: 12px;
  text-align: center;
  margin-bottom: 2.5px;
`

const PredictionListWrapper = styled.div`
  width: 100%;
  min-height: 45px;
  border-radius: 10px;
  border: 1px solid #d5dcef;
  margin-bottom: 5px;

  &::-webkit-scrollbar {
    display: flex;
    border-radius: 30%;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
    // overflow: auto;
  }
  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`

const ColumnLabel = styled.h2`
  // border: 1px solid red;
  text-align: center;
`
