dotnet restore AaronsToDoApp.API
dotnet tool restore
dotnet ef database update --project AaronsToDoApp.API
npm install --prefix AaronsToDoApp.FrontEnd
