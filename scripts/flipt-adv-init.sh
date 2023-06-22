#!/bin/sh

# This script is used to initialize the environment for the flipt-advanced docker-compose project.

set -e

# Import state from YAML via `flipt import --stdin`
# it's ok if this fails because it means the state has already been imported

cat <<EOF | ./flipt import --stdin
flags:
- key: chat-enabled
  name: Chat Enabled
  description: Enable chat for all users
  enabled: true
- key: chat-personas
  name: chat-personas
  description: Allow our chat bot to have different personalities
  enabled: true
  variants:
  - key: default
  - key: sarcastic
  - key: liar
  rules:
  - segment: beta
    rank: 1
    distributions:
    - variant: default
      rollout: 33.34
    - variant: liar
      rollout: 33.33
    - variant: sarcastic
      rollout: 33.33
segments:
- key: beta
  name: Beta
  description: Beta users who will test our chatbot personas
  match_type: ALL_MATCH_TYPE
EOF
