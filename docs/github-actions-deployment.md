# GitHub Actions Homelab Deployment

PowerCast will be deployed to the homelab using a GitHub Actions self-hosted runner.

## Why self-hosted runner?

The app is intended to run on the homelab server. A self-hosted runner allows GitHub Actions to execute deployment steps directly on that server without exposing SSH publicly.

## Branch flow

```text
feature_gpt -> Pull Request -> dev -> deploy to homelab
```

Rules:

- Do not commit directly to `dev`.
- All future changes should go through a PR.
- `dev` is the deployment branch for the homelab.
- `main` should remain stable and can be updated later from `dev`.

## Runner labels

Recommended labels for the self-hosted runner:

```text
self-hosted
linux
homelab
powercast
```

The workflow should use:

```yaml
runs-on: [self-hosted, linux, homelab, powercast]
```

## Homelab deploy path

Recommended path:

```text
/opt/stacks/powercast
```

Create it on the homelab server:

```bash
sudo mkdir -p /opt/stacks/powercast
sudo chown -R vipul-sharma:vipul-sharma /opt/stacks/powercast
```

## Deployment idea

On every push to `dev`, GitHub Actions should:

1. Check out the repository
2. Create `.env` from GitHub Secrets and Variables
3. Copy project files to `/opt/stacks/powercast`
4. Run Docker Compose
5. Keep app running on the homelab

## Initial workflow scope

The first deployment workflow will be a skeleton until the app code and Dockerfile are added.

Expected future command:

```bash
docker compose up -d --build
```

## Secrets and variables

See:

```text
docs/secrets-and-variables.md
```

## Security notes

- Do not expose the app publicly in Phase 1.
- Keep it private behind homelab/VPN access.
- Do not commit `.env`.
- Do not print secrets in GitHub Actions logs.
- Use GitHub Actions Secrets for Telegram credentials.
