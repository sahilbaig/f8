import { exec } from 'child_process';
import { promisify } from 'util';

// Create a promisified version of exec
const execPromise = promisify(exec);

export const getLogs = async (req, res) => {
    try {
        // Run the journalctl command
        const { stdout } = await execPromise(
            'journalctl -n 50 -o json --output-fields=_PID,MESSAGE,_SYSTEMD_UNIT,PRIORITY,__REALTIME_TIMESTAMP,SYSLOG_IDENTIFIER'
        );

        // Split the output into lines and parse each line as JSON
        const lines = stdout.split('\n').filter(line => line.trim() !== '');
        const logsList = lines.map(line => JSON.parse(line));

        // Send the logs as JSON response
        res.json({ data: logsList });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

export const getFilteredLogs = async (req, res) => {
    try {
        const postedData = req.method === 'GET' ? req.query : req.body;
        let serviceListString = '';

        // Build service list string
        if (!postedData.services.includes('ALL')) {
            serviceListString = postedData.services.map(service => `-u ${service}`).join(' ');
        }

        // Determine boot level string
        let bootString = '';
        if (postedData.boot === '0') {
            bootString = '-b 0';
        } else if (postedData.boot === '1') {
            bootString = '-b -1';
        }

        // Determine priority string
        const priority = postedData.severity === 'ANY' ? '' : `-p ${postedData.severity}`;

        // Construct and execute the journalctl command
        const command = `journalctl ${serviceListString} ${bootString} ${priority} -n 50 -o json --output-fields=_PID,MESSAGE,_SYSTEMD_UNIT,PRIORITY,__REALTIME_TIMESTAMP,SYSLOG_IDENTIFIER`;
        const { stdout } = await execPromise(command);

        // Parse the output
        const lines = stdout.split('\n').filter(line => line.trim() !== '');
        const logsList = lines.map(line => JSON.parse(line));

        // Send the filtered logs as a JSON response
        res.json({ data: logsList });
    } catch (error) {
        console.error('Error fetching filtered logs:', error);
        res.status(500).json({ error: 'Failed to fetch filtered logs' });
    }
};