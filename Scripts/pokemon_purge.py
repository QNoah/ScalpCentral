# from __future__ import annotations

# import argparse
# import csv
# import re
# from pathlib import Path
# from typing import Dict, Optional, Tuple

# KEYWORDS = [
#     # Booster formats
#     "booster pack",
#     "sleeved booster",
#     "checklane blister",
#     "single blister",
#     "triple blister",
#     "booster bundle",
#     "booster box",
#     "booster display",
#     "display box",
#     "case",

#     # Premium boxes / collections
#     "collection",
#     "collection box",
#     "premium collection",
#     "ultra-premium collection",
#     "super-premium collection",
#     "figure collection",
#     "pin collection",
#     "special collection",
#     "box set",
#     "battle box",
#     "battle academy",

#     # Tins
#     "tin",
#     "mini tin",

#     # ETB / toolkit / stadium
#     "elite trainer box",
#     "etb",
#     "pokemon center elite trainer box",
#     "build & battle box",
#     "build and battle box",
#     "build & battle stadium",
#     "build and battle stadium",
#     "stadium",

#     # Special packs / holiday
#     "promo pack",
#     "blister",
#     "lunchbox",
#     "collector chest",
#     "treasure chest",
#     "advent calendar",
#     "holiday calendar",
#     ]

# def filter_rows(row):
#     name = str(row["name"]).lower()
#     return any(key in name for key in KEYWORDS)

# def is_digital_code_card(row: Dict[str, str]) -> bool:
#     name = (row.get("name") or "")
#     ext_card_type = (row.get("extCardType") or "")
#     ext_number = (row.get("extNumber") or "")

#     if CODE_CARD_RE.search(name):
#         return True
#     if ext_card_type.strip().lower() == "code card":
#         return True
#     if ext_number.strip().lower() == "code card":
#         return True

#     return False


# def is_probably_single_card(row: Dict[str, str]) -> bool:
#     """
#     Sealed products typically do NOT have card fields like extNumber/extRarity/extHP.
#     """
#     ext_number = (row.get("extNumber") or "").strip()
#     ext_rarity = (row.get("extRarity") or "").strip()
#     ext_card_type = (row.get("extCardType") or "").strip()
#     ext_hp = (row.get("extHP") or "").strip()
#     ext_stage = (row.get("extStage") or "").strip()

#     if looks_like_card_number(ext_number):
#         return True

#     if ext_rarity or ext_card_type or ext_hp or ext_stage:
#         return True

#     return False


# def classify_sealed_type(name: str) -> str:
#     n = name.lower()

#     if "build & battle stadium" in n or "build and battle stadium" in n:
#         return "BUILD_AND_BATTLE_STADIUM"
#     if "build & battle" in n or "build and battle" in n:
#         return "BUILD_AND_BATTLE_BOX"

#     if "elite trainer box" in n or re.search(r"\betb\b", n):
#         return "ELITE_TRAINER_BOX"

#     if "booster bundle" in n:
#         return "BOOSTER_BUNDLE"

#     if "booster box" in n or "booster display" in n or "display box" in n:
#         return "BOOSTER_BOX"

#     if "sleeved booster" in n:
#         return "SLEEVED_BOOSTER"

#     if "checklane" in n:
#         return "CHECKLANE_BLISTER"
#     if "3-pack" in n or "3 pack" in n:
#         return "THREE_PACK_BLISTER"
#     if ("blister" in n) and ("2-pack" in n or "2 pack" in n):
#         return "TWO_PACK_BLISTER"
#     if "blister" in n:
#         return "SINGLE_PACK_BLISTER"

#     if "booster pack" in n:
#         return "BOOSTER_PACK"

#     if "mini tin" in n:
#         return "MINI_TIN"
#     if " tin" in n:
#         return "TIN"

#     return "SPECIAL_COLLECTION"


# def parse_int(s: Optional[str]) -> Optional[int]:
#     if not s:
#         return None
#     s = s.strip()
#     if not s:
#         return None
#     try:
#         return int(s)
#     except ValueError:
#         return None


# def extract_boosters_mentioned(description: str) -> Optional[int]:
#     if not description:
#         return None
#     m = BOOSTER_PACKS_MENTION_RE.search(description)
#     if not m:
#         return None
#     return parse_int(m.group(1))


# def extract_units_per_case(name: str, description: str) -> Optional[int]:
#     for text in (description or "", name or ""):
#         m = UNITS_IN_CASE_RE.search(text)
#         if m:
#             return parse_int(m.group(1))
#     return None


# def is_case_product(name: str) -> bool:
#     n = name.lower()
#     return " case" in n or n.endswith("case")


# def process_file(input_csv: Path, output_csv: Path) -> Tuple[int, int]:
#     kept = 0
#     total = 0

#     with input_csv.open("r", encoding="utf-8", newline="") as fin:
#         reader = csv.DictReader(fin)
#         if not reader.fieldnames:
#             raise RuntimeError(f"Input CSV has no header row: {input_csv}")

#         out_fields = [
#             "productId",
#             "groupId",
#             "name",
#             "cleanName",
#             "sealedType",
#             "isCase",
#             "unitsPerCase",
#             "boosterPacksMentioned",
#             "imageUrl",
#             "url",
#             "marketPrice",
#             "lowPrice",
#             "midPrice",
#             "highPrice",
#             "directLowPrice",
#             "modifiedOn",
#             "extUPC",
#         ]

#         output_csv.parent.mkdir(parents=True, exist_ok=True)
#         with output_csv.open("w", encoding="utf-8", newline="") as fout:
#             writer = csv.DictWriter(fout, fieldnames=out_fields)
#             writer.writeheader()

#             for row in reader:
#                 total += 1
#                 name = row.get("name") or ""
#                 description = row.get("extCardText") or ""

#                 if not is_pack_based_sealed_name(name):
#                     continue
#                 if is_digital_code_card(row):
#                     continue
#                 if is_probably_single_card(row):
#                     continue

#                 writer.writerow(
#                     {
#                         "productId": row.get("productId"),
#                         "groupId": row.get("groupId"),
#                         "name": name,
#                         "cleanName": row.get("cleanName"),
#                         "sealedType": classify_sealed_type(name),
#                         "isCase": "true" if is_case_product(name) else "false",
#                         "unitsPerCase": extract_units_per_case(name, description) or "",
#                         "boosterPacksMentioned": extract_boosters_mentioned(description) or "",
#                         "imageUrl": row.get("imageUrl"),
#                         "url": row.get("url"),
#                         "marketPrice": row.get("marketPrice"),
#                         "lowPrice": row.get("lowPrice"),
#                         "midPrice": row.get("midPrice"),
#                         "highPrice": row.get("highPrice"),
#                         "directLowPrice": row.get("directLowPrice"),
#                         "modifiedOn": row.get("modifiedOn"),
#                         "extUPC": row.get("extUPC"),
#                     }
#                 )
#                 kept += 1

#     return total, kept


# def main() -> None:
#     parser = argparse.ArgumentParser()
#     parser.add_argument("input_csv", nargs="?", type=Path, help="Single input CSV (optional if --input-dir is used)")
#     parser.add_argument("output_csv", nargs="?", type=Path, help="Single output CSV (optional if --output-dir is used)")

#     parser.add_argument("--input-dir", type=Path, default=None, help="Folder containing CSVs to process")
#     parser.add_argument("--output-dir", type=Path, default=None, help="Folder to write sealed-clear CSVs into")
#     parser.add_argument("--glob", type=str, default="*.csv", help="Glob pattern for folder mode (default: *.csv)")
#     parser.add_argument(
#         "--skip-existing",
#         action="store_true",
#         help="In folder mode, skip output files that already exist",
#     )

#     args = parser.parse_args()

#     # Folder mode
#     if args.input_dir is not None or args.output_dir is not None:
#         if args.input_dir is None or args.output_dir is None:
#             raise SystemExit("Folder mode requires BOTH --input-dir and --output-dir.")

#         in_dir: Path = args.input_dir
#         out_dir: Path = args.output_dir

#         if not in_dir.exists() or not in_dir.is_dir():
#             raise SystemExit(f"--input-dir is not a directory: {in_dir}")

#         csv_files = sorted(in_dir.glob(args.glob))
#         if not csv_files:
#             raise SystemExit(f"No CSV files found in {in_dir} with glob {args.glob!r}")

#         print(f"Processing {len(csv_files)} CSV file(s) in {in_dir} ...")
#         grand_total = 0
#         grand_kept = 0
#         processed = 0
#         skipped = 0

#         for input_csv in csv_files:
#             output_csv = out_dir / f"{input_csv.stem}__sealed_clear.csv"

#             if args.skip_existing and output_csv.exists():
#                 skipped += 1
#                 continue

#             try:
#                 total, kept = process_file(input_csv, output_csv)
#                 processed += 1
#                 grand_total += total
#                 grand_kept += kept
#                 print(f"- {input_csv.name}: kept {kept} / {total} -> {output_csv}")
#             except Exception as e:
#                 # Keep going even if one file is weird
#                 print(f"- {input_csv.name}: ERROR: {e}")

#         print("")
#         print(f"Done. Processed: {processed}, skipped: {skipped}")
#         print(f"Total rows scanned: {grand_total}")
#         print(f"Total sealed kept:  {grand_kept}")
#         print(f"Output folder:      {out_dir}")
#         return

#     # Single-file mode
#     if args.input_csv is None or args.output_csv is None:
#         raise SystemExit("Single-file mode requires: input_csv output_csv  (or use --input-dir/--output-dir)")

#     total, kept = process_file(args.input_csv, args.output_csv)
#     print(f"Input rows:  {total}")
#     print(f"Sealed kept: {kept}")
#     print(f"Output CSV:  {args.output_csv}")


# if __name__ == "__main__":
#     main()





from __future__ import annotations
import os
import argparse
import csv
from pathlib import Path

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
    print(f"Processing 214 file(s) from ./csv ...")
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