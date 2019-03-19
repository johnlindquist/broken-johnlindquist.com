---
slug: understanding-rxjs
title: Understanding RxJS
date: 2019-03-19 17:03
published: false
---

# Understanding RxJS

RxJS has these 4 parts:

1. callback
2. callback transformers
3. callback caller
4. startup

I like to think of it like this:

```js
//observer
const callback = value => {
  console.log(value)
}

//observable
const callbackCaller = callback => {
  callback(1)
  callback(2)
}

//map
const transform = x => x + 1

//internals
const transformCallback = (transform, callback) => {
  const newCallback = value => callback(transform(value))

  return newCallback
}
//subscribe
callbackCaller(transformCallback(transform, callback))
```
