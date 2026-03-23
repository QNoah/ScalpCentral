import import_script
import psycopg2


def create_connection(db_name: str):
    try:
        con = psycopg2.connect(
            dbname=db_name,
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
        query = """CREATE DATABASE scalpcentral ENCODING='UTF-8' TEMPLATE='template0'"""
        cursor = con.cursor()
        cursor.connection
        cursor.execute(query)
        cursor.close()
        print("Successvol de database aangemaakt")
    except Exception as e:
        print(e)
        exit()


if __name__ == "__main__":
    con = create_connection("postgres")
    create_database(con)
    con = create_connection("scalpcentral")
    import_script.run(con)
