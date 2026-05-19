import psycopg2
import sys

sys.stdout.reconfigure(encoding="utf-8")

def create_tables(connection):
    cursor = connection.cursor()
    schema_sql = """
CREATE TABLE IF NOT EXISTS product_reviews (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id BIGINT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
            product_id BIGINT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
            stars NUMERIC(2, 1) NOT NULL CHECK (stars >= 0 AND stars <= 5),
            title TEXT,
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
"""
    cursor.execute(schema_sql)
    cursor.close()

def run(connection):
    create_tables(connection)
    connection.commit()
    print(f"product_reviews.py ran succesfully.")
    return

if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
