#!/bin/sh

# This script is used to initialize the environment for the flipt-basic docker-compose project.

set -e

# Import state from YAML via `flipt import --stdin`
# it's ok if this fails because it means the state has already been imported

cat <<EOF | ./flipt import --stdin
flags:
- key: chat-enabled
  name: Chat Enabled
  description: Enable chat for all users
  enabled: false
EOF
