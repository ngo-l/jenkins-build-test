import { userService } from '../user.service'

describe('userService.assignUserProfilesData', () => {

  it('should not return if yammer id is undefined', async () => {
    const data = [{}]
    const output = await userService.assignUserProfilesData(data)
    expect(output).not.toContain(undefined)
    expect(output).toEqual([])
  })

  it('should return an array containing the formatted ids', async () => {
    const data = [{
      id: '123',
      email: '123@email.com',
      full_name: 'unknown',
      first_name: 'x',
      last_name: 'y',
      job_title: 'staff',
      location: 'HK',
      state: 'active',
    }]

    const mockResult = {
      YAMMER_ID: '123',
      EMAIL_ID: '123@email.com',
      USER_ROLE_ID: '1',
      FULL_NAME: 'unknown',
      FIRST_NAME: 'x',
      LAST_NAME: 'y',
      TEAM: 'staff',
      LOCATION: 'HK',
      ACTIVE: 'Y',
      APP_VERSION: '0',
    }
    const output = await userService.assignUserProfilesData(data)
    expect(output[0]).toEqual(expect.objectContaining(mockResult))
  })
})
