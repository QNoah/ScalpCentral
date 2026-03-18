import psycopg2
import csv
import os
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

def create_table(connection):
    cursor = connection.cursor()
    table_sql = """
CREATE TABLE IF NOT EXISTS products(
id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
set_id VARCHAR(255) REFERENCES sets(id),
name VARCHAR(255) NOT NULL,
type VARCHAR(255) NOT NULL,
description TEXT,
price NUMERIC(10, 2) NOT NULL DEFAULT 0,
saleprice_modifier NUMERIC(5,2),
stock INT NOT NULL DEFAULT 0,
created_at TIMESTAMPZ NOT NULL DEFAULT NOW(),
deleted_at TIMESTAMPZ,
soft_delete BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS product_images(
product_id BIGINT NOT NULL REFERENCES products(id),
image TEXT NOT NULL,
PRIMARY KEY (product_id, image)
);
"""
    cursor.execute(table_sql)
    connection.commit()
    cursor.close()

def csv_load_products(connection):
    csv_folder = "./csv"
    for file in os.listdir(csv_folder):
        if not file.endswith(".csv"):
            continue

        path = os.path.join(csv_folder, file)

        try:
            with open(path, encoding="utf-8") as f:
                filedata = csv.DictReader(f)
                if filedata:
                    insert_products(filedata, connection)
                    print(f"Succes PRODUCT: {file} imported")
        except Exception as e:
            print(f"Error in {file}: {e}")


def to_decimal(v):
    if v is None:
        return None
    if isinstance(v, str):
        v = v.strip()
        if v == "":
            return None
    try:
        return float(str(v))
    except Exception:
        return None

def insert_products(dataset, connection):
    cursor = connection.cursor()
    for row in dataset:
        price_keys = ("marketPrice", "midPrice", "highPrice", "lowPrice")

        prices = [to_decimal(row.get(key)) for key in price_keys]
        prices = [price for price in prices if price is not None]

        filter_result = product_filter(row["name"])

        if filter_result and prices:
            set_id = ...
            name = row["name"]
            type = filter_result
            description = row["extCardText"]
            price = max(prices)
            cursor.excecute("INSERT INTO products VALUES (set_id, name, type, description, price, stock) VALUES (%s, %s, %s, %s, %s)",(set_id, name, type, description, price, 20))
    


def product_filter(name: str):
    PRODUCT_NAME_KEYWORDS = [
    # Booster formats
    "booster pack",
    "sleeved booster",
    "checklane blister",
    "single blister",
    "triple blister",
    "booster bundle",
    "booster box",
    "booster display",
    "display box",
    "case",

    # Premium boxes / collections
    "collection",
    "collection box",
    "premium collection",
    "ultra-premium collection",
    "super-premium collection",
    "figure collection",
    "pin collection",
    "special collection",
    "box set",
    "battle box",
    "battle academy",

    # Tins
    "tin",
    "mini tin",

    # ETB / toolkit / stadium
    "elite trainer box",
    "etb",
    "pokemon center elite trainer box",
    "build & battle box",
    "build and battle box",
    "build & battle stadium",
    "build and battle stadium",
    "stadium",

    # Special packs / holiday
    "promo pack",
    "blister",
    "lunchbox",
    "collector chest",
    "treasure chest",
    "advent calendar",
    "holiday calendar",
    ]
    name = (name).lower()

    for key in PRODUCT_NAME_KEYWORDS:
        if key in name:
            return key
        
    return None
        
            
def run(con):
    create_table(con)
    csv_load_products(con)
    con.commit()
    con.close()
        
if __name__ == "__main__":
    con = get_connection()
    if con is False:
        print("Connection failed.")
        sys.exit(1)
    run(con)