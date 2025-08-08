using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using WebApp;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>(App.RootElement);
builder.RootComponents.Add<HeadOutlet>(App.HeadElement);

await builder.Build().RunAsync();