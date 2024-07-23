import si from 'systeminformation';
import { format } from 'date-fns';

// Convert bytes to kilobytes
const bytesToKB = (bytes) => bytes / 1024;

export async function incoming(req, res) {
    try {
        // Get network stats
        const networkStats = await si.networkStats();

        // Assuming you want the stats for the first network interface
        const interfaceStats = networkStats[0];

        // Extract incoming bytes and convert to KB
        const incomingBytes = parseFloat(interfaceStats.rx_bytes);
        const incomingKB = bytesToKB(incomingBytes);

        // Get the current timestamp
        const newLabel = format(new Date(), 'HH:mm:ss');

        // Return the incoming KB as JSON
        res.json({
            newDataPoint: incomingKB,
            newLabel: newLabel
        });
    } catch (error) {
        console.error('Error fetching network stats:', error);
        res.status(500).json({ error: 'Failed to fetch network stats' });
    }
}

export async function outgoing(req, res) {
    try {
        // Get network stats
        const networkStats = await si.networkStats();

        // Assuming you want the stats for the first network interface
        const interfaceStats = networkStats[0];

        // Extract outgoing bytes and convert to KB
        const outgoingBytes = parseFloat(interfaceStats.tx_bytes);
        const outgoingKB = bytesToKB(outgoingBytes);

        // Get the current timestamp
        const newLabel = format(new Date(), 'HH:mm:ss');

        // Return the outgoing KB as JSON
        res.json({  
            newDataPoint: outgoingKB,
            newLabel: newLabel
        });
    } catch (error) {
        console.error('Error fetching network stats:', error);
        res.status(500).json({ error: 'Failed to fetch network stats' });
    }
}