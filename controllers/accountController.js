export function getAccounts(req, res) {
    // Example data
    const accounts = [
        { id: 1, name: 'Account A' },
        { id: 2, name: 'Account B' }
    ];
    console.log("hello")
    res.json(accounts);
}
