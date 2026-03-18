# import cards
import sets
import psycopg2


def create_connection():
    try:
        con = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="",
            host="127.0.0.1",
            port=5432,
        )
        return con
    except Exception as e:
        print(e)
        exit()


def create_database(con: psycopg2.extensions.connection):
    try:
        con.autocommit = True
        query = """CREATE DATABASE scalpcentral ENCODING='UTF8' TEMPLATE='template0'"""
        cursor = con.cursor()
        cursor.execute(query)
        cursor.close()
        print("Successvol de database aangemaakt")
    except Exception as e:
        print(e)
        exit()


if __name__ == "__main__":
    con = create_connection()
    # create_database(con)
    sets()


# print("Begonnen met het laden van de sets")
