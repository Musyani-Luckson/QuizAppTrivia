class Helper {
  constructor() {
    this.domEle = undefined;
  }
}
Helper.prototype.eventListener = function(target, event, fn, arrOfArg) {
  target.addEventListener(event, () => {
    return fn(...arrOfArg);
  });
};
Helper.prototype.OnHold = function(target, fn, arrOfArg) {
  let timeOut;
  target.addEventListener(`touchstart`, () => {
    timeOut = setTimeout(timeOutFunc, 2000);

    function timeOutFunc() {
      return fn(...arrOfArg);
    }
    this.eventListener(target, `touchend`, clearTimeout, timeOut);
  });
};
Helper.prototype.print = function(value) {
  console.log(value);
  return value;
};

Helper.prototype.getProps = function(object, propType) {
  if (!Object.prototype.hasOwnProperty.call(Object, propType)) {
    const errorMessage = `${propType} is not a valid Object method name`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return Object[propType](object);
};
Helper.prototype.cssRules = function(element, rules) {
  if (!element || !rules) {
    throw new Error("Both 'element' and 'rules' arguments are required.");
  }
  if (!Array.isArray(element)) {
    setCss(this, element, rules);
  } else {
    element.forEach(el => setCss(this, el, rules));
  }
};

function setCss(imit, element, rules) {
  Object.keys(rules).forEach(prop => {
    if (typeof rules[prop] !== "string") {
      throw new Error(`Invalid value for property '${prop}'.`);
    }
    element.style[prop] = rules[prop];
  });
}

Helper.prototype.getDom = function(attrType, attrValue, use = `default`) {
  if (use === "default") {
    if (attrType.toLowerCase() === `id`) {
      this.domEle = document.getElementById(attrValue);
    } else if (attrType.toLowerCase() === `class`) {
      this.domEle = document.getElementsByClassName(attrValue);
    }
  } else {
    // for future extra code
  }
  return this.domEle;
};
Helper.prototype.setDom = function(tagName, attrObject) {
  this.domEle = document.createElement(tagName);
  for (let key of this.getProps(attrObject, "keys")) {
    this.domEle.setAttribute(key, attrObject[key]);
  }
  return this.domEle;
};
Helper.prototype.shuffle = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
Helper.prototype.ifHas = function(arr, value) {
  let has = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == value) {
      has = true;
      break;
    }
  }
  return has;
};
Helper.prototype.getDomAttrValue = function(dom, attrName) {
  return dom[attrName];
};
Helper.prototype.setDomAttrValue = function(dom, attrName, value) {
  return (dom[attrName] = value);
};
Helper.prototype.setInnerText = function(dom, text) {
  dom.innerText = text;
};

Helper.prototype.switchItems = function(old, obj) {
  let keys = this.getProps(obj, "keys");
  if (old !== obj[keys[0]]) {
    old = obj[keys[0]];
  } else {
    old = obj[keys[1]];
  }
  return old;
};
Helper.prototype.isArr = function(arr, aSet) {
  for (const i in arr) {
    if (typeof arr[i] == "object") {
      this.notAnArray(arr[i], aSet);
    } else if (typeof arr[i] == "number") {
      aSet.add(arr[i]);
    }
  }
  return aSet;
};

Helper.prototype.empter = function(target) {
  if (target.length > 1) {
    target[0].remove();
  }
};
Helper.prototype.elementSize = function(element) {
  element = element.getBoundingClientRect();
  let height,
    width,
    size = 0;
  height = Math.ceil(element.height);
  width = Math.ceil(element.width);
  if (height > width) {
    size = width;
  } else if (width > height) {
    size = height;
  } else {
    size = (width + height) / 2;
  }
  size = Math.floor(size / 2) * 2;
  return size;
};

Helper.prototype.matrix = function(row, column) {
  let matrix = [],
    makeRow,
    product = row * column,
    bal = 0;
  for (let i = 0; i < row; i++) {
    makeRow = [];
    for (let j = 0; j < column; j++) {
      bal += 1;
      makeRow.push(bal - 1);
    }
    matrix.push(makeRow);
  }
  return matrix;
};



Helper.prototype.minMax = function(min, max, value) {
  if (value > max) {
    value = min;
  } else if (value < min) {
    value = max;
  } else {
    value = value;
  }
  return value;
};

Helper.prototype.pathNums = function(gap, start, size) {
  let arr = [start];
  for (let i = 0; i < size - 1; i++) {
    arr.push(parseInt(arr[i]) + gap);
  }
  return arr;
};

Helper.prototype.hideShowPassword = function(form, hideShowEle) {
  hideShowEle.addEventListener(`click`, () => {
    let value = hideShowEle.value;
    form.type = value;
    if (value === "password") {
      hideShowEle.value = "text";
    } else {
      hideShowEle.value = "password";
    }
    if (value == "password") {
      this.setInnerText(hideShowEle, "Show");
    } else {
      this.setInnerText(hideShowEle, "Hide");
    }
  });
};

Helper.prototype.duplicatesCounter = function(arr) {
  let count = {};
  arr.forEach(element => {
    element = element.trim()
    count[element] = (count[element] || 0) + 1;
  });
  return count;
}

Helper.prototype.getJSON = function(resorce) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.addEventListener(`readystatechange`, () => {
      if (request, request.readyState === 4 && request.status === 200) {
        let data = JSON.parse(request.responseText);
        resolve(data)
      } else if (request, request.readyState === 4) {
        reject(`404! An Error`);
      }
    })
    request.open(`GET`, resorce);
    request.send();
  });
}

Helper.prototype.localStorageUse = function(method, key, input = {}) {
  method = method.toLowerCase();
  switch (method) {
    case 'get':
      return getLocalStorageValue(key);
    case 'post':
      setLocalStorageValue(key, input);
      break;
    case 'delete':
    case 'remove':
    case 'clear':
      removeLocalStorageValue(method, key);
      break;
    default:
      console.error(`Invalid method "${method}"`);
  }
}

function getLocalStorageValue(key) {
  let value = localStorage.getItem(key);
  if (typeof value === 'string') {
    value = JSON.parse(value);
  } else {
    value = [];
    localStorage.setItem(key, JSON.stringify(value));
  }
  return value;
}

function setLocalStorageValue(key, input) {
  let value = getLocalStorageValue(key);
  value.push(input);
  localStorage.setItem(key, JSON.stringify(value));
}

function removeLocalStorageValue(method, key) {
  switch (method) {
    case 'delete':
    case 'remove':
      localStorage.removeItem(key);
      break;
    case 'clear':
      localStorage.clear();
      break;
  }
}
Helper.prototype.sortArr = function(arr) {
  const sorted = arr.slice().sort((a, b) => {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA === typeB) {
      return typeA === "string" ? a.localeCompare(b) : a - b;
    } else {
      return typeA < typeB ? -1 : 1;
    }
  });
  return sorted;
};

Helper.prototype.delay = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
Helper.prototype.customInterval = function(fn, delay) {
  let intervalId;
  const clear = () => {
    clearInterval(intervalId);
  };
  const start = () => {
    intervalId = setInterval(() => {
      fn();
    }, delay);
  };
  return {
    start,
    clear,
  };
}



Helper.prototype.calculateReadingTime = function(text, wordsPerMinute = 200, round = true) {
  // Ensure that text is not empty or undefined
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Split text into an array of words and count them
  const words = text.trim().split(/\s+/).length;

  // Calculate reading time in minutes
  const readingTimeMinutes = words / wordsPerMinute;

  // Round reading time to nearest whole number if round parameter is true (default)
  const readingTimeSeconds = round ? Math.round(readingTimeMinutes * 60) : readingTimeMinutes * 60;

  // Return reading time in seconds
  return readingTimeSeconds;
}

Helper.prototype.generateRandomColorScheme = function() {

  // Define arrays of possible color values
  const sciFiColors = ['#0B0E31', '#1F2943', '#324B6D', '#3C5E8D', '#4C7294', '#6686A0', '#7B9DB9', '#8BA8C6'];
  const aiColors = ['#00BFFF', '#1E90FF', '#00CED1', '#20B2AA', '#32CD32', '#FFD700', '#FFA500', '#FF6347'];

  // Generate random index values to select colors from each array
  const sciFiIndex = Math.floor(Math.random() * sciFiColors.length);
  const aiIndex = Math.floor(Math.random() * aiColors.length);

  // Return an object containing the selected colors
  return {
    sciFiColor: sciFiColors[sciFiIndex],
    aiColor: aiColors[aiIndex]
  };
}



export let hp = new Helper();





/*
Helper.prototype.localStorageUse = function(method, key, input = {}) {
  method = method.toLowerCase()
  switch (method) {
    case 'get':
      return getLocalStorageValue(key)
      break;
    case 'post':
      setLocalStorageValue(key, input)
      break;
    case 'delete':
    case 'remove':
    case 'clear':
      removeLocalStoragrValue(method, key)
      break
  }
}

function getLocalStorageValue(key) {
  let value = localStorage.getItem(key);
  if (value != undefined || value != null) {
    value = JSON.parse(value)
  } else {
    localStorage.setItem(key, JSON.stringify([]))
    value = JSON.parse(localStorage.getItem(key))
  }
  return value;
}

function setLocalStorageValue(key, input) {
  let value = localStorage.getItem(key);
  if (value != undefined || value != null) {
    value = JSON.parse(value)
    value.push(input)
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, JSON.stringify([]))
    value = JSON.parse(localStorage.getItem(key))
    value.push(input)
    localStorage.setItem(key, JSON.stringify(value))
  }
}

function removeLocalStoragrValue(method, key) {
  switch (method) {
    case 'delete':
    case 'remove':
      localStorage.removeItem(key)
      break;
    case 'clear':
      localStorage.clear()
      break;
  }
}
*/