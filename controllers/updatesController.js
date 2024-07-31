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
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    exec('apt list --upgradable 2>/dev/null | grep -c upgradable', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${stderr}`);
            res.status(500).json({ error: 'Failed to get update count' });
            return;
        }

        const totalUpdates = parseInt(stdout.trim(), 10);
        let updatesLeft = totalUpdates;

        if (totalUpdates === 0) {
            res.write(`data: {"message": "System is up to date."}\n\n`);
            res.end();
            return;
        }

        const countdownInterval = setInterval(() => {
            if (updatesLeft > 0) {
                const data = JSON.stringify({
                    totalUpdates,
                    updatesLeft,
                    message: `Updates left: ${updatesLeft}`
                });
                res.write(`data: ${data}\n\n`);
                updatesLeft -= 1; // Simulating update progress
            } else {
                clearInterval(countdownInterval);
                res.write('data: {"message": "Updates successfully completed."}\n\n');
                res.end();
            }
        }, 1000);

        req.on('close', () => {
            clearInterval(countdownInterval);
            res.end();
        });
    });
}
