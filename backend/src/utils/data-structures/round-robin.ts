/**
 * Implementation of Round-Robin scheduling algorithm
 */

import { DoublyLinkedList, DoublyLinkedListNode } from './doubly-linked-list';

// Round-Robin types
export interface RoundRobinItem<T> {
  key: number;
  value: T;
}

/**
 * A simple round-robin implementation that cycles through items sequentially
 */
export class RoundRobin<T> {
  private _items: DoublyLinkedList<RoundRobinItem<T>>;
  private _itemNodes: Map<number, DoublyLinkedListNode<RoundRobinItem<T>>>;
  private _currentKey: number;
  private _currentTurn: DoublyLinkedListNode<RoundRobinItem<T>> | null;
  private _valueSet: Set<T>;

  constructor(values?: T[]) {
    this._items = new DoublyLinkedList<RoundRobinItem<T>>();
    this._itemNodes = new Map<number, DoublyLinkedListNode<RoundRobinItem<T>>>();
    this._currentKey = 0;
    this._currentTurn = null;
    this._valueSet = new Set<T>();

    if (Array.isArray(values)) {
      values.forEach((value) => this.add(value));
    }
  }

  /**
   * Add a new value to the round-robin rotation
   */
  add(value: T): RoundRobinItem<T> {
    const item: RoundRobinItem<T> = {
      key: this._currentKey,
      value,
    };

    const node = this._items.insertLast(item);
    this._itemNodes.set(this._currentKey++, node);
    this._valueSet.add(value);
    return node.value;
  }

  addIfNotPresent(value: T): RoundRobinItem<T> | null {
    if (this._valueSet.has(value)) {
      return null;
    }
    return this.add(value);
  }

  /**
   * Delete an item by its key
   */
  deleteByKey(key: number): boolean {
    if (!this._itemNodes.has(key)) {
      return false;
    }

    if (this._currentTurn && this._currentTurn.value.key === key) {
      this._currentTurn = this._currentTurn.next;
    }

    const node = this._itemNodes.get(key)!;
    this._valueSet.delete(node.value.value);
    this._items.remove(node);
    return this._itemNodes.delete(key);
  }

  /**
   * Delete items by matching their values against a callback
   */
  deleteByValue(cb: (value: T) => boolean): number {
    const deletedKeys: number[] = [];
    for (const [key, node] of this._itemNodes.entries()) {
      if (cb(node.value.value)) {
        this._valueSet.delete(node.value.value);
        this._items.remove(node);
        deletedKeys.push(key);
      }
    }
    for (const key of deletedKeys) {
      this._itemNodes.delete(key);
    }
    return deletedKeys.length;
  }

  /**
   * Get the next item in the rotation
   */
  next(): RoundRobinItem<T> | null {
    if (!this._items || this._items.count === 0) {
      return null;
    }

    if (this._currentTurn === null) {
      this._currentTurn = this._items.head;
    }

    const item = this._currentTurn!.value;
    this._currentTurn = this._currentTurn!.next;
    return item;
  }

  /**
   * Get the current item in the rotation
   */
  current(): RoundRobinItem<T> | null {
    return this._currentTurn?.value;
  }

  /**
   * Get the number of items in the rotation
   */
  count(): number {
    return this._items ? this._items.count : 0;
  }

  /**
   * Reset the rotation to the beginning
   */
  reset(): this {
    this._currentTurn = null;
    return this;
  }

  /**
   * Clear all items from the round-robin
   */
  clear(): this {
    this._items = new DoublyLinkedList<RoundRobinItem<T>>();
    this._itemNodes = new Map<number, DoublyLinkedListNode<RoundRobinItem<T>>>();
    this._currentKey = 0;
    this._currentTurn = null;
    return this;
  }
}
