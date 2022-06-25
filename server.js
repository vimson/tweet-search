const app = require('./src/app');
const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Started server at port http://localhost:${port}`);
  console.log(` Route: GET http://localhost:${port}/tweets/:hashtag`);
});
