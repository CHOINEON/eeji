import React from 'react'
import styled from '@emotion/styled'
import '../../style/uploader.css'
import { Dropdown, MenuProps, App, Typography, Button, Tag } from 'antd'
import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons'
import { useRecoilState } from 'recoil'
import { datasetEditModalState } from 'views/DataAnalysis/store/modal/atom'
import { selectedDataState } from 'views/DataAnalysis/store/dataset/atom'
import { useMutation, useQueryClient } from 'react-query'
import DatasetApi from 'apis/DatasetApi'
import { Title, SubTitle, FileName } from 'views/NewDataAnalysis/components/Title'

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
  // onViewMore: any
}

//각 데이터셋 박스
const DescriptionBox: React.FC<IDescriptionBox> = (props: any) => {
  const { data, onSelect } = props
  const { message, modal } = App.useApp()
  const queryClient = useQueryClient()
  const [modalState, setModalState] = useRecoilState(datasetEditModalState)
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState)
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
      //refetching
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
        onCancel() {
          console.log('Cancel')
        },
      })
    }
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
              // checked={checked}
              // onChange={({ target: { checked } }) => onChange(checked)}
            />
            {/* {children} */}
          </label>
        </div>

        <TitleWrapper>
          <FileName style={{ display: 'inline-block' }}>{data?.name}</FileName>
        </TitleWrapper>
        <div
          className="container"
          // style={{
          //   display: 'flex',
          //   flexDirection: 'row',
          //   flexWrap: 'wrap',
          //   justifyContent: 'space-evenly',
          // }}
        >
          <Content>
            <div>
              <Tag color="#FE7E0D">{data?.target_y}</Tag>
            </div>
          </Content>
          <Content>
            <div>
              {data?.size / 1024 < 1024
                ? Math.round(data?.size / 1024) + ' KB'
                : Math.round(data?.size / 1024 / 1024) + ' MB'}
            </div>
          </Content>

          <DateContent>
            <div>{data?.create_date}</div>
          </DateContent>
          <DateContent>
            <div>{data?.update_date}</div>
          </DateContent>
          <Content>
            <div>{data?.user_id}</div>
          </Content>
          <ButtonContent>
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
            >
              Run
            </button>
          </ButtonContent>
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
  // border: 1px solid blue;
  display: block;
  float: left;
  color: gray;
  font-size: 13px;
  color: #002d65;
  height: 69px;
  text-align: center;
  line-height: 69px;
  width: 120px;
  text-align: center;
`

const ButtonContent = styled(Content)`
  width: 10%;
`

const DateContent = styled(Content)`
  width: 200px;
`

const TitleWrapper = styled.div`
  // border: 1px solid red;
  display: block;
  min-width: 400px;
  float: left;
  height: 69px;
  line-height: 69px;
  // &:hover {
  //   cursor: pointer;
  // }
`
