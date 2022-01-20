const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureNotAuthenticated } = require('../middlewares/authorizations')

const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const strongPasswordOptions = { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false }

const User = require('../models/User');

router.get('/user', async (req, res) => {
	const token = req.cookies['jwt'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.send(null);
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
		const user = await User.findOne({
			where: {
				id: payload.userId
			}
		})
		return res.send({
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email
		});
    } catch (e) {
        return res.send(null);
    }
})

router.get('/logout', ensureAuthenticated, (req, res) => {
	res.clearCookie('jwt');
	return res.sendStatus(200);
})

router.post('/login', ensureNotAuthenticated, async (req, res) => {
	// get user data from body
	const data = {
		email: req.body.email,
		password: req.body.password
	}
    if (!data.email || !data.password) return res.status(400).send("Invalid input.")
	
	try {
		// find user in db
		const user = await User.findOne({
			where: {
				email: data.email
			}
		})
		if (!user) return res.status(404).send("Email or password are incorrect.");

		// compare the hashed passwords
		if (await bcrypt.compare(data.password, user.dataValues.password)){
			// create an access token with the userId as the payload
			let accessToken = jwt.sign(
				{ userId: user.dataValues.id },
				process.env.JWT_ACCESS_TOKEN_SECRET,
				{ expiresIn: '5h' }
			);
			// set the token as a cookie
			res.cookie("jwt", accessToken, {
				secure: false,
				httpOnly: true,
				sameSite: 'Strict',
				maxAge: 1000 * 60 * 60 * 5 // 5H
			})
			return res.send('Check the cookies for the token.');
		}

		// passwords are diffrent
		return res.status(401).send("Email or password are incorrect.");
	} catch (err){
		console.error(err)
		return res.sendStatus(500);
	}
});

router.post('/register', ensureNotAuthenticated, async (req, res) => {
	// get user data from body
	const userData = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
		confirm_password: req.body.confirm_password
	}

	// some data validations
	if (userData.first_name.length < 2 ||
		userData.last_name.length < 2 ||
		!validator.isEmail(userData.email) ||
		!validator.isStrongPassword(userData.password, strongPasswordOptions) ||
		userData.password !== userData.confirm_password){
			
		return res.status(400).send(`The data is not valid. Make sure that: 
			1) First and last name are at least 2 characters long.\n
			2) Email address is correct.\n
			3) Password is strong.\n
			4) Confirmed password matches the password.
		`)
    }
	delete userData.confirm_password;

	
	try{
		// search for an existing account associated with this email
		const user = await User.findOne({
			where: {
				email: userData.email
			}
		})
		if (user) return res.status(409).send('An account is already associated with this email address.')
		
		// hash password
		const salt = await bcrypt.genSalt(10);
		userData.password = await bcrypt.hash(userData.password, salt);

		// insert user in db
		await User.create(userData);

		return res.send('Account created successfully.')
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
})

router.post('/update', ensureAuthenticated, async (req, res) => {
	const first_name = req.body.first_name;
	const last_name = req.body.last_name;
	if (!first_name || !last_name || first_name.length < 2 || last_name.length < 2) return res.sendStatus(400);

	try {
		await User.update(
			{
				first_name: first_name, 
				last_name: last_name
			},
			{
				where: {
					id: req.userId
				}
			}
		)
		return res.sendStatus(200);
	} catch (error) {
		console.error(error);
		return res.sendStatus(500);
	}
})

router.delete('/delete', ensureAuthenticated, async (req, res) => {
	res.clearCookie('jwt');
	try {
		await User.destroy({
			where: {
				id: req.userId
			}
		})
		return res.sendStatus(200);
	} catch (error) {
		console.error(error);
		return res.sendStatus(500);
	}
})

module.exports = router;
