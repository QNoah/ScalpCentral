import connection
import psycopg2


def create_user_table(cur: psycopg2.extensions.cursor):
    # con = connection.get_connection()
    # cur = connection.get_cursor(con)

    schema_sql = """CREATE TABLE IF NOT EXISTS users (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            iban TEXT,
            postcode VARCHAR(255),
            country VARCHAR(255),
            street_name VARCHAR(255),
            street_number VARCHAR(255),
            phone_number TEXT,
            negative_seller_count int,
            positive_seller_count int,
            role VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL,
            deleted_at DATE NOT NULL,
            soft_delete BOOLEAN NOT NULL DEFAULT FALSE
        ); """
    cur.execute(schema_sql)


##PASSWORD MOET OOIT WORDEN VERANDERD NAAR ENCRYPTION.

if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
