const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const strongPasswordOptions = { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false }

const User = require('../models/User');

router.post('/login', async (req, res) => {
	// get user data from body
	const data = {
		email: req.body.email,
		password: req.body.password
	}
    if (!data.email || !data.password) return res.sendStatus(400)
	
	try {
		// find user in db
		const user = await User.findOne({
			where: {
				email: data.email
			}
		})
		if (!user) return res.send("User doesn't exist.");

		// compare the hashed passwords
		if (await bcrypt.compare(data.password, user.dataValues.password)){
			// create an access token with the userId as the payload
			let accessToken = jwt.sign(
				{ userId: user.dataValues.id },
				process.env.JWT_ACCESS_TOKEN_SECRET,
				{ expiresIn: '1h' }
			);
			// set the token as a cookie
			res.cookie("jwt", accessToken, {
				secure: false,
				httpOnly: true,
				sameSite: 'Strict',
				maxAge: 1000 * 60 * 60 // 1H
			})
			return res.send('Check the cookies for the token.');
		}

		// passwords are diffrent
		return res.send('User or password are incorrect.');
	} catch (err){
		console.error(err)
		return res.sendStatus(500);
	}
});

router.post('/register', async (req, res) => {
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
			
		return res.send(`The data is not valid. Make sure that: 
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
		if (user) return res.send('An account is already associated with this email address.')
		
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

module.exports = router;
