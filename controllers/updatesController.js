import { exec } from 'child_process';
function extractUpgradeInfo(data) {
    const lines = data.trim().split("\n");
    const upgrades = [];

    lines.forEach(line => {
        const serviceName = line.split('/')[0].trim();
        const start = line.indexOf('[upgradable from:');

        if (start !== -1) {
            const versionInfo = line.slice(start + '[upgradable from: '.length);
            const upgradableFrom = versionInfo.split(']')[0].trim();

            upgrades.push({
                service_name: serviceName,
                upgradable_from: upgradableFrom
            });
        }
    });

    return upgrades;
}

export function listUpdates(req, res) {
    exec('apt list --upgradable', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${stderr}`);
            return res.status(500).json({ error: 'Failed to list updates' });
        }
        const updates = extractUpgradeInfo(stdout);
        res.json({ updates });
    });
}


export function updateAll(req, res) {
    // this needs to be completed
    res.json({
        status: "success"
    })
}