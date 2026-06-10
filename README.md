# Aarons-To-Do-App

A to-do task management app to demonstrate full stack web development.

## Application Overview

Users may register an account and log in. When logged in, users have a set of to-do tasks. Users may view, add, edit, and delete tasks.

A to-do task has the following:

- A title
- The date the task was created
- The date the task was completed, if any
- An optional due date
- An optional description

In addition to general editing, users may toggle the completion status of a task anywhere. Setting a task as complete sets its completion date to the current date.

## Development

### Tech

Front End: React \
API: ASP.NET Core \
Data: SQLite

#### API

- Entity Framework Core with SQLite, using a code-first approach.
- Identity Framework for user accounts and password management.
- JWT tokens for authentication

[Identity's API endpoints](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0#activate-identity-apis) are *not* used by the API, nor is Identity's authentication system used. Identity's API endpoints are avoided in favour of custom endpoints with more control over their interface and outputs. For example, the [Identity API `/register` endpoint](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0#use-the-post-register-endpoint) reports when an email is already in use, which this app avoids for security reasons. Identity is still used to manage the data for user accounts, and for user password validation and storage.

JWT tokens are paired with rotating refresh tokens. Users have one active refresh token at a time; refresh tokens are revoked when a new token is issued.

#### Front-end

- [Vite](https://vite.dev/): Base project tooling.
- [MUI](https://mui.com/): Standard UI components and theming.
- [TanStack Query](https://tanstack.com/query/latest): Tracking server state when using the API.
- [Axios](https://axios.rest/): REST API interactions.

### Editing and Running

The following tools were used to develop and run the project:

- [Visual Studio Code](https://code.visualstudio.com/)
- The [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for VS Code
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) to support the user of the project dev container

The project uses a [dev container](https://containers.dev/) to provide a replicable dev environment. Installing the above three tools will allow you to run the application locally.

Visual Studio Code launch configurations are provided to run the app in dev mode:

- `Debug API`: Starts the API application. Opens a Scalar page to interact with the API at the URL `http://localhost:5248/scalar`.
- `Debug Front End`: Starts the front-end application. Opens the app in Chrome at the URL `http://localhost:5173/`; other browsers may access this URL but Chrome is required for debugging in VS Code.
- `Full Stack Debug`: Starts both the API and the front-end application.

#### Reminders

When updating the model, migrate and update the database with the following commands:

```bash
# From workspace root
dotnet ef migrations add [Migration name] --project API/AaronsToDoApp.API
dotnet ef database update --project API/AaronsToDoApp.API
```

The API already has a migration, and the `dotnet ef database update` command is run automatically when the dev container is created.

## Missing features and other limitations

The app lacks ways to sort, search, or filter the user's list of tasks.

The app lacks user account management that would be in a more complete app:

- Email verification
- Password changing
- Password resetting
- 2FA login

Note that since user accounts are implemented using the Identity Framework, it would be easy to add these features in the future.

The API lacks versioning.
