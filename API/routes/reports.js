const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');
const { generateFakeReports } = require('../utils/fakeData');

const router = express.Router();

router.get('/', verifyToken, requireRole(), (req, res) => {
    const reports = generateFakeReports();
    res.json(reports);
});

module.exports = router;
