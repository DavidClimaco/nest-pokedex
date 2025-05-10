<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
# Ejecutar en desarrollo
1. Clonar el repositorio
2. Ejecutar
```
pnpm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ renombrarlo a __.env__

6. Llenar las variables de entorno definidas en el __.env__

7. Ejecutar la aplicacion en dev con cualquiera de los siguientes comandos:
```
npm start:dev
pnpm start:dev
yarn start:dev
```

8. Reconstruir la base de datos
```
http://localhost:3000/api/v2/seed
```

# Production Build
1. Crear el archivo __.env.prod__
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen (si el archivo es .env no es necesario el --env-file .env.prod)
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
4. Poner en marcha la imagen cuando ya se ejecuto el comando anterior (si el archivo es .env no es necesario el --env-file .env.prod)
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```
## Stack Usado
* MongoDB
* Nest