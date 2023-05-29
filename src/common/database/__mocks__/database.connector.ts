const querybuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  avg: jest.fn().mockReturnThis(),
  countDistinct: jest.fn().mockReturnThis(),
  distinct: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  raw: jest.fn().mockReturnThis(),
  as: jest.fn().mockReturnThis(),
  whereIn: jest.fn().mockReturnThis(),
  whereNotIn: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  sum: jest.fn().mockReturnThis(),
}

export const mockDatabaseConnector = {
  getConnection: jest.fn(() => querybuilder),
}
