import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  updateApplication,
  reportErrors,
} from 'actions/ApplicationActions'

const connectCitizenshipSection = (Component, {
  section, subsection, store, storeKey,
}) => {
  class ConnectedCitizenshipSection extends React.Component {
    constructor(props) {
      super(props)

      this.section = section
      this.subsection = subsection
      this.store = store
    }

    handleError = (value, arr) => {
      const { dispatch } = this.props
      const action = reportErrors(this.section, this.subsection, arr)
      dispatch(action)
      return arr
    }

    handleUpdate = (field, values) => {
      const { dispatch } = this.props
      dispatch(updateApplication(this.store, field, values))
    }

    render() {
      return (
        <Component
          onUpdate={this.handleUpdate}
          onError={this.handleError}
          {...this.props}
        />
      )
    }
  }

  ConnectedCitizenshipSection.propTypes = {
    dispatch: PropTypes.func.isRequired, // Passed in via connect (below)
  }

  const mapStateToProps = (state) => {
    const app = state.application || {}
    const citizenship = app.Citizenship || {}
    const errors = app.Errors || {}
    const completed = app.Completed || {}

    switch (storeKey) {
      case 'Status':
        return { ...citizenship.Status } || {}

      case 'Multiple':
        return { ...citizenship.Multiple } || {}

      case 'Passports':
        return { ...citizenship.Passports } || {}
      default:
        return {
          Application: app,
          Citizenship: citizenship,
          Status: citizenship.Status || {},
          Multiple: citizenship.Multiple || {},
          Passports: citizenship.Passports || {},
          Errors: errors.citizenship || [],
          Completed: completed.citizenship || [],
        }
    }
  }

  return connect(mapStateToProps)(ConnectedCitizenshipSection)
}

export default connectCitizenshipSection