import { IYammerUserProfiles } from "../common/interfaces/user.interfaces"
import { userRepository } from "./user.repository"

class UserService {
  constructor() { }

  public async assignUserProfilesData(jsonArray: object[]) {
    const data = await Promise.all(jsonArray.map(async ({ id, email, full_name, first_name, last_name, job_title, location: staff_location, state }: IYammerUserProfiles) => {
      const userIsExisted = await userRepository.findOneUserById(id)
      if (userIsExisted) {
        return undefined
      }

      return {
        ...(id && { YAMMER_ID: id }),
        ...(email && { EMAIL_ID: email }),
        ...({ USER_ROLE_ID: '1' }),
        ...(full_name && { FULL_NAME: full_name }),
        ...(first_name && { FIRST_NAME: first_name }),
        ...(last_name && { LAST_NAME: last_name }),
        ...(job_title && { TEAM: job_title }),
        ...(staff_location && { LOCATION: staff_location }),
        ...(state && { ACTIVE: state === 'active' ? 'Y' : 'N', }),
        ...({ APP_VERSION: '0' }),
      }
    }))
    return data.filter(d => d != undefined)
  }
}

export const userService = new UserService()
