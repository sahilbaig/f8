import { spawn, exec } from 'child_process';

export function terminal(req, res) {
    const port = process.env.TERMINAL_PORT || 7681; // Default to 7681 if TERMINAL_PORT is not set

    if (!port) {
        return res.status(500).json({ error: 'TERMINAL_PORT environment variable is not set' });
    }

    // Check if the port is in use
    exec(`lsof -t -i :${port}`, (error, stdout, stderr) => {
        if (error && error.code !== 1) {  // error.code 1 means no process is using the port
            console.error(`Error checking port: ${error}`);
            return res.status(500).json({ error: 'Failed to check port usage' });
        }

        if (stdout) {
            const pid = stdout.trim();
            console.log(`Port ${port} is currently in use by process with PID: ${pid}. Killing it...`);

            // Kill the process using the port
            exec(`kill -9 ${pid}`, (killError) => {
                if (killError) {
                    console.error(`Failed to kill process with PID ${pid}: ${killError}`);
                    return res.status(500).json({ error: `Failed to kill process on port ${port}` });
                }

                console.log(`Successfully killed process ${pid} on port ${port}.`);

                // After killing the process, start the ttyd process
                startTtydProcess(port, res);
            });

        } else {
            // If the port is free, start the ttyd process
            startTtydProcess(port, res);
        }
    });
}

function startTtydProcess(port, res) {
    try {
        const ttydProcess = spawn('ttyd', ['-p', port.toString(), '--writable', 'bash'], {
            detached: true, // Run the process independently
            stdio: 'ignore' // Ignore stdio to avoid blocking
        });

        ttydProcess.unref(); // Ensure the process continues running independently

        console.log("ttyd process started successfully");

        // Return the URL to the client
        const ttydURL = `http://localhost:${port}/`;
        res.json({ url: ttydURL });

    } catch (spawnError) {
        console.error(`Failed to start ttyd process: ${spawnError}`);
        return res.status(500).json({ error: 'Failed to start ttyd process' });
    }
}
