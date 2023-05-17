import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ElsieFileUploader } from '../'

describe('elsieFileUploader', () => {
  it('should render page without error', async () => {
    const handleSubmit = jest.fn()

    render(
      <ElsieFileUploader handleSubmit={handleSubmit} />
    )

    expect(screen.getByTestId('elsieFileUploader')).toBeInTheDocument()
    expect(screen.getByTestId('elsieFileUploaderInput')).toBeInTheDocument()
    expect(screen.getByTestId('elsieFileUploaderUploadBtn')).toBeInTheDocument()

    const file = new File(['data'], 'test.csv', { type: 'text/csv' })
    const input = screen.getByTestId('elsieFileUploaderUploadBtn').querySelector('input')
    userEvent.upload(input, file)
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith(file))
  })
})
