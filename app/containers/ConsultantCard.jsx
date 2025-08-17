'use strict'

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import './ConsultantCard.scss'

import * as settingsActions from '../actions/settingsActions'

function ConsultantCard({ userId }) {
  const dispatch = useDispatch()
  
  // Redux state
  const consultant = useSelector(state => state.users.data[userId])
  
  // Action handlers
  const showConsultantProperties = (consultantId) => dispatch(settingsActions.showConsultantProperties(consultantId))
  
  const onClick = () => {
    showConsultantProperties(consultant._id)
  }

  if (!consultant) {
    return <div>Loading consultant...</div>
  }

  return (
    <div className='pl-consultant-card__row' onClick={onClick}>
      <div className='pl-consultant-card__row-label' />
      <div className='pl-consultant-card__row-avatar'
        style={{ backgroundImage: `url(${consultant.profile?.photo})` }}
      />
      <div className='pl-consultant-card__row-info'>
        <div className='pl-consultant-card__row-info__name'>
          {consultant.firstName}{' '}{consultant.lastName}
        </div>
        <div className='pl-consultant-card__row-info__personal'>
          {consultant.profile && consultant.profile.title || consultant.email}
        </div>
      </div>
    </div>
  )
}

ConsultantCard.propTypes = {
  userId: PropTypes.string.isRequired
}

// Use React.memo for performance optimization (replaces PureRenderMixin)
export default memo(ConsultantCard)
