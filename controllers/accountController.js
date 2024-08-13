import { exec } from 'child_process';

export function getAccounts(req, res) {
    const scriptPath = '/opt/F8Tech/backend/scripts/accounts/list-users.sh';

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).json({ error: 'Failed to retrieve accounts' });
        }

        if (stderr) {
            console.error(`Script error: ${stderr}`);
            return res.status(500).json({ error: 'Error in script execution' });
        }

        try {
            const accounts = JSON.parse(stdout.trim());
            res.json(accounts);
        } catch (parseError) {
            console.error(`Error parsing script output: ${parseError}`);
            res.status(500).json({ error: 'Failed to parse account data' });
        }
    });
}

export function addUser(req, res) {
    const { username, password } = req.body;
    const scriptPath = '/opt/F8Tech/backend/scripts/accounts/useradd.sh';

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }



    exec(`sudo bash ${scriptPath} ${username} ${password}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).json({ error: 'Failed to add user' });
        }

        if (stderr) {
            console.error(`Script error: ${stderr}`);
            return res.status(500).json({ error: 'Error in script execution' });
        }

        res.json({ username, message: 'User added successfully' });
    });
}

export function deleteUser(req, res) {
    const { username } = req.body;
    console.log(req.body)
    const scriptPath = '/opt/F8Tech/backend/scripts/accounts/delete-user.sh';

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    exec(`sudo bash ${scriptPath} ${username} true`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (stderr) {
            console.error(`Script error: ${stderr}`);
            return res.status(500).json({ error: 'Error in script execution' });
        }

        res.json({ message: 'User deleted successfully' });
    });


}

export function changePassword(req, res) {
    const { username, password } = req.body;
    const scriptPath = '/opt/F8Tech/backend/scripts/accounts/change-password.sh';

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    exec(`sudo bash ${scriptPath} ${username} ${password}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).json({ error: 'Failed to change password' });
        }

        if (stderr) {
            console.error(`Script error: ${stderr}`);
            return res.status(500).json({ error: 'Error in script execution' });
        }

        res.json({ username, message: 'Password changed successfully' });
    });
}

export function editAdminStatus(req, res) {
    const dataReceived = req.body;
    const username = dataReceived.name;

    // Construct the command to run the convert-to-admin script
    const command = `/opt/F8Tech/backend/scripts/accounts/convert-to-admin.sh sudo ${username}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).json({ error: 'Failed to update admin status' });
        }

        console.log(`Script output: ${stdout}`);
        res.json(dataReceived);
    });
}