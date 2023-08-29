# Chrome extension HMR advance example

- Run `npm run dev` and navigate to https://web.whatsapp.com.
- Modify the `app.js` to see the HMR.

This is an example of a Chrome extension manifest v3 that showcases real-world use. The configuration only enables HMR for the content script, and it's only activated when using webpack-dev-server. The HMR related permission is only inserted when it is enabled.

## Trouble shooting

See [troubleshooting](../../README.md#trouble-shooting)