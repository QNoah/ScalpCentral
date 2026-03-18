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

def csv_load_products(connection):
    csv_folder = "./csv"
    for file in os.listdir(csv_folder):
        if not file.endswith(".csv"):
            continue

        path = os.path.join(csv_folder, file)

        try:
            with open(path, encoding="utf-8") as f:
                dataset = csv.DictReader(f)
                if dataset:
                    insert_products(dataset, connection)
                    print(f"Succes PRODUCT: {file} imported")
                        
        except Exception as e:
            print(f"Error in {file}: {e}")

def csv_load_v2_products(connection):
    csv_folder = "./csv"
    for file in os.listdir(csv_folder):
        if not file.endswith(".csv"):
            continue

        path = os.path.join(csv_folder, file)
        try:
            with open(path, encoding="utf-8") as f:
                dataset = csv.reader(f)
                if dataset:
                    for entry in dataset:
                        print(entry[1])
        except Exception as e:
            print(e)

def insert_products(dataset, connection):
    product_list = ("", "", "", "", "", "", "", "", "")
    for row in dataset:
        if row["extRarity"]:
            continue
        
        
            
        
        
if __name__ == "__main__":
    con = get_connection()
    csv_load_v2_products(con)    