'use strict'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import './SideMenu.scss'

import * as settingsActions from '../actions/settingsActions'
import Dropdown from '../components/widgets/Dropdown'

function SideMenu() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Redux state
  const isLoadingData = useSelector(state => state.settings.isLoadingData)
  const activeTheme = useSelector(state => state.settings.saved.activeTheme)
  const backgrounds = useSelector(state => state.settings.backgrounds)
  
  // Action creators
  const navigateTo = (route) => navigate(route)
  const saveSettings = (settings) => dispatch(settingsActions.saveSettings(settings))

  const renderThemePicker = () => {
    const background = backgrounds[activeTheme || 'BG4']

    function onSelect (item) {
      saveSettings({ activeTheme: item._id })
    }

    const availableThemes = ['BG2', 'BG3', 'BG4', 'BG5', 'BG6', 'BG7', 'BG8']
    const items = availableThemes.map((x) => {
      const bg = backgrounds[x]
      return { _id: bg._id, text: bg.title }
    })

    return (
      <Dropdown selected={background.title} onSelect={onSelect} items={items} />
    )
  }

  // NOTE: How React truly shines ...
  const renderMenuItem = (title, icon, routeName, currentRoute) => {
    let cls = 'pl-side-menu__row'
    let arrow = null
    if ((currentRoute.indexOf(routeName) === 0) ||
        (currentRoute === '/' && routeName === '/overview')) {
      cls += '--active'
      arrow = <i className='fa fa-fw fa-caret-right' />
    }

    return (
      <div className={cls} onClick={() => navigateTo(routeName)}>
        <i className={'fa fa-fw fa-' + icon} />
        <div className='pl-side-menu__row-inner'>
          <span>{title}</span>
          {arrow}
        </div>
      </div>
    )
  }

  // Get current route from React Router v6
  const currentRoute = location.pathname

  // TODO: Re-enable these later.. maybe.
  // renderMenuItem('Quick Planner', 'paper-plane-o', '/planning', currentRoute)
  // renderMenuItem('Discuss', 'comment-o', '/discuss', currentRoute)

  return (
    <section className='pl-side-menu'>
      <div className='pl-side-menu__group'>
        {renderMenuItem('Overview', 'home', '/overview', currentRoute)}
        {renderMenuItem('Consultants', 'users', '/consultants', currentRoute)}
        {renderMenuItem('Time Planner ∀', 'paper-plane-o', '/time', currentRoute)}

      </div>

      <div className='pl-side-menu__divider'/>

      <div className='pl-side-menu__group'>
        {renderMenuItem('Settings', 'cog', '/settings', currentRoute)}
        <div className='pl-side-menu__row nope'><i className='fa fa-fw fa-hand-peace-o' />
          {renderThemePicker()}
        </div>
      </div>

    </section>
  )
}

export default SideMenu
