const app  = require('./app')

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on 127.0.0.1:${port}`);
});