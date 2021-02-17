const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const privateKey = 'youraccesstokensecret';

app.use(bodyParser.json());

const authenticateJWT = async (req, res, next) => {
    const { authorization, public_key } = req.headers;
    if (authorization) {
        await jwt.verify(authorization, `${privateKey}${public_key}`, (err, user) => {
            if (err)
                return res.status(403).send({ 'msg': 'UnAuthorized User' })
            else
                next();
        });
    } else {
        res.status(401).send({ 'msg': 'Invalid accessToken' });
    }
};

app.post('/login', async (req, res) => {
    const { public_key } = req.headers;
    if (public_key) {
        // Read username and password from request body
        const { username, password } = req.body;
        const accessToken = await jwt.sign(req.body, `${privateKey}${public_key}`);
        res.status(200).json({ username, accessToken });
    } else {
        res.status(403).json({'msg': 'Inavlid Public Key'})
    }
});

app.get('/hello', authenticateJWT, async (req, res) => {
    res.status(200).send({ 'msg': 'Welcome Back!' })
})

app.listen(3000, () => {
    console.log('Authentication service started on port 3000');
});
