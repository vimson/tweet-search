exports.validRestTokens = () => {
  const restTokens = process.env.REST_API_Token
    ? process.env.REST_API_Token.split(',')
    : [];

  return restTokens;
};
