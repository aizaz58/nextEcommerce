// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/v0/b/**',  // Optional: more specific pathname
        },
      ],
    },
  };
  