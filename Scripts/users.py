import connection
import psycopg2
from connection import get_connection


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

def run(con: psycopg2.extensions.connection):
    create_user_table(con.cursor())

if __name__ == "__main__":
    con = get_connection()
    tempcur = con.cursor()
    tempcur.execute("DROP TABLE IF EXISTS users CASCADE;")
    tempcur.close()
    run(con)
