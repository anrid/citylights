'use strict'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import './Consultants.scss'

import * as settingsActions from '../../actions/settingsActions'
import { filteredConsultantsSelector } from '../../selectors/users'

import BasicLayout from '../BasicLayout'
import ConsultantList from '../../components/ConsultantList'
import ConsultantForm from '../ConsultantForm'
import Loader from '../Loader'

function Consultants() {
  const dispatch = useDispatch()
  const location = useLocation()
  
  // Redux state
  const consultants = useSelector(filteredConsultantsSelector)
  const route = location.pathname
  
  // Action creators
  const actions = {
    ...Object.keys(settingsActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(settingsActions[key](...args))
      return acc
    }, {})
  }
  
  const props = { consultants, route, actions }
  
  return (
    <BasicLayout className='pl-consultants'>
      {route === '/consultants/add' && <ConsultantForm create />}
      {route === '/consultants' && <ConsultantList {...props} />}
    </BasicLayout>
  )
}

const ConsultantsPage = () => (
  <Loader page={Consultants} />
)

export default ConsultantsPage
