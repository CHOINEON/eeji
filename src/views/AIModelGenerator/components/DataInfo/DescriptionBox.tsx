import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { App, Dropdown, MenuProps, Tag } from 'antd'
import DatasetApi from 'apis/DatasetApi'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useSetRecoilState } from 'recoil'
import { FileName } from 'views/AIModelGenerator/components/Input/Title'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { stepCountStore } from 'views/AIModelGenerator/store/global/atom'
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

//각 데이터셋 박스
const DescriptionBox: React.FC<IDescriptionBox> = (props: any) => {
  const { data, onSelect } = props
  const { message, modal } = App.useApp()
  const queryClient = useQueryClient()

  const setModalState = useSetRecoilState(datasetEditModalState)
  const setSelectedData = useSetRecoilState(selectedDataState)
  const setActiveStep = useSetRecoilState(stepCountStore)

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
    if (event.target.tagName !== 'svg' && event.target.tagName !== 'SPAN') {
      //"more" 아이콘 클릭된 경우 예외로 처리
      onSelect(data)
    } else {
      setSelectedData(data)
    }
  }

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

  const handleRunClick = (e: any) => {
    setActiveStep(1)
  }

  return (
    <>
      <DescBoxContainer onClick={handleClick}>
        <div
          style={{
            display: 'block',
            float: 'left',
            width: '50px',
            height: '100%',
            textAlign: 'center',
            lineHeight: '69px',
          }}
        >
          <label>
            <input
              type="checkbox"
              disabled={true} //체크해서 뭐할건지 정의 안되어있음
            />
          </label>
        </div>

        <TitleWrapper>
          <FileName>{data?.name}</FileName>
        </TitleWrapper>
        <div className="container">
          <LargeContent>
            <div>
              <Tag color="#FE7E0D">{data?.target_y}</Tag>
            </div>
          </LargeContent>
          <Content>
            <div>
              {data?.size / 1024 < 1024
                ? Math.round(data?.size / 1024) + ' KB'
                : Math.round(data?.size / 1024 / 1024) + ' MB'}
            </div>
          </Content>
          <LargeContent>
            <div>{data?.create_date}</div>
          </LargeContent>

          <UserContent>
            <div>{data?.user_id}</div>
          </UserContent>
          <Content>
            <button
              style={{
                borderRadius: '10px',
                backgroundColor: '#4338F7',
                color: 'white',
                display: 'inline-block',
                width: '100px',
                height: '30px',
                lineHeight: '30px',
                fontWeight: 500,
              }}
              onClick={handleRunClick}
            >
              Run
            </button>
          </Content>
          <Content style={{ float: 'right' }}>
            <Dropdown menu={{ items, onClick }}>
              <MoreOutlined style={{ display: 'block', textAlign: 'center', lineHeight: '69px' }} size={16} />
            </Dropdown>
          </Content>
        </div>
      </DescBoxContainer>
    </>
  )
}

export default DescriptionBox

const DescBoxContainer = styled.div`
  display: block;
  float: left;
  background-color: #fff;
  width: 100%;
  border: 1px solid #d5dcef;
  border-radius: 15px;
  box-shadow: 0px 0px 10px #0000001a;
  margin: 10px 0;
`

const Content = styled.div`
  display: block;
  float: left;
  color: gray;
  font-size: 13px;
  color: #002d65;
  height: 69px;
  text-align: center;
  line-height: 69px;
  width: 5%;
`

const LargeContent = styled(Content)`
  width: 200px;
`

const UserContent = styled(Content)`
  width: 230px;
`

const TitleWrapper = styled.div`
  text-align: center;
  display: block;
  min-width: 400px;
  float: left;
  height: 69px;
  line-height: 69px;
  // &:hover {
  //   cursor: pointer;
  //}
  //기존css 코드라서 주석 제거하지 않음
`
