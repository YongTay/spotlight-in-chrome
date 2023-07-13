import React, {useState} from 'react';
import {Button, Space, Tree} from 'antd';
import css from './Bookmarks.module.scss'
// import bookmarks from './b.json'

const { DirectoryTree } = Tree
type TreeNodeType = chrome.bookmarks.BookmarkTreeNode & {
  key: string | number,
  title: string,
  id: string | number,
  isLeaf?: boolean,
  children?: Array<TreeNodeType>
}

async function genData(): Promise<TreeNodeType[]> {
  const bookmarks = await chrome.bookmarks.getTree()
  bookmarks[0].title = '书签数据'
  const walk = (data: TreeNodeType | TreeNodeType[]) => {
    // @ts-ignore
    data.key = data.id
    // @ts-ignore
    data.isLeaf = !('children' in data)
    if(Array.isArray(data)) {
      data.forEach(i => walk(i))
    } else if(Array.isArray(data.children)) {
      // @ts-ignore
      data.children.forEach(i => walk(i))
    }
  }
  // @ts-ignore
  bookmarks.forEach(i => walk(i))
  // @ts-ignore
  return bookmarks
}

const Bookmarks: React.FC<{}> = () => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>([])
  if(treeData.length === 0) {
    genData().then(data => setTreeData(data))
  }

  return (<div className={css.wrapper}>
    <div className={css.buttonWrapper}>
      <Space>
        <Button>同步</Button>
      </Space>
    </div>
    <div className={css.treeWrapper}>
      <DirectoryTree
        defaultExpandAll
        treeData={treeData}
      />
    </div>
  </div>)
}

export default Bookmarks
