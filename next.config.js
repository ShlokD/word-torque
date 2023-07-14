const withPreact = require("next-plugin-preact");

const nextConfig = withPreact({
  output: "standalone",
  experimental: {
    esmExternals: false,
  },
});

module.exports = nextConfig;
