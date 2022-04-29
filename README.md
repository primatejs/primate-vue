# Vue for Primate

A Primate Vue handler that can serve as an alternative to the native HTML
handler.

## Installing

```
npm install primate-vue
```

## Using

Create an SFC component in `components`, e.g. `PostIndex.vue`.

```vue
<template>
  <h1>All posts</h1>
  <div v-for="post in posts">
    <h2><a :href="`/vue/post/view/${post._id}`">{{post.title}}</a></h2>
  </div>
</template>
```

Create a route using the handler.

```js
import {router, redirect, defined} from "primate";
import vue from "primate-vue";
import Post from "../domains/Post.js";

router.get("/vue/posts", () => vue`<PostIndex posts="${Post.find()}" />`);
```

## Resources

[Primate app][primate-app] includes examples for routes and components that are
1:1 aligned with the HTML examples.


## Alternatives

See [primate-react] for the same functionality in React.

## License

BSD-3-Clause

[primate-app]: https://github.com/primatejs/primate-app
[primate-react]: https://github.com/primatejs/primate-react
