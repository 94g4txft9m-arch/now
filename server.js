const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server beží');
});

app.listen(3000, () => {
  console.log('Server beží na http://localhost:3000');
});
