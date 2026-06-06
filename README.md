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

The project uses a [dev container](https://containers.dev/) to provide a replicable dev environment, and therefore needs Docker for development. \
Visual Studio Code is used for development, and the dev container includes configuration for VS Code.

When the API is running in dev mode, the Scalar interface is at `http://localhost:5248/scalar`.

### Reminders

When updating the model, migrate and update the database with the following commands:

```bash
# From workspace root
dotnet ef migrations add [Migration name] --project AaronsToDoApp.API
dotnet ef database update --project AaronsToDoApp.API
```
