# gcloud-discord-notify
Express application for Google Cloud Functions that converts incoming Google Cloud Monitoring webhooks into Discord suitable webhooks and sends them to a channel.

## Setup
1. Create a `env.yaml` file that looks like this:

```yaml
DISCORD_WEBHOOK_URL: <your webhook url>
```

2. Run `sh ./deploy.sh` to deploy to Google Cloud Functions