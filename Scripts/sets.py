import json
import psycopg2


def make_connection():
    try:
        connection = psycopg2.connect(
            database="scalpcentral",
            user="postgre",
            password="",
            host="127.0.0.1",  # Verander dit naar de host van de externe server.
            port=5432,
        )
    except:
        print("Connectie werkt niet.")
        return
    json_load()


def json_load():
    with open("./json/sets.json", "r") as file:
        data = json.load(file)
    with open("demofile.txt", "w") as f:
        f.write(json.dumps(data, indent = 4))

make_connection()
