'use strict'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import './ProjectPropertiesForm.scss'

import ConsultantsWidget from '../../containers/ConsultantsWidget'
import ConsultantCard from '../../containers/ConsultantCard'
import Button from '../../planner/Button'
import TextEditor from '../misc/TextEditor.jsx'
import ColorPicker from '../widgets/ColorPicker'

function ProjectPropertiesForm(props) {
  const [showConsultantsWidget, setShowConsultantsWidget] = useState(false)
  const [errors, setErrors] = useState(null)
  const [project, setProject] = useState(null)

  const onToggleProjectMember = useCallback((userId) => {
    console.log('onToggleProjectMember, userId=', userId)
    const { project: originalProject, actions } = props
    actions.toggleProjectMember(originalProject._id, userId)
  }, [props])

  const onValueChange = useCallback((section, fieldName) => {
    return (event) => {
      const updatedProject = {
        ...project,
        [fieldName]: event.target.value
      }
      setProject(updatedProject)
    }
  }, [project])

  const onSave = useCallback(() => {
    const { project: originalProject, actions } = props
    if (project) {
      Object.keys(project).forEach((x) => {
        if (originalProject[x] !== project[x]) {
          console.log('Saving', x, project[x])
          actions.updateProject(originalProject._id, x, project[x])
        }
      })
    }
  }, [project, props])

  const onSaveColor = useCallback((color) => {
    const { project: originalProject, actions } = props
    console.log('saving color:', color)
    actions.updateProject(originalProject._id, 'color', color)
  }, [props])

  const onSaveDesc = useCallback((jsonString) => {
    const { project: originalProject, actions } = props
    console.log('Saving Description.')
    actions.updateProject(originalProject._id, 'desc', jsonString)
  }, [props])

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
    const { project: originalProject } = props

    const toggle = () => {
      setShowConsultantsWidget(!showConsultantsWidget)
    }

    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Project Members</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Consultants</div>

            <Button onClick={toggle}>
              <i className='fa fa-fw fa-plus' /> Assign
            </Button>

            <div className='pl-project-properties-form__consultants-widget'>
              {showConsultantsWidget && (
                <ConsultantsWidget
                  selected={originalProject.members}
                  onSelect={onToggleProjectMember}
                  onClose={toggle}
                />
              )}
            </div>

            <div className='pl-project-properties-form__members'>
              {originalProject.members.map((x) => <ConsultantCard key={x} userId={x} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }, [showConsultantsWidget, hasError, onToggleProjectMember, props])

  const renderProjectInformationSection = useCallback(() => {
    const { project: originalProject } = props
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Project information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              defaultValue={originalProject.title}
              onChange={onValueChange('project', 'title')}
              onBlur={onSave}
            />
          {renderError('title')}
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('desc') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Description</div>
            <TextEditor
              defaultValue={originalProject.desc}
              onSave={onSaveDesc}
            />
            <div className='pl-form__help-text'>
              The why's and wherefore's. Do this, not that, etc.
            </div>
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('startDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Start Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 10:00'
              defaultValue={originalProject.startDate}
              onChange={onValueChange('project', 'startDate')}
              onBlur={onSave}
            />
            <div className='pl-form__help-text'>
              E.g. 5/1/2016 10:00am or 2016-05-01 10:00
            </div>
          {renderError('startDate')}
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('dueDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Due Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 18:00'
              defaultValue={originalProject.dueDate}
              onChange={onValueChange('project', 'dueDate')}
              onBlur={onSave}
            />
          {renderError('dueDate')}
          </div>
        </div>

        <div className='pl-form__row'>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Color</div>
            <ColorPicker selected={originalProject.color} onSelect={onSaveColor} />
          </div>
        </div>
      </div>
    )
  }, [hasError, renderError, onValueChange, onSave, onSaveDesc, onSaveColor, props])

  return (
    <section className='pl-project-properties-form'>
      {renderProjectInformationSection()}
      {renderAssigeesSection()}
    </section>
  )
}

ProjectPropertiesForm.propTypes = {
  project: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

export default ProjectPropertiesForm
