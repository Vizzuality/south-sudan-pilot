# South Sudan Pilot − Client application

## Dependencies

- Node.js (see version in [.nvmrc](https://github.com/Vizzuality/south-sudan-pilot/blob/staging/client/.nvmrc))
- [Yarn 4](https://yarnpkg.com/) (see version in [package.json](https://github.com/Vizzuality/south-sudan-pilot/blob/staging/client/package.json))

## Install & run

### Native execution

Be sure to set the required environment variables before running the application - see the Environment variables section below for more details.

To install the dependencies, use:

```
yarn
```

To run the application in development mode, use:

```
yarn dev
```

To run the application in production mode, use:

```
yarn build
yarn start
```

### Docker

This project includes 2 docker configuration files:

- [Dockerfile](https://github.com/Vizzuality/south-sudan-pilot/blob/staging/client/Dockerfile) aimed at development environments (may require tuning to work on different environments)
- [Dockerfile.prod](https://github.com/Vizzuality/south-sudan-pilot/blob/staging/client/Dockerfile.prod) aimed at production environments

You can use either file to build a Docker image for this application. Be sure to set the required environment variables when running the container.

## Environment variables

See [src/env.ts](https://github.com/Vizzuality/south-sudan-pilot/blob/staging/client/src/env.ts).
