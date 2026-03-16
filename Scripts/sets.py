import json
import psycopg2


def make_connection():
    try:
        connection = psycopg2.connect(
            database="scalpcentral",
            user="postgres",
            password="",
            host="127.0.0.1",  # Verander dit naar de host van de externe server.
            port=5432,
        )
    except:
        print("Connectie werkt niet.")
        return False

    mycursor = connection.cursor()
    mycursor.execute(
        "CREATE TABLE sets (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL,"
        "series VARCHAR(255),total INT NOT NULL, price DECIMAL(10,2) NOT NULL, release_date VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL)"
    )
    connection.commit()


def json_load():
    try:
        with open("./json/sets.json", "r") as file:
            data = json.load(file)
            return data
    except:
        return False


if make_connection() == False:
    exit()

data = json_load()
if data == False:
    exit()

for set in data:
    print(
        "---------",
    )
    id = set["id"]
    name = set["name"]
    series = set["series"]
    total = set["total"]
    release = set["releaseDate"]
    image = set["images"]["logo"]

    query = f"INSERT INTO sets VALUES({id}, {name}, {series}, {total}, 67.00 {release}, {image})"
    
