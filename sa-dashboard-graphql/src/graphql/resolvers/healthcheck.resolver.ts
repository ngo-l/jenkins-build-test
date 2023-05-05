import { healthCheckRepository } from '../../healthcheck/healthcheck.repository'

export const healthCheckResolver = async () => {
    const response = await healthCheckRepository.getDataBaseVersion()
    if (response.length === 0) {
        throw new Error('cannot get the version of the database')
    }
    return `Hello World, the current mysql database version=${response[0][0]['VERSION()']}`
}
