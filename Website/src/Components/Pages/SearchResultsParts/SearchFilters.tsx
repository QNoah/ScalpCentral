import { useState, type Dispatch, type SetStateAction } from "react";
import {
    Button,
    Checkbox,
    Collapse,
    List,
    ListItemButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

type SearchFiltersProps = {
    types: string[];
    sets: string[];
    series: string[];
    selectedTypes: string[];
    selectedSets: string[];
    selectedSeries: string[];
    minPrice: string;
    maxPrice: string;
    inStock: boolean;
    onSale: boolean;
    setSelectedTypes: Dispatch<SetStateAction<string[]>>;
    setSelectedSets: Dispatch<SetStateAction<string[]>>;
    setSelectedSeries: Dispatch<SetStateAction<string[]>>;
    setMinPrice: Dispatch<SetStateAction<string>>;
    setMaxPrice: Dispatch<SetStateAction<string>>;
    setInStock: Dispatch<SetStateAction<boolean>>;
    setOnSale: Dispatch<SetStateAction<boolean>>;
    onApply: () => void;
    onClear: () => void;
};

type FilterGroupProps = {
    title: string;
    label: string;
    items: string[];
    selectedItems: string[];
    setSelectedItems: Dispatch<SetStateAction<string[]>>;
};

function toggleFilterValue(
    value: string,
    selectedValues: string[],
    setSelectedValues: Dispatch<SetStateAction<string[]>>,
) {
    setSelectedValues(
        selectedValues.includes(value)
            ? selectedValues.filter((selectedValue) => selectedValue !== value)
            : [...selectedValues, value],
    );
}

function FilterGroup({ title, label, items, selectedItems, setSelectedItems }: FilterGroupProps) {
    const [open, setOpen] = useState(true);

    return (
        <List className="pb-8">
            <ListItemButton
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "var(--lightPokeYellow)",
                    fontWeight: "600",
                }}
                onClick={() => setOpen(!open)}
            >
                {label}: {items.length}
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open}>
                {items.map((item) => (
                    <div className="flex justify-between p-1" key={`${title}-${item}`}>
                        <h3>{item}</h3>
                        <Checkbox
                            checked={selectedItems.includes(item)}
                            sx={{ padding: 0, "&.Mui-checked": { color: "var(--lightPokeBlue)" } }}
                            size="small"
                            id={`item-${item}`}
                            name="item"
                            value={item}
                            onChange={() => toggleFilterValue(item, selectedItems, setSelectedItems)}
                        />
                    </div>
                ))}
            </Collapse>
        </List>
    );
}

export function SearchFilters({
    types,
    sets,
    series,
    selectedTypes,
    selectedSets,
    selectedSeries,
    minPrice,
    maxPrice,
    inStock,
    onSale,
    setSelectedTypes,
    setSelectedSets,
    setSelectedSeries,
    setMinPrice,
    setMaxPrice,
    setInStock,
    setOnSale,
    onApply,
    onClear,
}: SearchFiltersProps) {
    return (
        <section id="sidebar" className="flex flex-col flex-1 max-w-72 p-1">
            <h2 className="font-bold">FILTERS</h2>
            <div className="flex flex-col p-1">
                <FilterGroup
                    title="types"
                    label="TYPE"
                    items={types}
                    selectedItems={selectedTypes}
                    setSelectedItems={setSelectedTypes}
                />
                <FilterGroup
                    title="sets"
                    label="SET"
                    items={sets}
                    selectedItems={selectedSets}
                    setSelectedItems={setSelectedSets}
                />
                <FilterGroup
                    title="series"
                    label="SERIES"
                    items={series}
                    selectedItems={selectedSeries}
                    setSelectedItems={setSelectedSeries}
                />

                <p className="font-medium">MIN PRICE</p>
                <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.currentTarget.value)}
                />

                <p className="mt-4 font-medium">MAX PRICE</p>
                <input
                    type="number"
                    placeholder="-"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.currentTarget.value)}
                />

                <div className="flex justify-between p-1 mt-4">
                    <p className="font-medium">ON SALE</p>
                    <input
                        className="filter-onSale"
                        type="checkbox"
                        name="On Sale"
                        checked={onSale}
                        onChange={(event) => setOnSale(event.currentTarget.checked)}
                    />
                </div>

                <div className="flex justify-between p-1">
                    <p className="font-medium">IN STOCK</p>
                    <input
                        type="checkbox"
                        name="In Stock"
                        checked={inStock}
                        onChange={(event) => setInStock(event.currentTarget.checked)}
                    />
                </div>

                <Button
                    sx={{
                        mt: 2,
                        backgroundColor: "#F1F979",
                        color: "black",
                        flex: 1,
                    }}
                    variant="contained"
                    onClick={onApply}
                >
                    APPLY FILTERS
                </Button>
                <Button
                    sx={{
                        mt: 2,
                        backgroundColor: "#F1F979",
                        color: "black",
                        flex: 1,
                    }}
                    variant="contained"
                    onClick={onClear}
                >
                    CLEAR FILTERS
                </Button>
            </div>
        </section>
    );
}
