import { exec } from 'child_process';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const execPromise = promisify(exec);
const JWT_SECRET = 'f8tech'; // Hardcoded JWT secret

async function authenticateUser(username, password) {
    const userDetails = {
        isAuthenticated: false,
        isAdmin: false,
        username: null,
    };

    try {
        // Check credentials
        const { stdout: checkCredentials } = await execPromise(
            `sudo python3 /opt/F8Tech/backend/scripts/auth/authenticate.py ${username} ${password}`
        );

        if (checkCredentials.trim() === "True") {
            userDetails.isAuthenticated = true;
            userDetails.username = username;
        }

        // Check if the user is an admin
        const { stdout: checkAdmin } = await execPromise(`groups ${username}`);
        if (checkAdmin.includes('sudo') || checkAdmin.includes('wheel') || checkAdmin.includes('root')) {
            userDetails.isAdmin = true;
        }
    } catch (error) {
        console.error('Error during authentication:', error);
    }

    return userDetails.isAuthenticated ? userDetails : null;
}

export async function login(req, res) {
    const { username, password } = req.body;

    // Validate the input
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Authenticate the user
    const userDetails = await authenticateUser(username, password);

    // If authentication fails
    if (!userDetails) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate JWT token
    const token = jwt.sign(userDetails, JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.json({ token });
}

export function logout(req, res) {
    console.log("logout is called");
    res.json({ success: true });
}
