import jwt from 'jsonwebtoken'

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAn0o19DKDBa9inslbmciarXo/ZdALpH3VtRjbX77BF5m/ZUkx
1B5iYhoYGD0Wz/3WtpLvPr+r5FfreqBwMbCYrUB3LH+FJ6npvqUdUCvBIncD0Mpc
gKrBzWZl5KzJALcnuZKLP5fvDKjrwHayApgDTsjLZzwyHtUXRn11DVqH2AhGVHdA
4WRiLrLcGwAlVEnkJg1dTceAPbDmSNCK63RsrVUWil3c7t98YOGDW7OcvSpA6Ms2
JrZnhSVhpoy97JZguxHNI7ZRq9yauzVsjMJZ79UT3u/9Nh4WrKoZtiiZHQya455B
16bzQc2sUkbTL3YtCEw81I3u8LGJ7V+Hdzdv6QIDAQABAoIBAA5mAuKD/lvxMpTv
1pvcCj9MIZbua17/EOZBzPKmp4WenDJnn11xMat0eGEYhItggpwWRBID+WG2oM6A
2iNjtylR/nPDQyIGtd5JxpCMo/SdlXa2FA59YO9UJjm5dKHf7HNVz8h7z1vxmP3Y
vNaHLyVb+SbnxhALawMwK/h9CnJ4h9k5i1PNBapZQJQIIhLE3wwRcQdE1nLVSslZ
1CchB/rqumwtBeodKaXUndww7TlOx+uIllBON5lC7lfYuRrEtP8mll304OXG1yXB
+V9ddbhrkbNwYipscwqNXrmWzwiZjPVmnj/3jP41e5etzGyrPvAT/FmAJPQSzNCW
UOOiW9ECgYEA9AIn/i1q7MnnpbYc9pjwp7CONkX5F1LeDeI1dpfUYBSe2Gb3RhbI
XOrElIexBLrqnTEzMz3MTZqTMyCPE/96dZL0FCbcaHCs78IGMfBjYnH7BN60bOIw
gCQyvp6WWhWufSK1nzg1CfTbWjxQK+o6PKUs4Hkl+gmDfCARzc7RYE8CgYEApx44
PzAR8NcZN4xw1WmiGl2fFV5Tm5QPnuX5ZNYUl798y+1+WmG5RbTDD6LMbbw9259f
PBYuCbC6TSv5IN+MSQYU12MKtL20NWfDk78qXx/DJmEdat6eW0lbIAUup3Wf6Dak
X0Ui3+PqdtqdHAO8Y12jO0b82kYWrhDtjasGJkcCgYAkBp14/aOnyjeVU8n67qG5
YGvev34DX4zBaACUvd3xQZoiQTGI+5whe9gCRfZwyFgTVUxF6H3dh1DsX4ZAYZvm
+AdpYkNweBJQY8keXmuOAV4aXfctjEe046NKWYfBTSox94nxNA9ApRItxHHhyfdH
NOvnSHu+6uCq1uFKDZsEKQKBgAonbed49j4Z87BKWji9WFodwiK8Pnw/fMt80bBs
yYeG3QBPB9RaB7XSi9+RVrZ8L43+mvy9pEJ2eHtj5pk2vAFb2zxTCj19IUv1aA68
GMj61xKn5++sYxbM2DqT1gfav8KOP2KCguHzqTVbhxxCpdmrwNVDNO3WQF6HLMfk
0lTVAoGBALiIYijeiCWhTr6Sf+WHeFXZhscl40twEpibShbne+dFvz5zJq11TIhg
nMFdLye21SiPnd1vSPPmUaJIZkfxno9dfZe+e9FBAhI+sgi5q1Sgmdznf5SHRPKs
cp2Q5kSBi9xydv95ZL7Tu1xtgzYnKWa8HTX5ZRbo0nDhkup7mpkU
-----END RSA PRIVATE KEY-----`;

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn0o19DKDBa9inslbmcia
rXo/ZdALpH3VtRjbX77BF5m/ZUkx1B5iYhoYGD0Wz/3WtpLvPr+r5FfreqBwMbCY
rUB3LH+FJ6npvqUdUCvBIncD0MpcgKrBzWZl5KzJALcnuZKLP5fvDKjrwHayApgD
TsjLZzwyHtUXRn11DVqH2AhGVHdA4WRiLrLcGwAlVEnkJg1dTceAPbDmSNCK63Rs
rVUWil3c7t98YOGDW7OcvSpA6Ms2JrZnhSVhpoy97JZguxHNI7ZRq9yauzVsjMJZ
79UT3u/9Nh4WrKoZtiiZHQya455B16bzQc2sUkbTL3YtCEw81I3u8LGJ7V+Hdzdv
6QIDAQAB
-----END PUBLIC KEY-----`;

export const signJWT = (payload, expiresIn) => {
	return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn })
}

export const verifyJWT = token => {
	try {
		const decoded = jwt.verify(token, publicKey)
		return { payload: decoded, expired: false }
	} catch (error) {
		return { payload: null, expired: error.message.include('jwt expired') }
	}
}
