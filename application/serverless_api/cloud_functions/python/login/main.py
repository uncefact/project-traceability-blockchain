import os
import time
import bcrypt as bcrypt
from mysql.connector import connect, Error
import google.auth.crypt
import google.auth.jwt

def handler(request):
    headers = {'Access-Control-Allow-Origin': '*'}
    arguments = request.args

    if 'username' not in arguments or 'password' not in arguments:
        return "Missing 'username' or 'password' in body", 401

    if not _validate_user(arguments['username'], arguments['password']):
        return "Invalid 'username' or 'password'", 401

    return (_generate_jwt(username=arguments['username'], sa_keyfile='credentials/unece-auth-manager.json'), 200, headers)


def _validate_user(username: str, password: str) -> bool:
    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
    db_name = os.environ["DB_NAME"]
    db_host = os.environ["DB_HOST"]

    bcrypt.gensalt(rounds=10, prefix=b"2a")

    try:
        with connect(user=db_user, password=db_pass, host=db_host, database=db_name) as connection:
            query = "SELECT password FROM login WHERE username = %s;"
            with connection.cursor(prepared=True) as cursor:
                cursor.execute(query, (username,))
                results_tuple = cursor.fetchone()

                if results_tuple is None or len(results_tuple) < 1:
                    return False

                hashed_password = results_tuple[0]

                return bcrypt.checkpw(password.encode(), hashed_password.encode())
    except Error as e:
        return False


def _generate_jwt(username,
                  sa_keyfile,
                  sa_email='unece-auth-manager@adroit-nimbus-275214.iam.gserviceaccount.com',
                  audience='unece-auth-manager@adroit-nimbus-275214.iam.gserviceaccount.com',
                  expiry_length=3600):
    """Generates a signed JSON Web Token using a Google API Service Account."""

    now = int(time.time())

    # build payload
    payload = {
        'iat': now,
        # expires after 'expiry_length' seconds.
        "exp": now + expiry_length,
        # iss must match 'issuer' in the security configuration in your
        # swagger spec (e.g. service account email). It can be any string.
        'iss': sa_email,
        # aud must be either your Endpoints service name, or match the value
        # specified as the 'x-google-audience' in the OpenAPI document.
        'aud': audience,
        # sub and email should match the service account's email address
        'sub': username,
        'email': sa_email
    }

    # sign with keyfile
    signer = google.auth.crypt.RSASigner.from_service_account_file(sa_keyfile)
    jwt = google.auth.jwt.encode(signer, payload)

    return jwt
