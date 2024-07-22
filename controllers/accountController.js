exports.getAccounts = (req, res) => {
    // Example data
    const accounts = [
        { id: 1, name: 'Account A' },
        { id: 2, name: 'Account B' }
    ];
    res.json(accounts);
};
