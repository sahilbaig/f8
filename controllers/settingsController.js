export function getSettings(req, res) {
    // Example data
    const settings = {
        theme: 'dark',
        notifications: true
    };
    res.json(settings);
}
