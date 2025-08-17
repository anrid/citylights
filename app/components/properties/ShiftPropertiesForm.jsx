'use strict'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'

import './ShiftPropertiesForm.scss'

import ConsultantsWidget from '../../containers/ConsultantsWidget'
import ConsultantCard from '../../containers/ConsultantCard'
import Button from '../../planner/Button'
import ColorPicker from '../widgets/ColorPicker'

function ShiftPropertiesForm(props) {
  const [showConsultantsWidget, setShowConsultantsWidget] = useState(false)
  const [errors, setErrors] = useState(null)
  const [shift, setShift] = useState(null)

  const onDelete = useCallback(() => {
    const { shift: originalShift, actions } = props
    actions.setPropertiesPanelOpen(false)
    actions.removeShift(originalShift._id)
  }, [props])

  const onSaveColor = useCallback((color) => {
    const { shift: originalShift, actions } = props
    console.log('saving color:', color)
    actions.updateShift(originalShift._id, 'color', color)
  }, [props])

  const onAssignConsultant = useCallback((userId) => {
    console.log('onAssignConsultant, userId=', userId)
    const { shift: originalShift, actions } = props
    actions.assignConsultant(originalShift._id, userId)
  }, [props])

  const onValueChange = useCallback((section, fieldName) => {
    return (event) => {
      const updatedShift = {
        ...shift,
        [fieldName]: event.target.value
      }
      setShift(updatedShift)
    }
  }, [shift])

  const onSave = useCallback(() => {
    const { shift: originalShift, actions } = props
    if (shift) {
      Object.keys(shift).forEach((x) => {
        if (originalShift[x] !== shift[x]) {
          console.log('Saving', x, shift[x])
          actions.updateShift(originalShift._id, x, shift[x])
        }
      })
    }
  }, [shift, props])

  const hasError = useCallback((name) => {
    return errors && errors[name]
  }, [errors])

  const renderError = useCallback((name) => {
    if (!errors || !errors[name]) {
      return null
    }
    return (
      <div className='pl-form__error-text'>
        {errors[name]}
      </div>
    )
  }, [errors])

  const renderAssigeesSection = useCallback(() => {
    const { shift: originalShift } = props

    const toggle = () => {
      setShowConsultantsWidget(!showConsultantsWidget)
    }

    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Assignees</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Consultants</div>
            <Button onClick={toggle}>
              <i className='fa fa-fw fa-plus' />Assign
            </Button>
            <div className='pl-shift-properties-form__consultants-widget'>
              {showConsultantsWidget && (
                <ConsultantsWidget
                  selected={[originalShift.assignee]}
                  onSelect={onAssignConsultant}
                  onClose={toggle}
                />
              )}
            </div>
            <div className='pl-shift-properties-form__assignees'>
              <ConsultantCard userId={originalShift.assignee} />
            </div>
          </div>
        </div>
      </div>
    )
  }, [showConsultantsWidget, hasError, onAssignConsultant, props])

  const renderMiscSection = useCallback(() => {
    return (
      <div className='pl-form__section'>
        <div className='pl-form__row'>
          <div className='pl-form__section-label'>Delete Shift</div>
          <div className='pl-form__input'>
            <Button onClick={onDelete}>
              <i className='fa fa-fw fa-plus' />Delete Shift
            </Button>
            <div className='pl-form__help-text'>
              Deleting the shift will automatically unassign all
              consultants.
              NOTE: This action <em>can be undone</em>,
              you can browse deleted items in the trash.
            </div>
          </div>
        </div>
      </div>
    )
  }, [onDelete])

  const renderShiftInformationSection = useCallback(() => {
    const { shift: originalShift } = props
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Shift information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              defaultValue={originalShift.title}
              onChange={onValueChange('shift', 'title')}
              onBlur={onSave}
            />
          {renderError('title')}
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('startDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Start Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 10:00'
              defaultValue={Moment(originalShift.startDate).format('YYYY-MM-DD HH:mm')}
              onChange={onValueChange('shift', 'startDate')}
              onBlur={onSave}
            />
            <div className='pl-form__help-text'>
              Date and time formats are flexible,
              e.g. both 5/1/2016 10:00am and 2016-05-01 10:00:00
              represent the May 1st 2016 at 10:00 am.
            </div>
          {renderError('startDate')}
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('endDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>End Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 18:00'
              defaultValue={Moment(originalShift.endDate).format('YYYY-MM-DD HH:mm')}
              onChange={onValueChange('shift', 'endDate')}
              onBlur={onSave}
            />
          {renderError('endDate')}
          </div>
        </div>

        <div className='pl-form__row'>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Color</div>
            <ColorPicker selected={originalShift.color} onSelect={onSaveColor} />
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('rateHour') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Hourly Rate (US dollars)</div>
            <input type='text'
              placeholder='e.g. 29.95'
              defaultValue={originalShift.rateHour}
              onChange={onValueChange('shift', 'rateHour')}
              onBlur={onSave}
            />
            <div className='pl-form__help-text'>
              The hourly rate in USD.
            </div>
          {renderError('rateHour')}
          </div>
        </div>

      </div>
    )
  }, [hasError, renderError, onValueChange, onSave, onSaveColor, props])

  return (
    <section className='pl-shift-properties-form'>
      {renderShiftInformationSection()}
      {renderAssigeesSection()}
      {renderMiscSection()}
    </section>
  )
}

ShiftPropertiesForm.propTypes = {
  shift: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

export default ShiftPropertiesForm
