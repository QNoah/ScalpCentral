import psycopg2
import sys

sys.stdout.reconfigure(encoding="utf-8")

def get_connection():
    try:
        connection = psycopg2.connect(
            database="scalpcentral",
            user="postgres",
            password="",
            host="127.0.0.1",
            port=5432,
        )
        connection.set_client_encoding("UTF8")
        with connection.cursor() as cur:
            cur.execute("""SHOW client_encoding;""")
            print(cur.fetchone())
            cur.execute("""SHOW server_encoding;""")
            print(cur.fetchone())
        return connection
    except Exception as e:
        print("Connectie werkt niet:", e)
        return False

def create_tables(connection):
    cursor = connection.cursor()
    schema_sql = """
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_number VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) REFERENCES users(id) NOT NULL,
    phone_number TEXT,
    email TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postcode VARCHAR(255) NOT NULL,
    street_name VARCHAR(255) NOT NULL,
    street_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    soft_delete BOOL NOT NULL DEFAULT FALSE
);
"""
    cursor.execute(schema_sql)
    cursor.close()

def run(connection):
    create_tables(connection)
    connection.commit()
    print(f"orders.py ran succesfully.")
    return

if __name__ == "__main__":
    connection = get_connection()
    if connection is False:
        print("Error: Connection is False")
        sys.exit(1)
    run(connection)
