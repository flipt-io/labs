module.exports = {
  module: {
    // …
    rules: [
      // …
      {
        test: /\.mdx?$/,
        use: [
          { loader: "babel-loader", options: {} },
          {
            loader: "@mdx-js/loader",
            /** @type {import('@mdx-js/loader').Options} */
            options: {
              /* jsxImportSource: …, otherOptions… */
            },
          },
        ],
      },
    ],
  },
};
