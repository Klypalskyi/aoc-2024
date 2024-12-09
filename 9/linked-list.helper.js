exports.createListNode = (data, next = null) => ({ data, next });
exports.appendNode = (head, data) => {
  if (!head) {
    return this.createListNode(data);
  }

  let current = head;
  while (current.next !== null) {
    current = current.next;
  }
  current.next = this.createListNode(data);
  return head;
};

exports.arrayToLinkedList = (arr) => {
  let head = null;
  arr.forEach((data) => {
    head = this.appendNode(head, data);
  });
  return head;
};

exports.linkedListToArray = (head) => {
  const arr = [];
  let current = head;
  while (current !== null) {
    arr.push(current.data);
    current = current.next;
  }
  return arr;
};