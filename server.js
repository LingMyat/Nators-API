const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app  = require('./app')

app.listen(process.env.PORT, () => {
    console.log(`Server started on 127.0.0.1:${process.env.PORT}`);
});