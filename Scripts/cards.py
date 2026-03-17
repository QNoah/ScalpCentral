import json
import psycopg2
import os
import traceback
import sys
sys.stdout.reconfigure(encoding='utf-8')



def get_connection():
    try:
        connection = psycopg2.connect(
            database="scalpcentral",
            user="postgres",
            password="",
            host="127.0.0.1",
            port=5432,
        )
        connection.set_client_encoding('UTF8')
        with connection.cursor() as cur:
            cur.execute("""SHOW client_encoding;""")
            print(cur.fetchone())
            cur.execute("""SHOW server_encoding;""")
            print(cur.fetchone())
        return connection
    except Exception as e:
        print("Connectie werkt niet:", e)
        return False


def create_tables(connection):
    cursor = connection.cursor()
    schema_sql = """
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
    set_id VARCHAR(255) NOT NULL REFERENCES sets(id),
    name VARCHAR(255) NOT NULL,
    supertype VARCHAR(255) NOT NULL,
    hp INT,
    evolves_from_name VARCHAR(255),
    artist VARCHAR(255),
    rarity VARCHAR(255),
    flavor_text TEXT,
    images_id BIGINT NOT NULL REFERENCES card_images(id),
    soft_delete BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cards_to_evolutions(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id),
    evolves_to_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, evolves_to_name)
);

CREATE TABLE IF NOT EXISTS cards_to_abilities(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id),
    ability_id BIGINT NOT NULL REFERENCES abilities(id),
    PRIMARY KEY (card_id, ability_id)
);

CREATE TABLE IF NOT EXISTS cards_to_attacks(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id),
    attack_id BIGINT NOT NULL REFERENCES attacks(id),
    PRIMARY KEY (card_id, attack_id)
);

CREATE TABLE IF NOT EXISTS cards_to_rules(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id),
    rule_id BIGINT NOT NULL REFERENCES rules(id),
    PRIMARY KEY (card_id, rule_id)
);

CREATE TABLE IF NOT EXISTS cards_to_types(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id),
    type_id BIGINT NOT NULL REFERENCES types(id),
    PRIMARY KEY (card_id, type_id)
);

CREATE TABLE IF NOT EXISTS cards_to_subtypes(
    card_id VARCHAR(255) NOT NULL REFERENCES cards(id),
    subtype_id BIGINT NOT NULL REFERENCES subtypes(id),
    PRIMARY KEY (card_id, subtype_id)
);
"""
    cursor.execute(
        schema_sql
    )
    connection.commit()
    cursor.close()

def load_cards_database(cards, connection):
    cursor = connection.cursor()

    for c in cards:
        c_id = c["id"]
        c_set_id = (c["id"].split("-")[0])
        c_name = c.get("name")
        c_supertype = c["supertype"]
        c_subtypes = c.get("subtypes")
        c_types = c.get("types")
        c_hp = c.get("hp")
        c_evolves_from_name = c.get("evolvesFrom")
        c_attacks = c.get("attacks")
        c_abilities = c.get("abilities")
        c_rules = c.get("rules")
        c_artist = c.get("artist")
        c_rarity = c.get("rarity")
        c_flavor_text = c.get("flavorText")
        c_imagesmall = c["images"]["small"]
        c_imagelarge = c["images"]["large"]

        cursor.execute("""INSERT INTO card_images (small, large) VALUES (%s, %s) RETURNING id""", (c_imagesmall, c_imagelarge))
        images_id = cursor.fetchone()[0]
        # print(f"pre insert check after this line ill insert a card: {c_id, c_name, c_evolves_from_name}")

        cursor.execute(
                        """
                        INSERT INTO cards (id, set_id, name, supertype, hp, evolves_from_name, artist, rarity, flavor_text, images_id, soft_delete)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, DEFAULT)
                        """, (c_id, c_set_id, c_name, c_supertype, c_hp, c_evolves_from_name, c_artist, c_rarity, c_flavor_text, images_id)
        )

        if c_attacks:
            for attack in c_attacks:
                cursor.execute("""INSERT INTO attacks (name, damage, description) VALUES (%s, %s, %s) ON CONFLICT ON CONSTRAINT unique_attacks_only DO UPDATE SET name = EXCLUDED.name RETURNING id;""", (attack["name"], attack.get("damage"), attack.get("text")))
                attack_id = cursor.fetchone()[0]
                cursor.execute("""INSERT INTO cards_to_attacks (card_id, attack_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", (c_id, attack_id))

        if c_abilities:
            for ability in c_abilities:
                cursor.execute("""INSERT INTO abilities (name, type, description) VALUES (%s, %s, %s) ON CONFLICT ON CONSTRAINT unique_abilities_only DO UPDATE SET name = EXCLUDED.name RETURNING id;""", (ability["name"], ability.get("type"), ability.get("text")))
                ability_id = cursor.fetchone()[0]
                cursor.execute("""INSERT INTO cards_to_abilities (card_id, ability_id) VALUEs (%s, %s) ON CONFLICT DO NOTHING""", (c_id, ability_id))

        if c_rules:
            for rule in c_rules:
                cursor.execute("""INSERT INTO rules (description) VALUES (%s) ON CONFLICT (description) DO UPDATE SET description = EXCLUDED.description RETURNING id;""", (rule,))
                rule_id = cursor.fetchone()[0]
                cursor.execute("""INSERT INTO cards_to_rules (card_id, rule_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", (c_id, rule_id))

        if c_subtypes:
            for subtype in c_subtypes:
                cursor.execute("""INSERT INTO subtypes (name) VALUES (%s) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;""", (subtype,))
                subtype_id = cursor.fetchone()[0]
                cursor.execute("""INSERT INTO cards_to_subtypes (card_id, subtype_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", (c_id, subtype_id))
        if c_types:
            for type in c_types:
                cursor.execute("""INSERT INTO types (name) VALUES (%s) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id""", (type,))
                type_id = cursor.fetchone()[0]
                cursor.execute("""INSERT INTO cards_to_types (card_id, type_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", (c_id, type_id))

def json_load(connection):
    cards_folder = "./json/cards"
    for file in os.listdir(cards_folder):
        if not file.endswith(".json"): ## DIT MOET OOIT VERANDERD WORDEN > ".json"
            continue

        path = os.path.join(cards_folder, file)

        try:
            with open(path, encoding="utf8") as f:
                cards = json.load(f)
                if cards:
                    load_cards_database(cards, connection)
                    print(f"Succes: {file} imported")
                        
        except Exception as e:
            print(f"Error in {file}: {e!r}", file=sys.stderr)
            traceback.print_exc()

            diag = getattr(e, "diag", None)
            if diag:
                print("Postgres diagnostics:", file=sys.stderr)
                for attr in ("severity", "sqlstate", "message_primary", "message_detail",
                            "message_hint", "statement_position", "context",
                            "schema_name", "table_name", "column_name",
                            "constraint_name", "datatype_name"):
                    val = getattr(diag, attr, None)
                    if val:
                        print(f"  {attr}: {val}", file=sys.stderr)

if __name__ == "__main__":         
    connection = get_connection()
    if connection == False:
        exit()
    create_tables(connection)
    json_load(connection)
    connection.commit()
    connection.close()


    print("Success")