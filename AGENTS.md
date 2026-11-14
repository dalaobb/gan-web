# Agent Notes

## Local servers and ports

- Never terminate processes you did not start.
- Never kill or restart whatever is listening on port `3000`; the user may be running `pnpm dev` there.
- Before starting a test server, check whether `http://localhost:3000` is already responding. If it is, reuse it.
- If you need your own server, use a different port (for example `3100`) and stop only that process when finished.
- Note: R2 CORS currently allows `http://localhost:3000`; model-backed tools may fail on other local ports unless the origin is added to R2 CORS.
- Clean up only the exact process you started. On Windows, Next may spawn child processes, so verify the port is free afterward.

## Commands

- Use `pnpm.cmd` in PowerShell; `pnpm.ps1` may be blocked by the execution policy.
- Verify changes with `pnpm.cmd typecheck` and `pnpm.cmd build`.
- Do not commit unless the user explicitly asks.
