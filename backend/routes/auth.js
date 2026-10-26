const express = require('express');
const bcrypt = require('bcryptjs');
const { getDB } = require('../db');

// MARK: Initialize authentication routes
const router = express.Router();

// MARK: Register API
// POST /api/register
// Creates a new user in PeriodicDB.users
router.post('/register', async (req, res) => {
    try {
        // Get registration information from the request
        const { firstName, lastName, login, password, email } = req.body;

        // Check for missing fields
        if (!firstName || !lastName || !login || !password || !email) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        const db = getDB();
        const users = db.collection('users');

        // Check whether username or email already exists
        const existingUser = await users.findOne({
            $or: [
                { login: login },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Username or email already exists'
            });
        }

        // Hash password before storing it
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the new user
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            login: login,
            password: hashedPassword,
            email: email,
            role: 'user'
        };

        // Insert user into MongoDB
        const result = await users.insertOne(newUser);

        // Return successful registration response
        return res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertedId.toString()
        });

    } catch (error) {
        console.error('Registration error:', error.message);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

 // MARK: Login API
 // POST /api/login
 // Authenticates an existing user
 router.post('/login', async (req, res) => {
     try {
         // Get login credentials from the request
         const { login, password } = req.body;

         // Validate required fields
         if (typeof login !== 'string' ||
             typeof password !== 'string' ||
             !login.trim() || !password) {
             return res.status(400).json({
                 error: 'Login and password are required'
             });
         }

         // Access Cody's existing users collection
         const db = getDB();
         const users = db.collection('users');

         // Find the user by username
         const user = await users.findOne({ login: login });

         // Do not reveal whether the username exists
         if (!user) {
             return res.status(401).json({
                 error: 'Invalid login or password'
             });
         }

         // Check password against the stored bcrypt hash
         // Existing plaintext test passwords are not supported
         const validPassword =
             typeof user.password === 'string' &&
             user.password.startsWith('$2') &&
             await bcrypt.compare(password, user.password);

         if (!validPassword) {
             return res.status(401).json({
                 error: 'Invalid login or password'
             });
         }

         // Return user information without the password
         return res.status(200).json({
             message: 'Login successful',
             user: {
                 id: user._id.toString(),
                 firstName: user.firstName,
                 lastName: user.lastName,
                 login: user.login,
                 email: user.email,
                 role: user.role
             }
         });

     } catch (error) {
         console.error('Login error:', error.message);

         return res.status(500).json({
             error: 'Internal server error'
         });
     }
 });

module.exports = router;
