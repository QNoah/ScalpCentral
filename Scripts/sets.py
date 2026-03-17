import json
import psycopg2


def get_connection():
    try:
        connection = psycopg2.connect(
            database="scalpcentral",
            user="postgres",
            password="",
            host="127.0.0.1",
            port=5433,
        )
        return connection
    except Exception as e:
        print("Connectie werkt niet:", e)
        return False


def create_table(connection):
    cursor = connection.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS sets (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            series VARCHAR(255) NOT NULL,
            total_cards INT NOT NULL,
            release_date DATE NOT NULL,
            image_logo VARCHAR(255) NOT NULL,
            soft_delete BOOL NOT NULL
        )
        """
    )
    connection.commit()
    cursor.close()


def json_load():
    try:
        with open("./json/sets.json", "r") as file:
            data = json.load(file)
            return data
    except Exception as e:
        print("JSON laden mislukt:", e)
        return False


connection = get_connection()
if connection == False:
    exit()

create_table(connection)

data = json_load()
if data == False:
    connection.close()
    exit()

cursor = connection.cursor()

for set in data:
    print("---------")

    id = set["id"]
    name = set["name"]
    series = set["series"]
    total = set["total"]
    release = set["releaseDate"]
    image = set["images"]["logo"]

    cursor.execute(
        """
        INSERT INTO sets (id, name, series, total_cards, release_date, image_logo, soft_delete)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (id, name, series, total, release, image, False),  ## 67 MUST BE UPDATED LATER.
    )

connection.commit()

cursor.close()
connection.close()

print("Import klaar.")
