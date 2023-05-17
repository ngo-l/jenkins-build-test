function useRouter() {
  return {
    route: '/',
    pathname: '/testing1',
    isReady: true,
    query: { scheduledId: 1 },
    asPath: '',
    locale: 'en-US',
    locales: ['en-US'],
    defaultLocale: 'en-US',
    push: jest.fn(),
    replace: jest.fn(),
  }
}

export {
  useRouter
}
