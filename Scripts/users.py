import base64
import hashlib
import hmac

import psycopg2
from connection import get_connection

HASH_KEY = "vis"
ADMIN_USERNAME = "admin"


def hash_password(password: str) -> str:
    hashed_password = hmac.new(
        HASH_KEY.encode("utf-8"),
        password.encode("utf-8"),
        hashlib.sha256
    ).digest()

    return base64.b64encode(hashed_password).decode("utf-8")


def create_user_table(cur: psycopg2.extensions.cursor):
    schema_sql = """CREATE TABLE IF NOT EXISTS users (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            iban TEXT,
            postcode VARCHAR(255),
            country VARCHAR(255),
            city VARCHAR(255),
            street_name VARCHAR(255),
            street_number VARCHAR(255),
            phone_number TEXT,
            negative_seller_count INT DEFAULT 0,
            positive_seller_count INT DEFAULT 0,
            role VARCHAR(255) NOT NULL DEFAULT 'user',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            deleted_at TIMESTAMPTZ,
            soft_delete BOOLEAN NOT NULL DEFAULT FALSE
        ); """
    cur.execute(schema_sql)


def seed_admin_user(cur: psycopg2.extensions.cursor):
    admin_sql = """
        INSERT INTO users (
            first_name,
            last_name,
            email,
            password,
            role,
            created_at,
            deleted_at,
            soft_delete
        )
        VALUES (%s, %s, %s, %s, %s, NOW(), NULL, FALSE)
        ON CONFLICT (email) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            password = EXCLUDED.password,
            role = EXCLUDED.role,
            deleted_at = NULL,
            soft_delete = FALSE;
    """

    cur.execute(admin_sql, (
        ADMIN_USERNAME,
        ADMIN_USERNAME,
        ADMIN_USERNAME,
        hash_password(ADMIN_USERNAME),
        "Admin"
    ))


def run(con: psycopg2.extensions.connection):
    cur = con.cursor()
    create_user_table(cur)
    seed_admin_user(cur)
    con.commit()
    cur.close()

if __name__ == "__main__":
    con = get_connection()
    tempcur = con.cursor()
    tempcur.execute("DROP TABLE IF EXISTS users CASCADE;")
    tempcur.close()
    run(con)
