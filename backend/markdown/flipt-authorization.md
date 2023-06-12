---
title: Authentication
description: This document describes how to configure Flipt's authentication mechanisms.
---

<Warning>
Once authentication has been set to `required: true` all API routes will require a client token to be present.

The UI will require a session-compatible authentication method (e.g. [OIDC](#method-oidc)) to be enabled.

</Warning>

Flipt supports the ability to secure its core API routes by setting the `required` field to `true` on the `authentication` configuration object.

```yaml config.yaml
authentication:
  required: true
```

When authentication is set to `required`, the API will ensure valid credentials are present on all API requests.

See the [Authentication: Overview](/authentication/overview) documentation for more details on Flipt's API authentication handling.

## Session

This section contains common properties for establishing browser sessions via a "session compatible" authentication method. Session-compatible methods enable support for login in the UI. The methods below state whether or not they are session compatible (e.g. [OIDC](#method-oidc) is session compatible).

In order to establish a browser session over HTTP (via a `Cookie` header) some configuration is required.

```yaml config.yaml
authentication:
  session:
    domain: "flipt.yourorg.com"
    secure: true
    csrf:
      key: "some_secret_string"
```

When a "session compatible" authentication method is enabled the `domain` property is **required**.
It should be configured with the public domain your Flipt instance is hosted on.
The other properties are not required to be explicitly configured.

To best secure your instance of Flipt, we advise that you run Flipt with `secure: true`.
This will require you to expose Flipt over HTTPS.
Additionally, we advise that you configure a `csrf.key` with a 32 or 64-byte random string of data.

<Card title="Using openssl to generate a 64-byte CSRF key" icon="lightbulb">

```
openssl rand -base64 64
```

</Card>

## Methods

Each key within the `methods` section is a particular authentication method.
These methods are disabled (`enabled: false`) by default.
Enabling and configuring a method allows for different ways to establish client token credentials within Flipt.

### Method: Static Token

The `token` method provides the ability to create client tokens statically, with optional expiry constraints.

```yaml config.yaml
authentication:
  methods:
    token:
      enabled: true
      bootstrap:
        expiration: 24h
```

Once enabled, static tokens can be created via the [CreateToken](/reference/authentication/create-token) operation in the API.

Further explanation for using this method can be found in the [Authentication: Static Token](/authentication/methods#static-token) documentation.

### Method: OIDC

<Note>This is a `session compatible` authentication method.</Note>

The `oidc` method provides the ability to establish client tokens via OAuth 2.0 with OIDC flow.
Once enabled and configured properly, the UI will automatically leverage it and present any configured providers as login options.

```yaml config.yaml
authentication:
  methods:
    oidc:
      enabled: true
      providers:
        some_provider: # insert your provider name here
          issuer_url: "https://some.oidc.issuer.com"
          client_id: "some_client_identifier"
          client_secret: "some_client_secret_credential"
          redirect_address: "https://your.flipt.instance.url.com"
          scopes:
            - email
            - profile
```

Multiple providers can be configured simultaneously.
Each will result in a Login option being presented in the UI, along with a separate endpoint being added in the API to support each provider flow.

!["OIDC Login"](../images/configuration/oidc_login.png)

Flipt has been tested with each of the following providers:

- [Google](https://developers.google.com/identity/openid-connect/openid-connect)
- [Auth0](https://auth0.com/docs/get-started/applications/application-settings)
- [GitLab](https://docs.gitlab.com/ee/integration/openid_connect_provider.html)
- [Dex](https://dexidp.io/docs/openid-connect/)
- [Okta](https://developer.okta.com/docs/concepts/oauth-openid/#oauth-2-0)

Though the intention is that it should work with other OIDC providers, these are just the handful the Flipt team has validated.

Following any of the links above should take you to the relevant documentation for each of these providers' OIDC client setups.
You can use the credentials and client configuration obtained using those steps as configuration for your Flipt instance.

#### Callback URL

When configuring your OIDC provider, you will need to provide a callback URL for the provider to redirect back to Flipt after a successful login.

The callback URL will be in the form of `https://your.flipt.instance.url.com/auth/v1/method/oidc/{provider}/callback`.

You can find the callback URL for each provider that you configure in your Flipt instance by querying the API.

```bash
curl --request GET \
  --url https://your.flipt.instance.url.com/auth/v1/method \
  --header 'Accept: application/json'
```

```json
{
  "methods": [
    {
      "method": "METHOD_TOKEN",
      "enabled": true,
      "sessionCompatible": false,
      "metadata": null
    },
    {
      "method": "METHOD_OIDC",
      "enabled": true,
      "sessionCompatible": true,
      "metadata": {
        "providers": {
          "google": {
            "authorize_url": "/auth/v1/method/oidc/google/authorize",
            "callback_url": "/auth/v1/method/oidc/google/callback"
          }
        }
      }
    }
  ]
}
```

#### Example: OIDC with Google

Given we're running our instance of Flipt on the public internet at `https://flipt.myorg.com`.

Using Google as an example and the documentation linked above, we obtained the following credentials for a Google OAuth client:

```yaml
client_id: "CyJcdvQMadOjSEx7ArArom0ytrbIHWd2Fb3N59oh8NQ="
client_secret: "WGgJmfQqN7cf17dFyZKXDL5S445/qhp+hfDAC0Mnl7oBrxgdAgiMyuwCkPiwfgQy"
```

We could create a provider definition in our configuration like so:

```yaml config.yaml
authentication:
  methods:
    oidc:
      enabled: true
      providers:
        google:
          issuer_url: "https://accounts.google.com"
          client_id: "CyJcdvQMadOjSEx7ArArom0ytrbIHWd2Fb3N59oh8NQ="
          client_secret: "WGgJmfQqN7cf17dFyZKXDL5S445/qhp+hfDAC0Mnl7oBrxgdAgiMyuwCkPiwfgQy"
          redirect_address: "https://flipt.myorg.com"
          scopes:
            - email
            - profile
```

<Note>
  The callback URL for this provider would be
  `https://flipt.myorg.com/auth/v1/method/oidc/google/callback`.
</Note>

Additional `scopes` such as `profile` are not 100% necessary, however, adding
them will result in Flipt being able to identify more details about your users
such as personalized greeting messages and user profile pictures in the UI.

Once this configuration has been enabled a `Login with Google` option will be presented in the UI.
Clicking this button will navigate the user to a Google consent screen.
Once the user has authenticated with Google, they will be redirected to the address defined in the `redirect_address` section of the provider configuration.

<Tip>
Google's consent screen can be configured to only accept accounts that are within your Google Workspace organization.

Other providers have similar mechanisms for attenuating who can leverage this authentication flow.

</Tip>

### Method: Kubernetes

The `kubernetes` method provides the ability to exchange Kubernetes service account tokens for client tokens.

```yaml config.yaml
authentication:
  methods:
    kubernetes:
      enabled: true
      discovery_url: https://kubernetes.default.svc.cluster.local
      ca_path: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      service_account_token_path: /var/run/secrets/kubernetes.io/serviceaccount/token
```

Once enabled, client tokens can be retrieved by sending a Kubernetes pod's service account token to the [VerifyServiceAccount](/reference/authentication/kubernetes-verify-service-account) operation in the API.

Further explanation for using this method can be found in the [Authentication: Kubernetes](/authentication/methods#kubernetes) documentation.

### Common Properties: Cleanup

Each authentication method contains a nested `cleanup` configuration object.
This object configures the periodic deletion of _expired_ authentications created with the associated method.

```yaml config.yaml
authentication:
  <method>:
    cleanup:
      interval: 10m
      grace_period: 24h
```

The cleanup object currently contains two keys `interval` and `grace_period`.
The `interval` is used to configure how frequently a delete _expired_ tokens action is performed.
Whereas, `grace_period` is used to ensure that _expired_ tokens are preserved for at least this configured duration.

This allows you to keep authentications around for auditing purposes after expiration.
Expired tokens are instances where the `expires_at` timestamp occurs before the current time.
The grace period is added onto this timestamp as a predicate when the delete operation is made.

Tokens that have expired (`expires_at` is before `now()`) will begin immediately failing authentication when presented as a credential to the API.
The `grace_period` is simply for the cleanup process.

## Reverse Proxy

It is possible to secure Flipt simply by running it behind a reverse proxy in your own trusted environment.
An example of this can be found in the core Flipt repository [here](https://github.com/flipt-io/flipt/tree/main/examples/auth).
