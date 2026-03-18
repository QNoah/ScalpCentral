import json
import psycopg2


def get_connection():
    try:
        connection = psycopg2.connect(
            database="scalpcentral",
            user="postgres",
            password="",
            host="127.0.0.1",
            port=5432,
        )
        return connection
    except Exception as e:
        print("Connectie werkt niet:", e)
        return False


def create_table(connection):
    cursor = connection.cursor()
    cursor.execute(
        """
        
        """
    )
    connection.commit()
    cursor.close()





connection = get_connection()
if connection == False:
    exit()

create_table(connection)

data = json_load_sets()
if data == False:
    connection.close()
    exit()

cursor = connection.cursor()


connection.commit()

cursor.close()
connection.close()

print("Import klaar.")
