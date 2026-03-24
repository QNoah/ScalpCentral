import os
import csv

KEYWORDS = [
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
    "mini tin",
    "mini",

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

CARD_FIELDS = ["extNumber", "extRarity", "extCardType", "extHP", "extStage"]


def is_sealed(row: dict) -> bool:
    name = (row.get("name") or "").strip()
    if not name:
        return False

    n = name.lower()

    # exclude digital-only products
    if "code card" in n:
        return False

    # must look like sealed by name
    if not any(k in n for k in KEYWORDS):
        return False

    # must NOT have card attributes populated
    if any((row.get(f) or "").strip() for f in CARD_FIELDS):
        return False

    return True


def process_file(input_csv, output_csv) -> tuple[int, int]:
    total = 0
    kept = 0
    path = os.path.join("./csv", input_csv)
    outpath = os.path.join("./sealed_csv", output_csv)

    os.makedirs(os.path.dirname(outpath), exist_ok=True)

    with open(path, "r", encoding="utf-8", newline="") as file_in:
        reader = csv.DictReader(file_in)
        if not reader.fieldnames:
            raise RuntimeError(f"No header in {input_csv}")

        with open(outpath, "w", encoding="utf-8", newline="") as file_out:
            writer = csv.DictWriter(file_out, fieldnames=reader.fieldnames)
            writer.writeheader()

            for row in reader:
                total += 1
                if is_sealed(row):
                    writer.writerow(row)
                    kept += 1

    return total, kept


def main() -> None:
    print(f"Processing 214 files from ./csv ...")
    scanned = 0
    kept_total = 0
    for file in os.listdir("./csv"):
        print(file)
        out = f"{file.split(".csv")[0]}__sealed.csv"
        try:
            total, kept = process_file(file, out)
            scanned += total
            kept_total += kept
            print(f"- {file}: kept {kept}/{total} -> {out}")
        except Exception as e:
            print(f"- {file}: ERROR: {e}")

    print(f"\nDone. Rows scanned: {scanned}")
    print(f"Sealed rows kept: {kept_total}")

if __name__ == "__main__":
    main()