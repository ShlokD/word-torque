const withPreact = require("next-plugin-preact");

const nextConfig = withPreact({
  experimental: {
    esmExternals: false,
  },
});

module.exports = nextConfig;
