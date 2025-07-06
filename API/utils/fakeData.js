function generateFakeReports() {
    const reports = [];

    for (let i = 0; i < 5; i++) {
        reports.push({
            id: `report_${i + 1}`,
            patientName: `Patient ${i + 1}`,
            usageHours: Math.floor(Math.random() * 100),
            batteryLevel: `${Math.floor(Math.random() * 100)}%`,
            issues: Math.random() > 0.7 ? ['motor error', 'sensor lag'] : [],
            timestamp: new Date().toISOString()
        });
    }

    return reports;
}

module.exports = { generateFakeReports };
