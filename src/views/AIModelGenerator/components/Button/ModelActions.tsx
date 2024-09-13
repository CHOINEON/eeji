import { EllipsisOutlined } from '@ant-design/icons'
import { App, Button, Dropdown, MenuProps } from 'antd'
import ModelApi from 'apis/ModelApi'
import useModal from 'hooks/useModal'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'

interface ActionsProps {
  model_id: string
  model_name?: string
}

const Actions = ({ model_id, model_name }: ActionsProps) => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()
  const { mutate: mutateRenameModel } = useMutation(ModelApi.renameModel, {
    onSuccess: () => {
      message.success(t('Successfully saved'))
      closeModal()
      queryClient.invalidateQueries('models')
    },
  })

  const handleEdit = () => {
    const payload = { model_id: model_id, model_name: model_name }

    handleClick('SaveModel', payload)
  }

  function handleClick(type: string, payload: object) {
    openModal({
      modalTitle: t('Update Model Details'),
      modalType: type,
      modalProps: {
        data: payload,
        onClick: () => {
          closeModal()
        },
        onSave: (newName: string) => mutateRenameModel({ model_id: model_id, model_name: newName }),
      },
    })
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <button onClick={handleEdit}>Edit</button>,
    },
    {
      key: '2',
      label: <button onClick={() => message.info('개발 중입니다.')}>Delete</button>,
    },
  ]

  const dropDown = useMemo(() => {
    return (
      <Dropdown menu={{ items }} placement="bottom">
        <Button type="text" icon={<EllipsisOutlined />}></Button>
      </Dropdown>
    )
  }, [model_id, items])

  return dropDown
}

export default Actions
