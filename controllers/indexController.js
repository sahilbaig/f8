import os from 'os-utils';
import { format } from 'date-fns';
import * as OS from 'os';
import { exec } from 'child_process';

import InfoStructure from '../utility/infoStructure.js';
// Function to get CPU percentage
export async function cpu_percent(req, res) {
    os.cpuUsage((v) => {
        const num = v * 100; // cpuUsage returns a value between 0 and 1
        const newLabel = format(new Date(), 'HH:mm:ss');

        res.json({
            newDataPoint: num,
            newLabel: newLabel,
        });
    });
}

// Function to get hostname
export async function getHostname(req, res) {
    const hostname = OS.hostname();
    const data = {
        'primary': hostname,
        'additional': {},
    }
    res.json(data);
}
export async function getRAMInfo(req, res) {

    const data = {
        'primary': "Unable to fetch data ",
        'additional': {}
    }
    const totalMemoryBytes = OS.totalmem();
    data.primary = `${(totalMemoryBytes / (1024 ** 3)).toFixed(2)} GB`;
    res.json(data);
}

// Function to get system info
async function systemInfoGenerate() {
    const data = {
        hostname: "Data Not Available",
        processor: "Processor-Data",
        RAM: "ram",
        Time: "Time Data",
        test: ""
    };

    try {
        data.hostname = OS.hostname(); // system hostname

        // Get CPU info using lscpu
        const cpuInfo = await new Promise((resolve, reject) => {
            exec('lscpu', (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });

        const fields = ["Architecture", "Model name", "CPU max MHz"];
        const cpuDataFinal = [];

        fields.forEach(field => {
            cpuInfo.split('\n').forEach(line => {
                if (line.startsWith(field + ":")) {
                    cpuDataFinal.push(line.split(':')[1].trim());
                }
            });
        });

        data.processor = cpuDataFinal;

        // Get total memory
        const totalMemoryBytes = OS.totalmem();
        data.RAM = `${(totalMemoryBytes / (1024 ** 3)).toFixed(2)} GB`;
    } catch (error) {
        console.error("Error fetching system info:", error);
    }

    return data;
}

// Route to get system info
export async function getSystemInfo(req, res) {
    try {
        const systemInfo = await systemInfoGenerate();
        res.json(systemInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch system info' });
    }
}

import si from 'systeminformation';

export async function ramPercent(req, res) {
    try {
        // Get memory information
        const memoryData = await si.mem();

        // Convert bytes to gigabytes, round to 2 decimal places, and convert back to number
        const bytesToGB = (bytes) => parseFloat((bytes / (1024 ** 3)).toFixed(2));

        // Calculate RAM usage percentage
        const totalMemoryGB = bytesToGB(memoryData.total);
        const usedMemoryGB = bytesToGB(memoryData.used);
        const ramUsagePercentage = parseFloat(((usedMemoryGB / totalMemoryGB) * 100).toFixed(2)); // Round percentage to 2 decimal places

        // Get the current timestamp
        const newLabel = format(new Date(), 'HH:mm:ss');

        // Respond with the RAM usage data in GB
        res.json({
            newDataPoint: ramUsagePercentage,
            newLabel: newLabel,
            total: totalMemoryGB,
            used: usedMemoryGB,
        });
    } catch (error) {
        console.error('Error fetching RAM usage:', error);
        res.status(500).json({ error: 'Failed to fetch RAM usage' });
    }
}


export async function diskUsage(req, res) {
    try {
        // Get the disk IO stats using systeminformation
        const diskIo = await si.disksIO();

        // Extract read and write IO operations
        const readIO = diskIo.rIO;
        const writeIO = diskIo.wIO;

        // Calculate total disk I/O operations
        const totalIO = diskIo.tIO;


        // Ensure totalIO is not zero to avoid division by zero
        if (totalIO === 0) {
            throw new Error('Total IO is zero, cannot calculate disk usage percentage');
        }

        // Calculate disk usage percentage
        // Total I/O minus read and write I/O to get the I/O used, then compute the percentage
        const diskUsage = ((readIO + writeIO) / totalIO) * 100;

        // Round to 2 decimal points
        const diskUsageRounded = Math.round(diskUsage * 100) / 100;

        // Get the current timestamp
        const newLabel = format(new Date(), 'HH:mm:ss');

        // Respond with the disk usage data
        res.json({
            diskUsagePercentage: diskUsageRounded,
            newLabel: newLabel
        });
    } catch (error) {
        console.error('Error fetching disk usage:', error);
        res.status(500).json({ error: 'Failed to fetch disk usage' });
    }
}

import { promisify } from 'util';

// Convert exec to return a promise
const execPromise = promisify(exec);

export async function systemTime(req, res) {
    try {
        // Get the current time
        const { stdout: currentTime } = await execPromise('date +%H:%M:%S');

        // Get the timezone
        const { stdout: timezone } = await execPromise(
            "timedatectl | grep -oP '(?<=Time zone: ).*'"
        );

        // Get the current date
        const { stdout: date } = await execPromise('date +%d-%m-%Y');

        res.json({
            currentTime: currentTime.trim(),
            timezone: timezone.trim(),
            date: date.trim()
        });
    } catch (error) {
        console.error('Error fetching system time:', error);
        res.status(500).json({ error: 'Failed to fetch system time' });
    }
}

export async function getProcessorInfo(req, res) {
    try {
        // Run the `lscpu --json` command to get CPU information
        const { stdout } = await execPromise('lscpu --json');
        const lscpuData = JSON.parse(stdout);

        // Initialize variables to hold extracted information
        let architecture = null;
        let numCores = null;
        let processorName = null;
        let cpuSpeed = null;

        // Extract information from the JSON data
        lscpuData.lscpu.forEach(item => {
            if (item.field === 'Architecture:') {
                architecture = item.data;
            } else if (item.field === 'CPU(s):') {
                numCores = item.data;
            } else if (item.field === 'Model name:') {
                processorName = item.data;
            } else if (item.field === 'CPU max MHz:') {
                cpuSpeed = item.data;
            }
        });

        // Return the extracted information as JSON
        const data = {
            'primary': processorName,
            'additional': {
                speed: cpuSpeed,
                processor_name: processorName,
                num_cores: numCores
            },
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching processor info:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function systemTimezone(req, res) {
    try {
        // Run the `timedatectl list-timezones` command to get the list of timezones
        const { stdout } = await execPromise('timedatectl list-timezones');
        // Split the output into an array of timezones
        const timezones = stdout.split('\n').filter(Boolean); // Remove any empty strings

        // Return the list of timezones as JSON
        res.json({ data: timezones });
    } catch (error) {
        console.error('Error fetching timezones:', error);
        res.status(500).json({ error: error.message });
    }
}

