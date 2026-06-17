import psycopg2
import sys

sys.stdout.reconfigure(encoding="utf-8")

def create_tables(connection):
    cursor = connection.cursor()
    schema_sql = """
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_number VARCHAR(255) NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
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
    print("Je kan deze file niet runnen gebruik: Main.py")

