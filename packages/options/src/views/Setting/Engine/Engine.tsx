import React, {useEffect, useState} from 'react';
import css from './Engine.module.scss'
import {EditOutlined, MoreOutlined} from '@ant-design/icons'
import {Table, Modal, Form, Input, Button, Popover,  ModalFuncProps, TableColumnProps} from 'antd';
import {addOrUpdateItems, removeItem, getSync} from '@/utils/storage'

interface DataType {
  key: string,
  engine: string,
  keyword: string,
  url: string,
  default?: boolean,
  [k: string]: any
}

interface EngineDialogProps extends ModalFuncProps {
  onOk: (form: DataType) => void,
  rowData?: DataType
  isAdd?: boolean
}

type StatusType = 'error' | undefined

const EngineDialog: React.FC<EngineDialogProps> = (props) => {
  const [form] = Form.useForm<DataType>()
  const [validateStatus, setValidateStatus] = useState<Record<string, StatusType>>({})
  useEffect(() => {
    if(props.open) {
      if (props.isAdd === false) {
        if(props.rowData) {
          form.setFieldsValue(props.rowData as DataType)
        } else {
          throw new Error('更新状态下，rowData 不能为空')
        }
      }
    }
    // 关闭时清空输入框
    if (props.open === false) {
      form.resetFields()
      setValidateStatus({})
    }
  }, [props.open, props.isAdd])

  const onOk = () => {
    form.validateFields().then(res => {
      const status: Record<keyof DataType, StatusType> = {}
      let allow = true
      for(const k in res) {
        if(!res[k]) {
          allow = false
        }
        status[k] = res[k] ? undefined : 'error'
      }
      setValidateStatus(status)
      if(allow) {
        const key = props.isAdd ? new Date().getTime().toString() : props.rowData?.key
        props.onOk({
          key: key as string,
          keyword: form.getFieldValue('keyword'),
          engine: form.getFieldValue('engine'),
          url: form.getFieldValue('url')
        })
        form.resetFields()
      }
    })
  }

  return (<Modal
    {...props}
    open={props.open}
    onOk={onOk}
    getContainer={false}
    centered
    okText="确认"
    cancelText="取消"
  >
    <Form
      form={form}
      layout='vertical'
    >
      <Form.Item
        name='engine'
        label='搜索引擎'
        validateStatus={validateStatus['engine']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='keyword'
        label='快捷字词'
        validateStatus={validateStatus['keyword']}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name='url'
        label='网址格式（用“%s”代替搜索字词）'
        validateStatus={validateStatus['url']}
      >
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
  const [open, setOpen] = useState<boolean>(false)
  const onRemove = () => {
    setOpen(false)
    props.onRemove(props.rowData)
  }

  const onSetDefault = () => {
    setOpen(false)
    props.onSetDefault(props.rowData)
  }
  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  return (
    <div className={css.editWrapper}>
      <EditOutlined className={css.editIcon} onClick={() => props.onEdit(props.rowData)}/>
      <Popover
        content={<Content
          onRemove={onRemove}
          onSetDefault={onSetDefault}
        />}
        placement="left"
        trigger="click"
        open={open}
        onOpenChange={onOpenChange}
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
  const [modelTitle, setModelTitle] = useState<string>()

  getSync().then(res => {
    const list = []
    let first
    for(const k in res) {
      if(res[k].default) {
        first = res[k]
      } else {
        list.push(res[k])
      }
    }
    if(first) {
      list.unshift(first)
    }
    setList(list)
  })

  const onEdit = (data: DataType) => {
    setModelTitle('修改搜索引擎')
    setIsAdd(false)
    setRowData(data)
    setOpen(true)
  }

  const onSetDefault = (data: DataType) => {
    getSync().then(res => {
      for(const k in res) {
        res[k].default = false
      }
      res[data.url] = { ...data, default: true }
      addOrUpdateItems(res)
    })
  }

  const onRemove = (data: DataType) => {
    removeItem(data.url).then(() => {})
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
    addOrUpdateItems({ [data.url]: data })
  }

  const onAdd = () => {
    setModelTitle('新增搜索引擎')
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
      <Table
        dataSource={list}
        pagination={false}
        columns={columns}
        className={css.table}
      ></Table>
      <div className={css.operateWrapper}>
        <Button onClick={onAdd}>添加</Button>
      </div>
      <EngineDialog
        title={modelTitle}
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
