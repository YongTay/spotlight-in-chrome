import React, {useEffect, useRef, useState} from 'react';
import css from './Engine.module.scss'
import {EditOutlined, MoreOutlined} from '@ant-design/icons'
import {Table, Modal, Form, Input, Button, Popover,  ModalFuncProps, TableColumnProps} from 'antd';

interface DataType {
  key: string,
  engine: string,
  keyword: string,
  url: string
}

interface EngineDialogProps extends ModalFuncProps {
  onOk: (form: DataType) => void,
  rowData?: DataType
  isAdd?: boolean
}

const EngineDialog: React.FC<EngineDialogProps> = (props) => {
  const [form] = Form.useForm<DataType>()
  const preOpen = useRef<boolean>()
  useEffect(() => {
    preOpen.current = props.open
  }, [props.open])
  useEffect(() => {
    if(props.open) {
      if (props.isAdd === false) {
        if(props.rowData) {
          form.setFieldsValue(props.rowData as DataType)
        } else {
          throw new Error('更新状态下，rowData 不能为空')
        }
      }
      if(preOpen.current === false) {
        form.resetFields()
      }
    }
  }, [props.open, props.isAdd])

  const onOk = () => {
    const key = props.isAdd ? new Date().getTime().toString() : props.rowData?.key
    props.onOk({
      key: key as string,
      keyword: form.getFieldValue('keyword'),
      engine: form.getFieldValue('engine'),
      url: form.getFieldValue('url')
    })
    form.resetFields()
  }

  return (<Modal
    {...props}
    open={props.open}
    onOk={onOk}
    getContainer={false}
    centered
  >
    <Form
      form={form}
      layout='vertical'
    >
      <Form.Item name='engine' label='搜索引擎' required>
        <Input/>
      </Form.Item>
      <Form.Item name='keyword' label='快捷字词' required>
        <Input/>
      </Form.Item>
      <Form.Item name='url' label='网址格式（用“%s”代替搜索字词）' required>
        <Input disabled={props.isAdd === false}/>
      </Form.Item>
    </Form>
  </Modal>)
}

const Content: React.FC<{
  onSetDefault: () => void
  onRemove: () => void
}> = (props) => {
  return (
    <div>
      <div>
        <Button type='text' onClick={props.onSetDefault}>设为默认</Button>
      </div>
      <div>
        <Button type='text' onClick={props.onRemove}>删除</Button>
      </div>
    </div>
  )
}

const Edit: React.FC<{
  rowData: DataType,
  onEdit: (data: DataType) => void
  onSetDefault: (data: DataType) => void
  onRemove: (data: DataType) => void
}> = (props) => {
  return (
    <div className={css.editWrapper}>
      <EditOutlined className={css.editIcon} onClick={() => props.onEdit(props.rowData)}/>
      <Popover
        content={<Content
          onRemove={() => props.onRemove(props.rowData)}
          onSetDefault={() => props.onSetDefault(props.rowData)}
        />}
        placement="left"
        trigger="click"
      >
        <MoreOutlined className={css.editIcon} />
      </Popover>
    </div>
  )
}

const Engine: React.FC = () => {
  const [list, setList] = useState<DataType[]>([])
  const [open, setOpen] = useState<boolean>()
  const [rowData, setRowData] = useState<DataType>()
  const [isAdd, setIsAdd] = useState<boolean>()

  const onEdit = (data: DataType) => {
    setIsAdd(false)
    setRowData(data)
    setOpen(true)
  }

  const onSetDefault = (data: DataType) => {
    console.log(data)
  }

  const onRemove = (data: DataType) => {
    console.log(data)
  }

  const onOk = (data: DataType) => {
    if(isAdd) {
      setList([...list, data])
    } else {
      // 先删除，再新增
      const delIndex = list.findIndex(o => o.key === data.key)
      list.splice(delIndex, 1, data)
      setList([...list])
    }
    setOpen(false)
  }

  const onAdd = () => {
    setIsAdd(true)
    setOpen(true)
  }


  const columns: TableColumnProps<DataType>[] = [
    {title: '搜索引擎', dataIndex: 'engine', key: 'key'},
    {title: '快捷字词', dataIndex: 'keyword', key: 'keyword'},
    {
      title: '操作', dataIndex: 'operate', key: 'operate',
      render: (_, record: DataType) => {
        return (
          <Edit rowData={record} onEdit={onEdit} onRemove={onRemove} onSetDefault={onSetDefault} />
        )
      }
    },
  ]

  return (
    <div className={css.main}>
      <p className={css.title}>搜索设置</p>
      <p
        className={css.tip}>若要使用非默认的搜索引擎，请先在搜索栏中输入相应的快捷字词，然后按您的首选键盘快捷键。您还可在此处更改默认搜索引擎。</p>
      <Table dataSource={list} pagination={false} columns={columns} className={css.table}></Table>
      <div className={css.operateWrapper}>
        <Button onClick={onAdd}>添加</Button>
      </div>
      <EngineDialog
        title={'修改搜索引擎'}
        rowData={rowData}
        open={open}
        isAdd={isAdd}
        onCancel={_ => setOpen(false)}
        onOk={onOk}
      />
    </div>
  )
}

export default Engine
