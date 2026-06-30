# Doxx Click Source

The canonical game source is the sibling folder `Doxx click` under the shared
`outputs` directory. Do not edit files inside `doxx-click/game` directly.

Run the website sync manually with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync-doxx-click.ps1
```

The local Git pre-commit hook runs the same script and stages the synchronized
website copy automatically.
