---
slug: rxjs-operators-made-easy
title: RxJS Operators Made Easy
date: 2019-09-24 16:09
published: false
---



## Operator Patterns

Always remember that _ALL_ Operators return an Observable and the
parameters you pass in configure that Observable.

## Creation Operators

The following is a template you can use whenever you want to make a creation operator:
```js
const creationOperatorTemplate = config => {
  const source = new Observable(observer => {
    return () => { 
      //unsubscribe logic   
    }
  })

  return source
}
```

The main thing to notice is you're creating and returning an Observable.

### of - push a single value

`of` passes in a `value`:

```js
const of = value => 
```

then sends that value through `observer.next` and completes immediately:

```js
observer.next(value) //push out one value
observer.complete() //and done
```

Full operator:

```js
const of = value => {
  const source = new Observable(observer => {
    observer.next(value) //push out one value
    observer.complete() //and done
  })

  return source
}
```

### fromEvent - push events

`fromEvent` takes the target and eventType (e.g., `document` and `"click"`)

```js
const fromEvent = (target, eventType) =>
```

Then uses `observer.next` as the event handler:

```js
const next = observer.next.bind(observer)
target.addEventListener(eventType, next)
```

Lastly, unsubscribe will remove the eventHandler:

```js
target.removeEventListener(eventType, next)
```

The full `fromEvent` operator:

```js
const fromEvent = (target, eventType) => {
  const source = new Observable(observer => {
    const next = observer.next.bind(observer)
    target.addEventListener(eventType, next)

    return () => {
      target.removeEventListener(eventType, next)
    }
  })

  return source
}
```

### interval - push an incremented number every X seconds

`interval` passes in the `delay`

```js
const interval = delay =>
```

Uses the `delay` in a `setInterval`:

```js
setInterval(callback, delay)
```

Our `setInterval` will call the `callback`, so we'll use `next` inside the `callback`
and increment an `i` just so we have a value to pass to `next` (you can pass whatever you
want to `next`, an incrementing number makes sense for an interval):

```js
let i = 0
const callback ()=> {     
  next(i++)    
}
```

Now to `unsubscribe`, we need the `id` so we can run `clearInterval`:

```js
const id = setInterval(callback, delay)

return () => {
  clearInterval(id)
}
```

The full `interval` operator:

```js
const interval = delay => {
  const source = new Observable(observer => {
    const next = observer.next.bind(observer)

    let i = 0
    const callback ()=> {     
      next(i++)    
    }

    const id = setInterval(callback, delay)

    return () => {
      clearInterval(id)
    }
  })

  return source
}
```

### merge - push values from all observables

`merge` takes in an Array of observables:

```js
const merge = (...observables) => 
```

Runs `subscribe` on all of them:

```js
observables.forEach(observable => {
  observable.subscribe(newObserver)
})
```

_But_, to `unsubscribe` from all the observables, we'll need all of their
subscriptions, so we'll need to use `map`:

```js
const subscriptions = observables.map(observable => {
  const subscription = observable.subscribe(newObserver)

  return subscription
})
```

Then we can `unsubscribe` from all of them by looping through the `subscriptions`:

```js
return () => {
  subscriptions.forEach(subscription => {
    subscription.unsubscribe()
  })
}
```

The edge-case for `merge` is that we want to wait until _all_ the observables
call `complete` before calling `complete` on the main `observer`. So we can
count the observables:

```js
let active = observables.length
```

Then decrement the count each time one of them completes. If the count is `0`, then
call the main `complete`:

```js
complete: () => {
  active--
  if (active === 0) {
    complete()
  }
}
```

```js
const merge = (...observables) => {
  const source = new Observable(observer => {
    const next = observer.next.bind(observer)
    const complete = observer.complete.bind(observer)
    const error = observer.error.bind(observer)

    let active = observables.length
    
    const subscriptions = observables.map(observable => {
      const newObserver = {
        next,
        error,
        complete: () => {
          active--
          if (active === 0) {
            complete()
          }
        }
      }

      const subscription = observable.subscribe(newObserver)

      return subscription
    })

    return () => {
      subscriptions.forEach(subscription => {
        subscription.unsubscribe()
      })
    }
  })

  return source
}
```

### combineLatest - Grab the latest value from each Observable, push them all through as an Array

We'll pass in an Array of Observables:

```js
const combineLatest = (...observables) =>
```

Subscribe to all of them and get their `subscriptions` (just like we did with `merge`):

```js
const subscriptions = observables.map((observable, i) => {
  const subscription = observable.subscribe(value => {

  })

  return subscription
})
```

Then we can create an Array of values that matches the length of the Array of Observables:

```js
const values = Array.from({ length: observables.length })
```

To wait for each Observable to emit a value, we'll fill our Array of values
with placeholder symbols:

```js
const waiting = Symbol("waiting")
const values = Array.from({ length: observables.length }).fill(waiting)
```

Then inside `next`, we'll only push to `observer.next` if all of the values no longer contain
that placeholder:

```js
values[i] = value
if (values.every(value => value !== waiting)) {
  observer.next(values)
}
```

Below is the full implementation:


```js
const combineLatest = (...observables) => {
  return new Observable(observer => {

    let values = Array.from({ length: observables.length })

    const subscriptions = observables.map((observable, i) => {
      const subscription = observable.subscribe(value => {

        values[i] = value
        if (values.every(value => value)) {
          observer.next(values)
        }
      })

      return subscription
    })

    return () => {
      subscriptions.forEach(subscription => {
        subscription.unsubscribe()
      })
    }
  })
}
```



## Transformation Operators

The following is a template for transformation operators. It's very similar to a Creation Operator,
but expects a `source` as the 2nd, curried argument so it can be used in `pipe`. Transformation Operators
concern themselves with modifying the value passed through to `observer.next`, so you end up
wrapping `observer.next` with a new `next` function:

```js
const transformOperator = config => source => {
  const newSource = new Observable(observer => {
    const next = value => {
      //redefine the `next` behavior      
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### mapTo - push a different value from the original

Example usage: Logs "hello" every click

```js
click
  .pipe(mapTo("hello"))
  .subscribe(console.log)
```

Notice that we're passing the value directly to `observer.next` and
ignoring the `originalValue`:

```js
const mapTo = value => source => {
  const newSource = new Observable(observer => {
    const next = originalValue => {//ignore the original value
      observer.next(value)
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### map - modify the original value with a transform function

Example usage: 

```js
click
  .pipe(map(event => event.x * 2))
  .subscribe(console.log)
```

In the example above, `event => event.x * 2` is our `fn`. So we'll pass the
original value, the event, into our `fn` and pass that on to our `observer.next`:

```js
const map = fn => source => {
  const newSource = new Observable(observer => {
    const next = value => {
      const transformedValue = fn(value)
      observer.next(transformedValue)
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### pluck - get a property off of the value

Example usage: 

```js
click
  .pipe(pluck("x"))
  .subscribe(console.log)
```

Pass a `key` to `pluck`, then we can grab that property off the original value:

```js
const pluck = prop => source => {
  const newSource = new Observable(observer => {
    const next = value => {
      observer.next(value[prop])
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### bufferCount - Wait until a defined amount of values come in, then call `next`

Push values into an Array. If the Array length matches the `count`, then call `observer.next`
with the Array.

```js
const bufferCount = count => source => {
  const newSource = new Observable(observer => {
    let buffer = []

    const next = value => {
      buffer.push(value)
      if(buffer.length === count){
        observer.next(buffer)
        buffer = []
      }
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

#### Endnote: A `subscriber` is an `observer`

When you invoke `subscribe` with your `observer`,  [RxJS passes your `observer` to a `toSubscriber` helper](https://github.com/ReactiveX/rxjs/blob/master/src/internal/Observable.ts#L211)
and wraps the `observer` with a `subscriber`.

```js
//When you do this
.subscribe(observer)
//RxJS does this under the hood
sink = new Subscriber(observer)
```

I'll talk more about Subscribers in future posts, but for the purposes of this post,
I'll used name `observer` everywhere (remember, a `subscriber` is an `observer`). For teaching purposes, 
I think it's easier to grok that an `Observable` pushes to `observers`. You might disagree with my choice 🤷‍♂️ 
