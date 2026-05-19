import Scripts.sets_and_cards as sets_and_cards
import psycopg2
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
        query = """CREATE DATABASE scalpcentral ENCODING='UTF8' TEMPLATE='template0'"""
        cur.execute(query)
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

    con = connection.get_connection("scalpcentral", args.password)

    sets_and_cards.run(con)
    users.run(con)
    products.run(con)
    orders.run(con)
    orderContents.run(con)
    bookmarks.run(con)
    product_reviews.run(con)
    
    con.close()
