import psycopg2


def get_connection(db_name: str = "scalpcentral", db_password: str = "scalpsql"):
    try:
        connection = psycopg2.connect(
            database=db_name,
            user="postgres",
            password=db_password,
            host="postgres",
            port=5432,
        )
        connection.set_client_encoding("UTF8")
        connection.autocommit = True
        # with connection.cursor() as cur:
        # cur.execute("""SHOW client_encoding;""")
        # print(cur.fetchone())
        # cur.execute("""SHOW server_encoding;""")
        # print(cur.fetchone())
        return connection
    except Exception as e:
        print("Connectie werkt niet:", e)
        return False

if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
