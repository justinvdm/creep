# creep

crawls metadata in files and directories.

```sh
creep "lang == 'js' and 'fibonnaci' in tags"
```


## usage

add front matters to the files in you want to be searchable:

*a.md*:

```
---
tags:
  - rainbows
  - earthworms
---

# there are rainbows
and earthworms
```

*b.js*:

```javascript
// ---
// tags:
//   - microscopic
//   - hummingbirds
// ---

console.log('and microscopic hummingbirds');
```

then just query the front matter properties you want to be searchable:

```sh
$ creep "'microscopic' in tags or 'rainbows' in tags"  
a.md
b.js
```

creep uses [coffeescript](http://coffeescript.org/) as the query language, but alternatives can be plugged in. [lodash](http://lodash.com/) is available for queries as `_`.
