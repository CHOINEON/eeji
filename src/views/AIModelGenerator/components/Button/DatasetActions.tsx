import { EllipsisOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { App, Button, Dropdown, MenuProps } from 'antd'
import DatasetApi from 'apis/DatasetApi'
import axios from 'axios'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { datasetEditModalState } from 'views/AIModelGenerator/store/modal/atom'

const Actions = () => {
  const { message, modal } = App.useApp()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const setModalState = useSetRecoilState(datasetEditModalState)
  const selectedData = useRecoilValue(selectedDataState)

  const { mutate: mutateDelete } = useMutation(DatasetApi.deleteDataset, {
    onSuccess: () => {
      message.success(t('The dataset has been successfully deleted.'))
      queryClient.invalidateQueries('datasets')
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        message.error(`${t('Deletion failed.')} ${t('Please contact the administrator.')}`)
      } else {
        message.error(t('An unknown error occurred.'))
      }
    },
  })

  const handleEdit = () => {
    setModalState(true)
  }

  const handleDelete = () => {
    modal.confirm({
      title: t('Do you want to delete this dataset?'),
      icon: <ExclamationCircleFilled />,
      content: t('Deletion is permanent and you will not be able to undo it.'),
      onOk() {
        const param = {
          com_id: localStorage.getItem('companyId'),
          user_id: localStorage.getItem('userId'),
          ds_id: selectedData.ds_id,
        }

        mutateDelete(param)
      },
    })
  }

  const items: MenuProps['items'] = [
    {
      label: <button onClick={handleEdit}>{t('Edit')}</button>,
      key: '1',
    },
    {
      label: <button onClick={handleDelete}>{t('Delete')}</button>,
      key: '2',
    },
  ]

  const dropDown = useMemo(() => {
    return (
      <Dropdown menu={{ items }} placement="bottom">
        <Button type="text" icon={<EllipsisOutlined />}></Button>
      </Dropdown>
    )
  }, [selectedData.ds_id, items])

  return dropDown
}

export default Actions
