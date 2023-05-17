const clienteleAssignmentsResponse = {
  rows: [
    {
      id: '1', userId: 'CA_1', fileName: 'Name', status: 'pending', scheduledAt: '2000-10-31T01:30:00.000-05:00', createdBy: 'Rosalina Cheung', reviewed: true,
    },
  ],
  pagination: {
    totalItems: 100,
    currentPage: 0,
    pageSize: 10
  }
}

const axios = jest.fn()

axios.get = jest.fn(() => Promise.resolve({ data: { ...clienteleAssignmentsResponse } }));
axios.post = jest.fn(() => Promise.resolve({ data: 'Mocked data' }));
axios.put = jest.fn(() => Promise.resolve({ data: 'Mocked data' }));
axios.delete = jest.fn(() => Promise.resolve({ data: 'Mocked data' }));

export default axios
