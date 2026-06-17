import psycopg2
import sys

sys.stdout.reconfigure(encoding="utf-8")

def create_tables(connection):
    cursor = connection.cursor()
    #On deletion, delete this item if an order is deleted, restrict the deletion if product is deleted (orders regarding said product must be deleted first)
    # Mostly because of user experience, we might not sell anymore but users might still have questions about their order
    schema_sql = """
CREATE TABLE IF NOT EXISTS order_contents(
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
    amount INT NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
"""
    cursor.execute(schema_sql)
    cursor.close()


def run(connection):
    create_tables(connection)
    connection.commit()
    print(f"ordersContents.py ran succesfully.")
    return


if __name__ == "__main__":
    print("Je kan deze file niet runnen gebruik: Main.py")
