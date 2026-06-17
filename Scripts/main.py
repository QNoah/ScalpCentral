import psycopg2
import sets_and_cards
import connection
import users
import bookmarks
import products
import orders
import orderContents
import product_reviews
import argparse


def create_database(cur: psycopg2.extensions.cursor):
    try:
        cur.execute("""
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = 'scalpcentral'
            AND pid <> pg_backend_pid();
            """)
        stepOne = """DROP DATABASE IF EXISTS scalpcentral"""
        stepTwo = """CREATE DATABASE scalpcentral ENCODING='UTF8' TEMPLATE='template0'"""
        cur.execute(stepOne)
        cur.execute(stepTwo)
        print("Successvol de database aangemaakt")
    except Exception as e:
        print(e)
        exit()

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("-pw", "--password", default="scalpsql")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    con = connection.get_connection("postgres", args.password)
    create_database(con.cursor())

    con = connection.get_connection("scalpcentral", args.password)
    sets_and_cards.run(con)
    users.run(con)
    products.run(con)
    orders.run(con)
    orderContents.run(con)
    bookmarks.run(con)
    product_reviews.run(con)
    
    con.close()
