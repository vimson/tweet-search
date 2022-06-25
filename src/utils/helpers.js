exports.corsOptions = () => {
  const whitelist = process.env.ALLOW_DOMAINS
    ? process.env.ALLOW_DOMAINS.split(',')
    : '*';
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback({ message: 'Cors not allowed', domain: origin });
      }
    },
  };
  return corsOptions;
};
