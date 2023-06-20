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
segments:
- key: admins
  name: Admins
  description: User's who can perform admin functionality
  constraints:
  - type: STRING_COMPARISON_TYPE
    property: email
    operator: suffix
    value: '@internal.biz'
  match_type: ALL_MATCH_TYPE
EOF
