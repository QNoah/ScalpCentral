import json
import psycopg2
import os


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
    schema_sql = """
CREATE TABLE IF NOT EXISTS attacks(
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    damage VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS abilities(
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS rules(
    id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS card_images(
    id INT NOT NULL,
    small VARCHAR(255),
    large VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS types(
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS subtypes(
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS cards (
    id VARCHAR(255) NOT NULL,
    set_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    supertype VARCHAR(255) NOT NULL,
    hp INT,
    evolves_from_name VARCHAR(255),
    artist VARCHAR(255),
    rarity VARCHAR(255),
    flavor_text VARCHAR(255),
    images_id INT NOT NULL,
    soft_delete BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cards_set_id
        FOREIGN KEY (set_id) REFERENCES sets(id),
    CONSTRAINT fk_cards_images_id
        FOREIGN KEY (images_id) REFERENCES card_images(id)
);

CREATE TABLE IF NOT EXISTS cards_to_evolutions(
    id INT NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    evolves_to_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cards_to_evolutions_card_id
        FOREIGN KEY (card_id) REFERENCES cards(id)
);

CREATE TABLE IF NOT EXISTS cards_to_abilities(
    id INT NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    ability_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cards_to_abilities_card_id
        FOREIGN KEY (card_id) REFERENCES cards(id),
    CONSTRAINT fk_cards_to_abilities_ability_id
        FOREIGN KEY (ability_id) REFERENCES abilities(id)
);

CREATE TABLE IF NOT EXISTS cards_to_attacks(
    id INT NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    attack_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cards_to_attacks_card_id
        FOREIGN KEY (card_id) REFERENCES cards(id),
    CONSTRAINT fk_cards_to_attacks_attack_id
        FOREIGN KEY (attack_id) REFERENCES attacks(id)
);

CREATE TABLE IF NOT EXISTS cards_to_rules(
    id INT NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    rule_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cards_to_rules_card_id
        FOREIGN KEY (card_id) REFERENCES cards(id),
    CONSTRAINT fk_cards_to_rules_rule_id
        FOREIGN KEY (rule_id) REFERENCES rules(id)
);

CREATE TABLE IF NOT EXISTS cards_to_types(
    id INT NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    type_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cards_to_types_card_id
        FOREIGN KEY (card_id) REFERENCES cards(id),
    CONSTRAINT fk_cards_to_types_type_id
        FOREIGN KEY (type_id) REFERENCES types(id)
);

CREATE TABLE IF NOT EXISTS cards_to_subtypes(
    id INT NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    subtype_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cards_to_subtypes_card_id
        FOREIGN KEY (card_id) REFERENCES cards(id),
    CONSTRAINT fk_cards_to_subtypes_subtype_id
        FOREIGN KEY (subtype_id) REFERENCES subtypes(id)
);
"""
    cursor.execute(
        schema_sql
    )
    connection.commit()
    cursor.close()

def load_cards_database(cards):
    for c in cards:
        c_id = c["id"]
        print(c_id)
        c_set_id = (c["id"].split("-")[0])
        c_name = c["name"]
        c_supertype = c["supertype"]
        c_subtype = c.get("subtypes")
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

        
        

def json_load():
    cards_folder = "./json/cards"
    for file in os.listdir(cards_folder):
        if not file.endswith(".json"): ## DIT MOET OOIT VERANDERD WORDEN > .JSON ALLEEN
            continue

        path = os.path.join(cards_folder, file)

        try:
            with open(path, encoding="utf-8") as f:
                cards = json.load(f)
                if cards:
                    load_cards_database(cards)
                    print("Success")
                        
        except Exception as e:
            print(f"Error in {file}: {e}")

if __name__ == "__main__":         
    connection = get_connection()
    if connection == False:
        exit()
    # create_tables(connection)
    # connection.commit()
    json_load()
    connection.close()
    print()
    print("Import klaar.")

# INSERT INTO "public"."cards" ("id", "set_id", "name", "supertype", "hp", "evolves_from_name", "artist", "rarity", "flavor_text", "soft_delete") VALUES
# ('base1 - 1', 'base1', 'doodo', 'Ex', 100, 'dreoleo', 'artruur', 'scar', 'poop plug in the toilet', 'FALSE');

# SELECT * FROM cards JOIN sets ON cards.set_id = sets.id WHERE cards.id = 'base1 - 1'