function parseDashboardData(data) {
    // Split the data into lines
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const converted = {};
    const position = [];
    const key = [];

    // Identify section headers and their positions
    lines.forEach((line, i) => {
        if (line.startsWith('[') && line.endsWith(']')) {
            key.push(line);
            position.push(i);
        }
    });
    position.push(lines.length);

    // Extract key-value pairs for each section
    for (let i = 0; i < position.length - 1; i++) {
        const dictNew = {};
        for (let j = position[i] + 1; j < position[i + 1]; j++) {
            if (lines[j] !== '') {
                const [key, value] = lines[j].split('=').map(part => part.trim());
                dictNew[key] = value;
            }
        }
        converted[key[i]] = dictNew;
    }

    // Extract and format data for each section
    const generalData = {};
    const packageData = {};
    const physicalMachineData = {};

    if (converted['[ General ]']) {
        Object.entries(converted['[ General ]']).forEach(([k, v]) => {
            generalData[k] = v;
        });
    }

    if (converted['[ Physical Machine/Cluster Groups ]']) {
        Object.entries(converted['[ Physical Machine/Cluster Groups ]']).forEach(([k, v]) => {
            k = k.trim();
            if (k.startsWith('-')) {
                k = k.substring(1).trim();
            }
            physicalMachineData[k] = v;
        });
    }

    if (converted['[ Package ]']) {
        Object.entries(converted['[ Package ]']).forEach(([k, v]) => {
            packageData[k] = v;
        });
    }

    return {
        General: generalData,
        Package: packageData,
        'Physical Machine/Cluster Groups': physicalMachineData
    };
}

// Example usage in a controller
import { exec } from 'child_process';

export function mettalicDashboard(req, res) {
    const scriptPath = '/opt/F8Tech/backend/scripts/metallic/status.sh';

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).json({ error: 'Failed to execute script' });
        }

        if (stderr) {
            console.error(`Script error: ${stderr}`);
            return res.status(500).json({ error: 'Error in script execution' });
        }

        const parsedData = parseDashboardData(stdout);
        res.json(parsedData);
    });
}

import fs from 'fs';
import path from 'path';

const parseLogData = (data) => {
    const lines = data.split('\n');
    return lines.map(line => {
        const [timestamp, message] = line.split(' - ');
        return { timestamp, message };
    });
};


// Helper function to parse dashboard status data
export function metallicLogs(req, res) {
    const statusScriptPath = '/opt/F8Tech/backend/scripts/metallic/status.sh';
    const logScriptPath = '/opt/F8Tech/backend/scripts/metallic/logs.sh';

    // Execute the status script to get the log directory path
    exec(`bash ${statusScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing status script: ${error}`);
            return res.status(500).json({ error: 'Failed to execute status script' });
        }

        if (stderr) {
            console.error(`Status script error: ${stderr}`);
            return res.status(500).json({ error: 'Error in status script execution' });
        }

        // Parse the output to get the log directory path
        const parsedData = parseDashboardData(stdout);
        const logsPath = parsedData.General["Log Directory"];
        const logFilePath = path.join(logsPath, 'cvlaunchd.log');

        // Run the LOG.sh script to read the log file
        exec(`sudo bash ${logScriptPath} ${logFilePath} 10`, (err, logData, logStderr) => { // Adjust the size argument as needed
            if (err) {
                console.error(`Error executing LOG.sh script: ${err}`);
                return res.status(500).json({ error: 'Failed to execute LOG.sh script' });
            }

            if (logStderr) {
                console.error(`LOG.sh script error: ${logStderr}`);
                return res.status(500).json({ error: 'Error in LOG.sh script execution' });
            }

            // Process the log data (optional)
            const parsedLogs = parseLogData(logData);

            // Send the processed log data as the response
            res.json(parsedLogs);
        });
    });
}

export function metallicServices(req, res) {
    res.json({ "metaalic": "Services" })
}



//cvd.log cvfwd.log clmgrs.log and cvlaunchd.log 