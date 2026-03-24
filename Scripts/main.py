import import_script
import psycopg2
import connection
import users
import bookmarks
import products
import orders
import orderContents


def create_database(cur: psycopg2.extensions.cursor):
    try:
        query = """CREATE DATABASE scalpcentral ENCODING='UTF8' TEMPLATE='template0'"""
        cur.execute(query)
        print("Successvol de database aangemaakt")
    except Exception as e:
        print(e)
        exit()


if __name__ == "__main__":
    sys.cl
    con = connection.get_connection("postgres")
    cur = con.cursor()
    create_database(cur)
    con.close()

    con = connection.get_connection()
    cur = con.cursor()

    import_script.run(con)  # kaarten en sets
    users.create_user_table(cur)
    products.run(con)
    orders.run(con)
    orderContents.run(con)
    bookmarks.create_bookmarks_table(cur)
    con.close()
