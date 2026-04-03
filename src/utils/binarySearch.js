export function getBinarySearchSteps(arr, targetName) {
  let steps = [];
  let left = 0;
  let right = arr.length - 1;
  const target = targetName.trim().toLowerCase();

  if (target === '') return [];

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midName = arr[mid].name;
    let midNameLower = midName.toLowerCase();

    let isMatch = midNameLower.startsWith(target);
    let compareRes = midNameLower.localeCompare(target);
    
    let message = "";
    if (isMatch) {
      message = `Found matching contact "${midName}" at index ${mid}!`;
    } else if (compareRes < 0) {
      message = `"${target}" is alphabetically AFTER "${midName}". Searching right half (indices ${mid + 1} to ${right}).`;
    } else {
      message = `"${target}" is alphabetically BEFORE "${midName}". Searching left half (indices ${left} to ${mid - 1}).`;
    }

    steps.push({
      left,
      right,
      mid,
      found: isMatch,
      message,
      subArray: arr.slice(left, right + 1).map(c => c.name)
    });

    if (isMatch) return steps;

    if (compareRes < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Not found
  steps.push({ 
    left: -1, 
    right: -1, 
    mid: -1, 
    found: false, 
    message: `No contact found starting with "${targetName}".`,
    subArray: [] 
  });
  return steps;
}
