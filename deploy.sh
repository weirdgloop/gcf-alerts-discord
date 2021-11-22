#!/bin/bash
gcloud functions deploy gcloud-discord-notify \
    --runtime=nodejs16 \
    --trigger-http \
    --entry-point=app \
    --env-vars-file=env.yaml \
    --timeout=10s