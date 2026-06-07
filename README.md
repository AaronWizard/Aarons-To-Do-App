# Aarons-To-Do-App

A to-do task management app to demonstrate full stack web development.

## Application Overview

Users may register an account and log in. When logged in, users have a set of to-do tasks.

A to-do task has the following:

- A title
- The date the task was created
- The date the task was completed, if any
- An optional due date
- An optional description

### Missing Features

The app lacks user account management that would be in a more complete app:

- Email verification
- Password changing
- Password resetting
- 2FA login

Note that since user accounts implemented using the Identity Framework (see [Development](#development)), it would be easy to add these features in the future.

## Development

### Tech

Front End: React \
API: ASP.NET Core \
Data: SQLite

#### API

Entity Framework Core is used to map C# model object to the SQLite database, using a code-first approach.

User accounts, and related features such as password validation, are implemented using [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0&tabs=visual-studio). Note that [Identity's API endpoints](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0#activate-identity-apis) are *not* used by the API, nor is Identity's authentication system used. Identity's API endpoints are avoided in favour of custom endpoints with more control over their interface and outputs. For example, the [Identity API `/register` endpoint](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0#use-the-post-register-endpoint) reports when an email is already in use, which this app avoids for security reasons. Identity is still used to manage the data for user accounts, and for user password validation and storage.

Authentication is done using JWT tokens, paired with a refresh token strategy. Users have one active refresh token at a time; refresh tokens are revoked when a new token is issued.

#### Front-end

[MUI](https://mui.com/) and its Material UI is used for the base UI and theming.

### Editing and Running

The project uses a [dev container](https://containers.dev/) to provide a replicable dev environment, and therefore needs [Docker](https://www.docker.com/) on the host development machine for development.

Development was done using [Visual Studio Code](https://code.visualstudio.com/) and its [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. Other Visual Studio Code extensions are included in the dev container configuration.

Visual Studio Code launch configurations are provided to run the app in dev mode:

- `Debug API`: Starts the API application. Opens a Scalar page to interact with the API.
- `Debug Front End`: Starts the front-end application. Opens the app in Chrome.
- `Full Stack Debug`: Starts both the API and the front-end application.

When the API is running in dev mode, its Scalar interface is at `http://localhost:5248/scalar`. \
When the front-end app is running in dev mode, the app is at `http://localhost:5173/`. [Chrome](https://www.google.com/intl/en_ph/chrome/) is required for debugging the app in Visual Studio Code.

#### Reminders

When updating the model, migrate and update the database with the following commands:

```bash
# From workspace root
dotnet ef migrations add [Migration name] --project AaronsToDoApp.API
dotnet ef database update --project AaronsToDoApp.API
```

The API already has a migration, and the `dotnet ef database update` command is run automatically when the dev container is created.
