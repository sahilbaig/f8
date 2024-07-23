import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Controller for /service-data route
export async function serviceData(req, res) {
    try {
        const command = `systemctl list-units --type=service --no-legend | awk '{if (NR!=1) { printf $1 " " $3 " " $4 " "; for (i = 5; i <= NF; i++) printf $i " "; print "" }}'`;
        const { stdout: data } = await execPromise(command);
        const services = data.trim().split('\n');

        const runningServicesCount = await execPromise("systemctl list-units --type=service --state=running | grep '.service' | wc -l");
        const activeServicesCount = await execPromise("systemctl list-units --type=service --state=active | grep '.service' | wc -l");
        const exitedServicesCount = await execPromise("systemctl list-units --type=service --state=exited | grep '.service' | wc -l");

        const serviceList = services.map(service => {
            const parts = service.split(' ');
            const name = parts.slice(0, -2).join(' ');
            const status = parts[parts.length - 2];
            const subStatus = parts[parts.length - 1];
            return {
                name,
                status,
                subStatus
            };
        });

        const serviceListTest = services.map(service => {
            const parts = service.split(' ');
            return {
                name: parts[0],
                status: parts[1],
                running_status: parts[2],
                description: parts.slice(3).join(' ')
            };
        });

        const response = {
            services: serviceListTest,
            data: {
                running: runningServicesCount.stdout.trim(),
                active: activeServicesCount.stdout.trim(),
                exited: exitedServicesCount.stdout.trim()
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching service data:', error);
        res.status(500).json({ error: 'Failed to fetch service data' });
    }
}

// Controller for /service-list route
export async function serviceList(req, res) {
    try {
        const command = "systemctl list-unit-files --type=service --no-legend | awk '{print $1}'";
        const { stdout } = await execPromise(command);

        const serviceNames = stdout.trim().split('\n');
        res.json({ services: serviceNames });
    } catch (error) {
        console.error('Error fetching service list:', error);
        res.status(500).json({ error: 'Failed to fetch service list' });
    }
}
