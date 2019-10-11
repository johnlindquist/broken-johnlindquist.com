```js
const fromEvent = (eventType, target) => {
  return {
    setup: cb => {
      target.addEventListener(eventType, cb)
    },
    thru(fn){ //a method, we need `this`!
      return fn(this)
    }
  }
}

```