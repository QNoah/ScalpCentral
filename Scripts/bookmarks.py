import connection
import psycopg2


def create_bookmarks_table():
    con = connection.get_connection()
    cur = connection.get_cursor(con)

    schema_sql = """CREATE TABLE IF NOT EXISTS bookmarks (
            id VARCHAR(255) PRIMARY KEY,
            user_id BIGINT NOT NULL REFERENCES users(id),
            product_id BIGINT NOT NULL REFERENCES products(id)
        ); """
    cur.execute(schema_sql)
    con.commit()
    con.close()


if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
