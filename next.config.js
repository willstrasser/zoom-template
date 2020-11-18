module.exports = {
  async redirects() {
    return [
      {
        source: '/zoom',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
