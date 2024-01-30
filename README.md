<!-- ABOUT THE PROJECT -->

## About The Project

This is a Restful API repository for Life Notes. This Restful API is built using NestJS and PostgreSQL.

### Technology Used

- [Nest](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Cloudinary](https://cloudinary.com/)
- [Google APIs](https://github.com/googleapis/google-api-nodejs-client)
- [Nodemailer](https://nodemailer.com/about/)

## Getting Started

### Installation

- Clone this project with `https://github.com/andry-pebrianto/nibiru-digital-book-server.git`
- Install package required with `yarn`
- Setting .env

```bash
NODE_ENV=
PORT=
APP_URL=
API_URL=

DATABASE_URL=

EMAIL_FROM=
EMAIL_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIRECT_URI=
GMAIL_REFRESH_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

- Migrate database using `npx prisma migrate dev`
- Generate Prisma ORM config using `npx prisma generate`

### Executing program

- Run program with `yarn run start:dev` for development and `yarn run start:prod` for production

<!-- RELATED PROJECT -->

## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
