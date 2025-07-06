const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: `${process.env.API_KEYCLOAK_URL}/realms/${process.env.API_KEYCLOAK_REALM}/protocol/openid-connect/certs`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err || !key) {
            console.error("Error getting signing key:", err);
            return callback(err);
        }

        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    const algorithm = process.env.API_KEYCLOAK_ALGORITHM || 'RS256';

    if (!token) return res.status(401).json({ message: 'Missing token' });

    const jwtDecode = jwt.decode(token, { complete: true });
    const issuer = jwtDecode?.payload?.iss;

    jwt.verify(token, getKey, {
        issuer: issuer,
        algorithms: [algorithm]
    }, (err, decoded) => {
        console.log({ issuer });
        console.log('Decoded header:', jwtDecode);
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
