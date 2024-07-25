import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { App, Checkbox, Dropdown, MenuProps } from 'antd'
import DatasetApi from 'apis/DatasetApi'
import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { FileName } from 'views/AIModelGenerator/components/Input/Text'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { datasetEditModalState } from 'views/AIModelGenerator/store/modal/atom'
import '../../style/uploader.css'

export interface DescriptionBoxProps {
  ds_id?: string
  name?: string
  size?: number
  create_date?: string
  update_date?: string
  start_date?: string
  end_date?: string
  date_col?: string
  descr?: string
  loc?: string
}

export interface IDescriptionBox {
  data: DescriptionBoxProps | Array<any>
  onSelect: any
}

const SelectedBg = css`
  background-color: #d5dcef;
`

//각 데이터셋 박스
const DescriptionBox: React.FC<IDescriptionBox> = ({ data, onSelect }: any) => {
  const { message, modal } = App.useApp()
  const queryClient = useQueryClient()

  const setModalState = useSetRecoilState(datasetEditModalState)
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState)
  const resetSelectedData = useResetRecoilState(selectedDataState)

  const [isChecked, setIsChecked] = useState(false)

  const items: MenuProps['items'] = [
    {
      label: 'Edit',
      key: '1',
    },
    {
      label: 'Delete',
      key: '2',
    },
  ]

  const { mutate: mutateDelete } = useMutation(DatasetApi.deleteDataset, {
    onSuccess: (response: any) => {
      message.success(response?.message)
      queryClient.invalidateQueries('datasets')
    },
    onError: (error: any) => {
      message.error('삭제 실패')
    },
  })

  const handleClick = (event: any) => {
    //"more" 아이콘 클릭된 경우 예외로 처리
    if (event.target.tagName !== 'svg' && event.target.tagName !== 'SPAN') {
      onSelect(data)
      setIsChecked((prev) => !prev)
    } else {
      setSelectedData(data)
    }
  }

  //체크 해제 시 선택된 데이터셋 비움
  useEffect(() => {
    if (!isChecked) resetSelectedData()
  }, [isChecked])

  //선택된 데이터 하나만 제외하고 다 체크 해제
  useEffect(() => {
    if (selectedData.ds_id == '' || selectedData.ds_id !== data.ds_id) setIsChecked(false)
  }, [selectedData])

  const handleDelete = (ds_id: any) => {
    const param = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      ds_id: ds_id,
    }

    mutateDelete(param)
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      setModalState(true)
    }
    if (key === '2') {
      modal.confirm({
        title: 'Do you want to delete this dataset?',
        icon: <ExclamationCircleFilled />,
        content: `Deletion is permanent and you will not be able to undo it.`,
        onOk() {
          handleDelete(data.ds_id)
        },
      })
    }
  }

  return (
    <>
      <DescBoxContainer onClick={handleClick} isChecked={isChecked}>
        <div className="h-4/5">
          <Checkbox checked={isChecked}></Checkbox>
          <FileName>{data?.name}</FileName>
        </div>
        <div className="h-1/5">
          <Content className="w-5/6 float-left">
            <div>
              {data?.size / 1024 < 1024
                ? Math.round(data?.size / 1024) + ' KB'
                : Math.round(data?.size / 1024 / 1024) + ' MB'}
            </div>
          </Content>
          <Content className="text-right w-1/6 float-right">
            <Dropdown menu={{ items, onClick }}>
              <MoreOutlined size={16} />
            </Dropdown>
          </Content>
        </div>
      </DescBoxContainer>
    </>
  )
}

export default DescriptionBox

export const SquareItemBox = styled.div`
  width: 100px;
  height: 100px;
  margin: 10px;
  border-radius: 15px;
`

const DescBoxContainer = styled(SquareItemBox)<{ isChecked: boolean }>`
  display: inline-block;
  background-color: #fff;
  border: 1px solid #d5dcef;
  box-shadow: 0px 0px 10px #0000001a;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #d5dcef;
    color: #fff;
  }
  ${(props: any) => (props.isChecked ? SelectedBg : '')}
`
const Content = styled.div`
  color: gray;
  font-size: 10px;
  color: #002d65;
`
