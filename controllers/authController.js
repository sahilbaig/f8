import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export function login(req, res) {
    // Example data
    const data = {
        "message": "heelo"
    }

    console.log(req.body)
    res.json(data);
}

export function logout(req, res) {
    const data = {
        "message": "Logout successful"
    }

    res.json(data);

}