using Microsoft.AspNetCore.Components;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

namespace WebApp.Pages.Main;

public partial class MainPage : IDisposable
{
    [Inject] private ILogger<MainPage> Logger { get; set; } = default!;

    private SetupJsModule.JS? Module { get; set; }

    private async Task SetupJsAnimationsAsync()
    {
        if (!OperatingSystem.IsBrowser()) return;

        Module = await SetupJsModule.ImportAsync(Logger);
        Module?.Setup();
    }

    [SupportedOSPlatform("browser")]
    internal partial class SetupJsModule
    {
        private const string ModuleName = "module";
        private const string JsFilePath = "../Pages/Main/MainPage.razor.js";

        internal static async Task<JS?> ImportAsync(ILogger<MainPage> logger, CancellationToken token = default)
        {
            try
            {
                _ = await JSHost.ImportAsync(ModuleName, JsFilePath, token);
                return new JS();
            }
            catch (Exception ex)
            {
                logger.LogError("Failed to load JS module for MainPage.razor: {ex}", ex);
                return null;
            }
        }

        [JSImport(functionName: "setupScrollingAnimation", ModuleName)]
        private static partial void Setup();

        [JSImport(functionName: "teardownScrollingAnimation", ModuleName)]
        private static partial void Dispose();

        internal sealed class JS : IDisposable
        {
            internal void Setup() => SetupJsModule.Setup();

            public void Dispose() => SetupJsModule.Dispose();
        }
    }

    public void Dispose()
    {
        GC.SuppressFinalize(this);
        if (OperatingSystem.IsBrowser()) 
            Module?.Dispose();
    }
}