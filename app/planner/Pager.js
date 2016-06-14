'use strict'

import React from 'react'

import './Pager.scss'

const Pager = ({ selected, onChangePage }) => {
  return (
    <div className='pl-time-planner-pager'>
      <div className='pl-time-planner-pager__left' onClick={() => onChangePage(-1)}>
        <i className='fa fa-fw fa-angle-left' />
      </div>
      <div className='pl-time-planner-pager__center'>
        {selected}
      </div>
      <div className='pl-time-planner-pager__right' onClick={() => onChangePage(1)}>
        <i className='fa fa-fw fa-angle-right' />
      </div>
    </div>
  )
}

export default Pager
