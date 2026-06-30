$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$outputsRoot = Split-Path -Parent $repoRoot
$sourceRoot = Join-Path $outputsRoot 'Doxx click'
$destinationRoot = Join-Path $repoRoot 'doxx-click\game'
$excludedNames = @(
    '.git',
    'Android',
    'platform-crazygames.js',
    'platform-yandex.js'
)

$requiredSourceFiles = @('index.html', 'game.js', 'platform-gamepix.js', 'title.webp')
foreach ($fileName in $requiredSourceFiles) {
    $sourceFile = Join-Path $sourceRoot $fileName
    if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) {
        throw "Doxx Click source file is missing: $sourceFile"
    }
}

$resolvedRepoRoot = [System.IO.Path]::GetFullPath($repoRoot).TrimEnd('\', '/')
$resolvedDestinationRoot = [System.IO.Path]::GetFullPath($destinationRoot).TrimEnd('\', '/')
$requiredDestinationPrefix = (Join-Path $resolvedRepoRoot 'doxx-click') + [System.IO.Path]::DirectorySeparatorChar
if (-not $resolvedDestinationRoot.StartsWith($requiredDestinationPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to synchronize outside the website's doxx-click directory: $resolvedDestinationRoot"
}

if (Test-Path -LiteralPath $resolvedDestinationRoot -PathType Container) {
    Get-ChildItem -LiteralPath $resolvedDestinationRoot -Force | Remove-Item -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $resolvedDestinationRoot -Force | Out-Null
}

Get-ChildItem -LiteralPath $sourceRoot -Force |
    Where-Object { $excludedNames -notcontains $_.Name } |
    ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination $destinationRoot -Recurse -Force
    }

$sourceIndex = Get-Content -LiteralPath (Join-Path $sourceRoot 'index.html') -Raw
$versionMatch = [regex]::Match(
    $sourceIndex,
    '<meta\s+name=["'']application-version["'']\s+content=["'']([^"'']+)["'']'
)
if (-not $versionMatch.Success) {
    throw 'Unable to read the Doxx Click application version from index.html.'
}
$gameVersion = $versionMatch.Groups[1].Value

$websiteLoader = @'
(function loadDoxxPlatform() {
    const version = '__DOXX_VERSION__';

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Unable to load ${src}`));
            document.head.append(script);
        });
    }

    async function initialize() {
        // Super Fast Tool uses the adapter's local-storage fallback without a portal SDK.
        await loadScript(`platform-gamepix.js?v=${version}`);

        try {
            await window.DoxxPlatform?.ready;
        } catch (error) {
            console.warn('Platform initialization failed. Starting with local storage.', error);
        }
        await loadScript(`game.js?v=${version}`);
        await window.DoxxPlatform?.loaded?.();
    }

    initialize().catch(error => {
        console.error('Doxx Click failed to initialize.', error);
    });
})();
'@
$websiteLoader = $websiteLoader.Replace('__DOXX_VERSION__', $gameVersion)

Set-Content -LiteralPath (Join-Path $destinationRoot 'platform-loader.js') -Value $websiteLoader -Encoding UTF8

$requiredDestinationFiles = @('index.html', 'game.js', 'platform-gamepix.js', 'platform-loader.js', 'title.webp')
foreach ($fileName in $requiredDestinationFiles) {
    $destinationFile = Join-Path $destinationRoot $fileName
    if (-not (Test-Path -LiteralPath $destinationFile -PathType Leaf)) {
        throw "Doxx Click website file is missing after sync: $destinationFile"
    }
}

Write-Host "Doxx Click $gameVersion synced to $destinationRoot"
