import connection
import psycopg2


def create_bookmarks_table(cur: psycopg2.extensions.cursor):

    schema_sql = """CREATE TABLE IF NOT EXISTS bookmarks (
            id BIGINT PRIMARY KEY,
            user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE
        ); """
    cur.execute(schema_sql)


if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
