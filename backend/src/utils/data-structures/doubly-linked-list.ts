/**
 * TypeScript implementation of a Doubly Linked List
 */

export interface DoublyLinkedListNode<T> {
  value: T;
  next: DoublyLinkedListNode<T> | null;
  prev: DoublyLinkedListNode<T> | null;
}

export class DoublyLinkedList<T> {
  private _head: DoublyLinkedListNode<T> | null = null;
  private _tail: DoublyLinkedListNode<T> | null = null;
  private _count = 0;

  insertLast(value: T): DoublyLinkedListNode<T> {
    const newNode: DoublyLinkedListNode<T> = {
      value,
      next: null,
      prev: this._tail,
    };

    if (this._tail) {
      this._tail.next = newNode;
      this._tail = newNode;
    } else {
      this._head = newNode;
      this._tail = newNode;
    }
    this._count++;
    return newNode;
  }

  remove(node: DoublyLinkedListNode<T>): void {
    if (node === this._head) {
      this._head = node.next;
    }
    if (node === this._tail) {
      this._tail = node.prev;
    }
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    this._count--;
  }

  forEach(cb: (node: DoublyLinkedListNode<T>) => void): void {
    let current = this._head;
    while (current) {
      cb(current);
      current = current.next;
    }
  }

  get head(): DoublyLinkedListNode<T> | null {
    return this._head;
  }

  get tail(): DoublyLinkedListNode<T> | null {
    return this._tail;
  }

  get count(): number {
    return this._count;
  }

  clear(): void {
    this._head = null;
    this._tail = null;
    this._count = 0;
  }
}
