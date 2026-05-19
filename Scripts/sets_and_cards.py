import json
import psycopg2
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

sys.stdout.reconfigure(encoding="utf-8")

def create_tables(connection):
    cursor = connection.cursor()
    schema_sql = """
CREATE TABLE IF NOT EXISTS sets (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            series VARCHAR(255) NOT NULL,
            total_cards INT NOT NULL,
            release_date DATE NOT NULL,
            image_logo VARCHAR(255) NOT NULL,
            soft_delete BOOLEAN NOT NULL DEFAULT FALSE
        );

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    iban VARCHAR(255) NOT NULL,
    postcode VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    street_name VARCHAR(255) NOT NULL,
    street_number VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    negative_seller_count INT NOT NULL DEFAULT 0,
    positive_seller_count INT NOT NULL DEFAULT 0,
    role VARCHAR(100) NOT NULL DEFAULT 'User',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    soft_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS attacks(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    damage VARCHAR(255),
    description TEXT,
    CONSTRAINT unique_attacks_only UNIQUE NULLS NOT DISTINCT (name, damage, description)
);

CREATE TABLE IF NOT EXISTS abilities(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    description TEXT,
    CONSTRAINT unique_abilities_only UNIQUE NULLS NOT DISTINCT (name, type, description)
);

CREATE TABLE IF NOT EXISTS rules(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS card_images(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    small TEXT,
    large TEXT
);

CREATE TABLE IF NOT EXISTS types(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS subtypes(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
    id VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
    set_id VARCHAR(255) NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    supertype VARCHAR(255) NOT NULL,
    hp VARCHAR(255),
    evolves_from_name VARCHAR(255),
    artist VARCHAR(255),
    rarity VARCHAR(255),
    flavor_text TEXT,
    images_id BIGINT REFERENCES card_images(id) ON DELETE SET NULL,
    soft_delete BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cards_to_evolutions(
    pokemon_name VARCHAR(255) NOT NULL,
    evolves_to_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (pokemon_name, evolves_to_name)
);

CREATE TABLE IF NOT EXISTS cards_to_abilities(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    ability_id BIGINT NOT NULL REFERENCES abilities(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, ability_id)
);

CREATE TABLE IF NOT EXISTS cards_to_attacks(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    attack_id BIGINT NOT NULL REFERENCES attacks(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, attack_id)
);

CREATE TABLE IF NOT EXISTS cards_to_rules(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    rule_id BIGINT NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, rule_id)
);

CREATE TABLE IF NOT EXISTS cards_to_types(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    type_id BIGINT NOT NULL REFERENCES types(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, type_id)
);

CREATE TABLE IF NOT EXISTS cards_to_subtypes(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    subtype_id BIGINT NOT NULL REFERENCES subtypes(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, subtype_id)
);
"""
    cursor.execute(schema_sql)
    connection.commit()
    cursor.close()


def insert_cards(cards, connection):
    cursor = connection.cursor()

    for c in cards:
        c_id = c["id"]
        c_set_id = c["id"].split("-")[0]
        c_name = c.get("name")
        c_supertype = c["supertype"]
        c_subtypes = c.get("subtypes")
        c_types = c.get("types")
        c_hp = c.get("hp")
        c_evolves_from_name = c.get("evolvesFrom")
        c_evolves_to_name = c.get("evolvesTo")
        c_attacks = c.get("attacks")
        c_abilities = c.get("abilities")
        c_rules = c.get("rules")
        c_artist = c.get("artist")
        c_rarity = c.get("rarity")
        c_flavor_text = c.get("flavorText")
        c_imagesmall = c["images"]["small"]
        c_imagelarge = c["images"]["large"]

        cursor.execute(
            """INSERT INTO card_images (small, large) VALUES (%s, %s) RETURNING id""",
            (c_imagesmall, c_imagelarge),
        )
        images_id = cursor.fetchone()[0]

        cursor.execute(
            """
            INSERT INTO cards (id, set_id, name, supertype, hp, evolves_from_name, artist, rarity, flavor_text, images_id, soft_delete)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, DEFAULT)
            """,
            (
                c_id,
                c_set_id,
                c_name,
                c_supertype,
                c_hp,
                c_evolves_from_name,
                c_artist,
                c_rarity,
                c_flavor_text,
                images_id,
            ),
        )
        if c_evolves_to_name:
            for name in c_evolves_to_name:
                cursor.execute(
                    """INSERT INTO cards_to_evolutions (pokemon_name, evolves_to_name)
                    VALUES (%s, %s) ON CONFLICT DO NOTHING""", (c_name, name))

        if c_attacks:
            for attack in c_attacks:
                cursor.execute(
                    """INSERT INTO attacks (name, damage, description) VALUES (%s, %s, %s) ON CONFLICT ON CONSTRAINT unique_attacks_only DO UPDATE SET name = EXCLUDED.name RETURNING id;""",
                    (attack["name"], attack.get("damage"), attack.get("text")),
                )
                attack_id = cursor.fetchone()[0]
                cursor.execute(
                    """INSERT INTO cards_to_attacks (card_id, attack_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""",
                    (c_id, attack_id),
                )

        if c_abilities:
            for ability in c_abilities:
                cursor.execute(
                    """INSERT INTO abilities (name, type, description) VALUES (%s, %s, %s) ON CONFLICT ON CONSTRAINT unique_abilities_only DO UPDATE SET name = EXCLUDED.name RETURNING id;""",
                    (ability["name"], ability.get("type"), ability.get("text")),
                )
                ability_id = cursor.fetchone()[0]
                cursor.execute(
                    """INSERT INTO cards_to_abilities (card_id, ability_id) VALUEs (%s, %s) ON CONFLICT DO NOTHING""",
                    (c_id, ability_id),
                )

        if c_rules:
            for rule in c_rules:
                cursor.execute(
                    """INSERT INTO rules (description) VALUES (%s) ON CONFLICT (description) DO UPDATE SET description = EXCLUDED.description RETURNING id;""",
                    (rule,),
                )
                rule_id = cursor.fetchone()[0]
                cursor.execute(
                    """INSERT INTO cards_to_rules (card_id, rule_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""",
                    (c_id, rule_id),
                )

        if c_subtypes:
            for subtype in c_subtypes:
                cursor.execute(
                    """INSERT INTO subtypes (name) VALUES (%s) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;""",
                    (subtype,),
                )
                subtype_id = cursor.fetchone()[0]
                cursor.execute(
                    """INSERT INTO cards_to_subtypes (card_id, subtype_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""",
                    (c_id, subtype_id),
                )
        if c_types:
            for type in c_types:
                cursor.execute(
                    """INSERT INTO types (name) VALUES (%s) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id""",
                    (type,),
                )
                type_id = cursor.fetchone()[0]
                cursor.execute(
                    """INSERT INTO cards_to_types (card_id, type_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""",
                    (c_id, type_id),
                )


def insert_sets(data, connection):
    cursor = connection.cursor()

    for set in data:
        id = set["id"]
        name = set["name"]
        series = set["series"]
        total = set["total"]
        release = set["releaseDate"]
        image = set["images"]["logo"]

        cursor.execute(
            """
            INSERT INTO sets (id, name, series, total_cards, release_date, image_logo, soft_delete)
            VALUES (%s, %s, %s, %s, %s, %s, DEFAULT)
            """,
            (id, name, series, total, release, image),
        )

        print(f"Succes SET: {name} imported.")


def json_load_cards(connection):
    cards_folder = "./json/cards"
    for file in os.listdir(cards_folder):
        if not file.endswith(".json"):
            continue

        path = os.path.join(cards_folder, file)

        try:
            with open(path, encoding="utf8") as f:
                cards = json.load(f)
                if cards:
                    insert_cards(cards, connection)
                    print(f"Succes CARDS: {file} imported")

        except Exception as e:
            print(f"Error in {file}: {e}")


def json_load_sets(connection):
    try:
        with open("./json/sets.json", "r", encoding="utf8") as file:
            data = json.load(file)
            insert_sets(data, connection)
            return
    except Exception as e:
        print("JSON laden mislukt:", e)


def run(connection):
    create_tables(connection)
    connection.commit()

    json_load_sets(connection)
    connection.commit()
    
    json_load_cards(connection)
    connection.commit()
    print(f"set_and_cards.py ran succesfully.")
    return


if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")

