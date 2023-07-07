import React from 'react';
import {IMetaWrapperProps, IProps} from '@/types.ts';
const MetaWrapper: React.FC<IProps & IMetaWrapperProps & {

}> = (props) => {
  document.title = props.title
  return (
    <>
      {props.children}
    </>
  )
}

export default MetaWrapper
