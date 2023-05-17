import React from 'react'

import { Elsie404Error, ElsieDefaultError } from './errors'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError({ message }) {
    return { hasError: true, message }
  }

  render() {
    const { hasError, message } = this.state

    if (hasError && message === 'Page is not existed') {
      return (
        <Elsie404Error />
      )
    }
    if (hasError) {
      return (
        <ElsieDefaultError />
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
