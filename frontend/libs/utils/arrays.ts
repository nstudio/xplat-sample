export function sortAlpha(collection: Array<any>, prop?: string) {
  if (collection) {
    collection.sort(function(a, b) {
      if (prop) {
        if (a[prop] < b[prop]) return -1;
        if (a[prop] > b[prop]) return 1;
      } else {
        if (a < b) return -1;
        if (a > b) return 1;
      }
      return 0;
    });
  }
  return collection;
}

export function sortByDate(collection: Array<any>, fieldName: string = 'createDate'): Array<any> {
  collection.sort(function(a, b) {
    return new Date(a[fieldName]).getTime() - new Date(b[fieldName]).getTime();
  });
  return collection;
}

/**
 * Move elements around in an array (this mutates the array passed in)
 * @param collection array to operate on
 * @param oldIndex index of element you want to move
 * @param newIndex index of where you want to move the element to
 */
export function moveItemTo(collection: Array<any>, oldIndex: number, newIndex: number) {
  if (newIndex >= collection.length) {
    var k = newIndex - collection.length;
    while (k-- + 1) {
      collection.push(undefined);
    }
  }
  collection.splice(newIndex, 0, collection.splice(oldIndex, 1)[0]);
}

// group by property
export function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
