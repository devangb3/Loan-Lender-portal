import secrets

def generate_jwt_secret() -> str:
    """
    Generate a secure random secret key for JWT signing.
    """
    random_bytes = secrets.token_bytes(32)
    secret_key = random_bytes.hex()
    return secret_key


if __name__ == "__main__":
    secret = generate_jwt_secret()
    print("Generated JWT Secret Key (32 bytes):")
    print(secret)
    print("\nAdd this to your .env file:")
    print(f"JWT_SECRET_KEY={secret}")
