import logging
import base64
import hashlib
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

def generate_wsse_signature(username, secret):
    # from https://emarsys.api-docs.io/v2/before-you-start/authentication#code-samples
    # Funtion to create the X-WSSE header, which is generated from your username and secret

    # Nonce: A random value ensuring that the request is unique, so it cannot be replicated by any other unknown party.
    # This string is always 16 bytes long and must be represented as a 32-character hexadecimal value.
    nonce = uuid.uuid4().hex

    # The current timestamp in ISO8601 format.
    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

    raw_password_digest = nonce + timestamp + secret

    encrypted_password_digest = hashlib.sha1()
    encrypted_password_digest.update(raw_password_digest.encode())
    pass_sha1 = encrypted_password_digest.hexdigest()

    # Computes the Password Digest
    pass_digest = base64.b64encode(pass_sha1.encode()).decode()

    signature = 'UsernameToken Username="{}", PasswordDigest="{}", Nonce="{}", Created="{}"'.format(
        username,
        pass_digest,
        nonce,
        timestamp
    )
    logger.debug(f'wsse signature: {signature}')
    return signature
