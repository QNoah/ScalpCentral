import json
import psycopg2
import os
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
            
);

CREATE TABLE IF NOT EXISTS orderContents(
    
);
"""
    cursor.execute(schema_sql)
    cursor.close()

def run(connection):
    create_tables(connection)
    connection.commit()
    print(f"create_orders.py ran succesfully.")
    return

if __name__ == "__main__":
    connection = get_connection()
    if connection is False:
        print("Error: Connection is False")
        sys.exit(1)
    run(connection)
