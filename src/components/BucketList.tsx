import { useState, useEffect } from "react";
import { AddItem } from "./AddItem";
import { ItemList } from "./ItemList";
import { RandomPicker } from "./RandomPicker";
import styles from "./BucketList.module.css";

export interface BucketItem {
  id: string;
  text: string;
  category: string;
  addedBy: string;
  done: boolean;
  createdAt: number;
}

const STORAGE_KEY = "bucket-list-items";

function loadItems(): BucketItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(items: BucketItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function BucketList() {
  const [items, setItems] = useState<BucketItem[]>(loadItems);
  const [tab, setTab] = useState<"list" | "picker">("list");

  useEffect(() => {
    saveItems(items);
  }, [items]);

  function addItem(text: string, category: string, addedBy: string) {
    const newItem: BucketItem = {
      id: crypto.randomUUID(),
      text,
      category,
      addedBy,
      done: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
  }

  function toggleDone(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const pending = items.filter((i) => !i.done);
  const completed = items.filter((i) => i.done);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "list" ? styles.active : ""}`}
          onClick={() => setTab("list")}
        >
          Our List ({items.length})
        </button>
        <button
          className={`${styles.tab} ${tab === "picker" ? styles.active : ""}`}
          onClick={() => setTab("picker")}
        >
          Pick a Date!
        </button>
      </div>

      {tab === "list" ? (
        <div className={styles.listView}>
          <AddItem onAdd={addItem} />
          <ItemList
            title="To Do"
            items={pending}
            onToggle={toggleDone}
            onDelete={deleteItem}
          />
          {completed.length > 0 && (
            <ItemList
              title="Done"
              items={completed}
              onToggle={toggleDone}
              onDelete={deleteItem}
            />
          )}
        </div>
      ) : (
        <RandomPicker items={pending} />
      )}
    </div>
  );
}
