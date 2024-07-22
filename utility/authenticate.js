async function authenticateUser(username, password) {
    const userDetails = {
        isAuthenticated: false,
        isAdmin: false,
        username: null,
    };

    try {
        // Check credentials
        const { stdout: checkCredentials } = await execPromise(
            `sudo python3 ${process.env.SCRIPT_PATH}/authentication/scripts/authenticate.py ${username} ${password}`
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