'use strict'

import React from 'react'
import Moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'

import './Grid.scss'

import * as settingsActions from '../../actions/settingsActions'
import * as shiftActions from '../../actions/shiftActions'

import BasicLayout from '../BasicLayout'
import Loader from '../Loader'

function Grid() {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.data)

  const actions = {
    ...Object.keys(shiftActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(shiftActions[key](...args))
      return acc
    }, {}),
    ...Object.keys(settingsActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(settingsActions[key](...args))
      return acc
    }, {})
  }

  return (
    <BasicLayout className='pl-grid'>
      <GridBox users={users} actions={actions} />
    </BasicLayout>
  )
}

const GridBox = (props) => (
  <section className='pl-grid-box'>
    <GridFilterPanel {...props} />
    <GridDataWindow {...props} />
  </section>
)

const GridFilterPanel = ({ shifts, actions }) => {
  return (
    <section className='pl-grid-filter-panel'>
      <div className='pl-grid-header'>
        Shifts
      </div>

      <div className='pl-grid-filter-panel__search-box'>
        <div className='pl-form__input'>
          <input type='text'
            placeholder='Search'
          />
        </div>
      </div>

      <div className='pl-grid-filter-panel__filters'>
        Filters.
      </div>

      <div className='pl-grid-filter-panel__buttons'>
        <button className='pl-form-button'>
          <i className='fa fa-plus' />
          Add Shift
        </button>
      </div>
    </section>
  )
}

const GridDataWindow = (props) => (
  <section className='pl-grid-data-window'>
    <GridTopAxis {...props} />
    <GridLeftAxis {...props} />
    <GridData {...props} />
  </section>
)

const GridTopAxis = (props) => {
  return (
    <section className='pl-grid-top-axis'>
      Top.
    </section>
  )
}

const GridLeftAxis = (props) => {
  return (
    <section className='pl-grid-left-axis'>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </section>
  )
}

const GridData = (props) => {
  return (
    <section className='pl-grid-data'>
      <section className='pl-grid-data__inner'>
        Data.
      </section>
    </section>
  )
}

const GridPage = () => (
  <Loader page={Grid} />
)

export default GridPage
