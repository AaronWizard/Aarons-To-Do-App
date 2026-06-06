# Aarons-To-Do-App

A to-do task management app to demonstrate full stack web development.

Users may register an account and log in. When logged in, users have a set of to-do tasks.

A to-do task has the following:

- A title
- The date the task was created
- The date the task was completed, if any
- An optional due date
- An optional description

## Development

Front End: React \
API: ASP.NET Core \
Data: SQLite

The project uses a [dev container](https://containers.dev/) to provide a replicable dev environment, and therefore needs [Docker](https://www.docker.com/) on the host development machine for development.

Development tools used:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension

When the API is running in dev mode, the Scalar interface is at `http://localhost:5248/scalar`.

### Reminders

When updating the model, migrate and update the database with the following commands:

```bash
# From workspace root
dotnet ef migrations add [Migration name] --project AaronsToDoApp.API
dotnet ef database update --project AaronsToDoApp.API
```

A migration for the API exists, and the `dotnet ef database update` command is run automatically when the dev container is created to ensure the database exists for development.
