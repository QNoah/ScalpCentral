import psycopg2


def get_connection(db_name: str = "scalpcentral"):
    try:
        connection = psycopg2.connect(
            database=db_name,
            user="postgres",
            password="",
            host="127.0.0.1",
            port=5432,
        )
        connection.set_client_encoding("UTF8")
        # with connection.cursor() as cur:
        # cur.execute("""SHOW client_encoding;""")
        # print(cur.fetchone())
        # cur.execute("""SHOW server_encoding;""")
        # print(cur.fetchone())
        return connection
    except Exception as e:
        print("Connectie werkt niet:", e)
        return False


def get_cursor(con):
    return con.cursor()


if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
