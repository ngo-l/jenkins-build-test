[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=stg-elsie-admin-portal&subject=Jenkins%20staging%20Build)](http://jenkins.betalabs.ai/blue/organizations/jenkins/stg-elsie-admin-portal/activity)


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deployment

This project is built by SSG with Next js ,you can check out https://nextjs.org/docs/advanced-features/static-html-export -learn more


This project is built by SSG with Next js 



Please export project to static HTML files according to different environments:

For Staging:

```bash
yarn install --network-timeout 600000
# and
yarn build:staging
# and
 yarn export
```

For Production:

```bash
yarn install --network-timeout 600000
# and
yarn build:production
# and
 yarn export
```

Then, a group of statics files are built up and released in the `/out` folder.
Thus, delploy the `out` folder directly.

For staging:

Open https://stg-elsie-admin-portal.betalabs.ai and see the result

For productio

Open https://elsie-admin-portal.betalabs.ai and see the result

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
