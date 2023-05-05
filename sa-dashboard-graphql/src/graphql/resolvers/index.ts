import { healthCheckResolver } from './healthcheck.resolver'
import { customerCountsResolver } from './customerCounts.resolver'
import { salesPerformanceMetricsDataResolver } from './salesPerformanceMetricsData.resolver'
import { clientelingPerformanceMetricsDataResolver } from './clientelingPerformanceMetricsData.resolver'

export const resolvers = {
  Query: {
    healthcheck: async () => await healthCheckResolver(),
    customerCounts: async (parent, args, contextValue, info) => await customerCountsResolver(parent, args, contextValue, info),
    salesPerformanceMetricsData: async (parent, args, contextValue, info) => await salesPerformanceMetricsDataResolver(parent, args, contextValue, info),
    clientelingPerformanceMetricsData: async (parent, args, contextValue, info) => await clientelingPerformanceMetricsDataResolver(parent, args, contextValue, info)
  }
}
