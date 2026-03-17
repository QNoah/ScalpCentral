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


def create_tables(connection):
    cursor = connection.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS cards (
            id VARCHAR(255) NOT NULL,
            set_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            supertype VARCHAR(255) NOT NULL,
            hp INT NOT NULL,
            evolves_from_name VARCHAR(255),
            artist VARCHAR(255) NOT NULL,
            rarity VARCHAR(255) NOT NULL,
            flavor_text VARCHAR(255) NOT NULL,
            images_id INT,
            soft_delete BOOL NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT fk_set_id
                FOREIGN KEY (set_id)
                REFERENCES sets(id)
        );
        """
    )

    connection.commit()
    cursor.close()


connection = get_connection()
if connection == False:
    exit()

create_tables(connection)

connection.commit()
connection.close()

print("Import klaar.")
