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
