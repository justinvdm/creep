# creep

crawls metadata in files and directories.

```sh
$ creep "'microscopic' in tags or 'rainbows' in tags"  
a.md
b.js
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

creep uses [coffeescript](http://coffeescript.org/) as the query language, but alternatives can be plugged in. [lodash](http://lodash.com/) is available in queries as `_`.

creep looks for the first of the following metadata files in the directories it crawls, recursively merging the metadata into child directory and file metadata:

  - `.creep.yml`
  - `.creep.yaml`
  - `creep.yml`
  - `creep.yaml`
  - `.creep.json`
  - `creep.json`

## config
creep's uses the config defaults given in [`creep.config`](src/config.js), then merges these defaults with the first of these configs that it finds:

  - `./.creep.yaml`
  - `./.creep.json`
  - `$HOME/.creep.yaml`
  - `$HOME/.creep.json`
