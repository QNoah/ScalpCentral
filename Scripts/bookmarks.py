import connection
import psycopg2


def create_bookmarks_table(cur: psycopg2.extensions.cursor):

    schema_sql = """CREATE TABLE IF NOT EXISTS bookmarks (
            user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            PRIMARY KEY (user_id, product_id)
        ); """
    cur.execute(schema_sql)

def run(con: psycopg2.extensions.connection):
    create_bookmarks_table(con.cursor())

if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
