#!/bin/bash
gcloud functions deploy gcloud-discord-notify \
    --runtime=nodejs20 \
    --trigger-http \
    --entry-point=app \
    --env-vars-file=env.yaml \
    --timeout=10s
