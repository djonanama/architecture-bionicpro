const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: `${process.env.API_KEYCLOAK_URL}/realms/${process.env.API_KEYCLOAK_REALM}/protocol/openid-connect/certs`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Missing token' });

    const algorithm = process.env.API_KEYCLOAK_ALGORITHM || 'RS256';

    jwt.verify(token, getKey, {
        issuer: `${process.env.API_KEYCLOAK_URL}/realms/${process.env.API_KEYCLOAK_REALM}`,
        algorithms: [algorithm]
    }, (err, decoded) => {
        console.error(err, decoded);

        if (err) return res.status(401).json({ message: 'Invalid token' });

        req.user = decoded;
        next();
    });
}

function requireRole() {
    return (req, res, next) => {
        const roles = req.user?.realm_access?.roles || [];
        const role = process.env.API_REPORT_KEYCLOAK_ROLE || 'prothetic_user';

        if (roles.includes(role)) {
            return next();
        } else {
            return res.status(403).json({ message: 'Insufficient role' });
        }
    };
}

module.exports = { verifyToken, requireRole };
