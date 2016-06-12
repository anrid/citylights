'use strict'

import React, { Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './ConsultantCard.scss'

import * as settingsActions from '../actions/settingsActions'

export class ConsultantCard extends Component {
  constructor (props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onClick (command) {
    const { consultant, actions } = this.props
    actions.showConsultantProperties(consultant._id)
  }

  render () {
    const { consultant } = this.props
    return (
      <div className='pl-consultant-card__row' onClick={this.onClick}>
        <div className='pl-consultant-card__row-label' />
        <div className='pl-consultant-card__row-avatar'
          style={{ backgroundImage: `url(${consultant.profile.photo})` }}
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
}

ConsultantCard.propTypes = {
  userId: React.PropTypes.string.isRequired
}

function mapStateToProps (state, { userId }) {
  const consultant = state.users.data[userId]
  return {
    consultant
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

const ConnectedConsultantCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsultantCard)

export default ConnectedConsultantCard
