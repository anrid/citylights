'use strict'

import React, { Component } from 'react'

import './SideMenu.scss'

export default class SideMenu extends Component {
  render () {
    return (
      <section className='pl-side-menu'>
        <div className='pl-side-menu__group'>
          <div className='pl-side-menu__row--active'><i className='fa fa-fw fa-home' /> Overview (Home)</div>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-briefcase' /> Clients</div>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-users' /> Consultants</div>
        </div>

        <div className='pl-side-menu__divider'/>

        <div className='pl-side-menu__group'>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-comment-o' /> Discuss</div>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-cog' /> Settings</div>
        </div>

      </section>
    )
  }
}
