import { faker } from "@faker-js/faker"

const initFaker = () => {
    faker.seed(42)
    return faker
}

export const fakerClient = initFaker()
