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

    # batch insert images and get ids back
    image_data = [(c["images"]["small"], c["images"]["large"]) for c in cards]
    image_ids = []
    for small, large in image_data:
        cursor.execute(
            "INSERT INTO card_images (small, large) VALUES (%s, %s) RETURNING id",
            (small, large)
        )
        image_ids.append(cursor.fetchone()[0])

    # batch insert cards
    card_rows = []
    for c, images_id in zip(cards, image_ids):
        card_rows.append((
            c["id"],
            c["id"].split("-")[0],
            c.get("name"),
            c["supertype"],
            c.get("hp"),
            c.get("evolvesFrom"),
            c.get("artist"),
            c.get("rarity"),
            c.get("flavorText"),
            images_id,
        ))

    cursor.executemany("""
        INSERT INTO cards (id, set_id, name, supertype, hp, evolves_from_name, artist, rarity, flavor_text, images_id, soft_delete)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, DEFAULT)
        ON CONFLICT DO NOTHING
    """, card_rows)

    # batch relations
    evolution_rows, attack_rows, ability_rows, rule_rows, subtype_rows, type_rows = [], [], [], [], [], []

    for c in cards:
        c_id = c["id"]
        c_name = c.get("name")

        if c.get("evolvesTo"):
            for name in c["evolvesTo"]:
                evolution_rows.append((c_name, name))

        if c.get("attacks"):
            for attack in c["attacks"]:
                cursor.execute("""
                    INSERT INTO attacks (name, damage, description) VALUES (%s, %s, %s)
                    ON CONFLICT ON CONSTRAINT unique_attacks_only DO UPDATE SET name = EXCLUDED.name RETURNING id
                """, (attack["name"], attack.get("damage"), attack.get("text")))
                attack_rows.append((c_id, cursor.fetchone()[0]))

        if c.get("abilities"):
            for ability in c["abilities"]:
                cursor.execute("""
                    INSERT INTO abilities (name, type, description) VALUES (%s, %s, %s)
                    ON CONFLICT ON CONSTRAINT unique_abilities_only DO UPDATE SET name = EXCLUDED.name RETURNING id
                """, (ability["name"], ability.get("type"), ability.get("text")))
                ability_rows.append((c_id, cursor.fetchone()[0]))

        if c.get("rules"):
            for rule in c["rules"]:
                cursor.execute("""
                    INSERT INTO rules (description) VALUES (%s)
                    ON CONFLICT (description) DO UPDATE SET description = EXCLUDED.description RETURNING id
                """, (rule,))
                rule_rows.append((c_id, cursor.fetchone()[0]))

        if c.get("subtypes"):
            for subtype in c["subtypes"]:
                cursor.execute("""
                    INSERT INTO subtypes (name) VALUES (%s)
                    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
                """, (subtype,))
                subtype_rows.append((c_id, cursor.fetchone()[0]))

        if c.get("types"):
            for type in c["types"]:
                cursor.execute("""
                    INSERT INTO types (name) VALUES (%s)
                    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id
                """, (type,))
                type_rows.append((c_id, cursor.fetchone()[0]))

    # bulk insert all relations at once
    if evolution_rows:
        cursor.executemany("INSERT INTO cards_to_evolutions VALUES (%s, %s) ON CONFLICT DO NOTHING", evolution_rows)
    if attack_rows:
        cursor.executemany("INSERT INTO cards_to_attacks VALUES (%s, %s) ON CONFLICT DO NOTHING", attack_rows)
    if ability_rows:
        cursor.executemany("INSERT INTO cards_to_abilities VALUES (%s, %s) ON CONFLICT DO NOTHING", ability_rows)
    if rule_rows:
        cursor.executemany("INSERT INTO cards_to_rules VALUES (%s, %s) ON CONFLICT DO NOTHING", rule_rows)
    if subtype_rows:
        cursor.executemany("INSERT INTO cards_to_subtypes VALUES (%s, %s) ON CONFLICT DO NOTHING", subtype_rows)
    if type_rows:
        cursor.executemany("INSERT INTO cards_to_types VALUES (%s, %s) ON CONFLICT DO NOTHING", type_rows)

    cursor.close()


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
    
    # json_load_cards(connection)
    # connection.commit()
    print(f"set_and_cards.py ran succesfully.")
    return


if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")

