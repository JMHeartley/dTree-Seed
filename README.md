<h1 align="center">
  🌳 dTree-Seed 🌰
</h1>

<p align="center">
  <i>
    A library for converting a list of objects into a hierarchical data structure for 
    <a href="https://github.com/ErikGartner/dTree">dTree.</a>
  </i>
</p>

<p align="center">
  <a href="#ℹ%EF%B8%8F-about">About</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-requirements">Requirements</a> •
  <a href="#-usage">Usage</a> •
  <a href="#%EF%B8%8F-acknowledgements">Acknowledgements</a> •
  <a href="#-technologies-used">Technologies Used</a> •
  <a href="#-license">License</a>
</p>

<p align="center">
  <a href="/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/jmheartley/dtree-seed?color=red" alt="MIT License">
  </a>
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/jmheartley/dtree-seed?color=orange">
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/jmheartley/dtree-seed?color=yellow">
  <img alt="Lines of code" src="https://img.shields.io/badge/total%20lines-4.4k-brightgreen">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/jmheartley/dtree-seed">
  <img alt="NPM version" src="https://img.shields.io/npm/v/dtree-seed?color=blueviolet">
</p>



## ℹ️ About
Structuring data for dTree is hard... but not anymore! Painlessly, with just one method call, you can:
+ Filter data for the following objects:
  + Target
  + Target's parents
  + Target's siblings (that share both parents)
  + Target's children (where target is listed a parent)
  + Target's spouses (where listed as other parent of a child)
  + Target's descendents (grandchildren, children's spouses, great-grandchildren, etc.)
+ Dynamically set CSS classes and custom render data for each node
+ Return a hierarchical data structure, [formatted as specified by dTree's README](https://github.com/ErikGartner/dTree#usage)

**Before**
```javascript
[
    {
        "id": 0,
        "name": "Father",
        "parent1Id": null,
        "parent2Id": null
    },
    {
        "id": 1,
        "name": "Mother",
        "parent1Id": null,
        "parent2Id": null
    },
    {
        "id": 2,
        "name": "Child",
        "parent1Id": 0,
        "parent2Id": 1
    }
]
```
**After**
```javascript
[
  {
    "id": 0,
    "name": "Father",
    "depthOffset": 1,
    "marriages": [{
      "spouse": {
        "id": 1,
        "name": "Mother",
        "depthOffset": 1
      },
      "children": [{
        "id": 2,
        "name": "Child",
        "depthOffset": 2
      }]
    }],
    "extra": {}
  }
]
```



## 🚗 Demo
Check out how dTree-Seed can be used to recreate the dTree sample on [JSFiddle](https://jsfiddle.net/heartleyjm/zw1ukt60/25/).



## 📦 Installation
There are a few ways to start working with dTree-Seed, all of which globally expose the `dSeeder` variable:
1. Manually download the compiled file `dSeeder.js` from [dist](/dist) to your appropriate project folder and load using a relative path:
```html
<script src="/path/to/dSeeder.js"></script>
```
2. Use `<script>` to reference the code through [jsDelivr's CDN](https://www.jsdelivr.com/package/npm/dtree-seed):
```html
<script src="https://cdn.jsdelivr.net/npm/dtree-seed@1.0.0/dist/dSeeder.min.js"></script>
```
3. Install as a [package via npm](https://www.npmjs.com/package/dtree-seed) with the following command:
```bash
npm install dtree-seed
```



## ⛽ Requirements
dTree-Seed has no dependencies itself as it's just a data processor. However, it's intended for use with [dTree](https://github.com/ErikGartner/dTree) v2.4.1, which requires the following:
```html
<!-- required for dTree -->
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js"></script>
<!-- load dTree -->
<script src="https://cdn.jsdelivr.net/npm/d3-dtree@2.4.1/dist/dTree.min.js"></script>
```


## 🚘 Usage
To preprocess your data for dTree, use the `dSeeder.seed()` command:
```javascript
seededData = dSeeder.seed(data, targetId, options);
dTree.init(seededData);   // command provided by dTree
```



### 💾 Data
The `data` object should be an array of objects, each of which should have these properties:
```javascript
[{
        id: number,
        parent1Id: number, // use null for no value
        parent2Id: number  // use null for no value
}]
```



**Note**: if `parent1Id` or `parent2Id` references an `id`, but no object in `data` 
contains that `id`, an error will be thrown. In such cases, please set that property to `null`.

*See [Member](/src/member.ts) for the Typescript interface for objects in data.*



### 🎯 TargetId
The `targetId` is the `id` of the object you wish to build your tree around. 



### 🤔 Options
Add [callbacks](https://www.freecodecamp.org/news/what-is-a-callback-function-in-javascript/) 
to the `options` object to dyanmically set the corresponding `class`, `textClass`, and `extra` 
properties for each node.

Each callback takes a `member` object, which is an object in your data.
```javascript
{
    class: (member) => string,      // sets CSS class of each node
    textClass: (member) => string,  // sets CSS class of text in each node
    extra: (member) => object       // sets extra object, custom data for renders
}
```
`options` is an optional parameter, when no callbacks are used, `class` and ` textClass` 
will default to an empty string and `extra` to an empty object for each node.

*See [SeederOptions](/src/seederOptions.ts) for its Typescript interface.*

<details>
<summary>💡 Examples</summary>

#### class
If your objects have an `ageInYears` property that cooresponds with a 
CSS class named `minor` for people younger than 18, 
you can conditionally set the CSS of the node using the `class` callback:
```javascript
{
    class: (member) => {
        if (member.ageInYears < 18)
            return "minor";
    }
}
```

#### textClass
If you want to set the same CSS class `fw-bold` for all node text, 
return a static value using the `textClass` callback:
```javascript
{
  textClass: (member) => "fw-bold"
}
```

#### extra
If you have properties on each `member` you want to persist on each node in the tree,
you can pass them into an object using `extra` callback:
```javascript
{
  extra: (member) => {
    return {
      height: member.height,
      ageInYears: member.ageInYears,
      favoriteColor: member.favoriteColor
    };
  }
}
```
The `extra` object is passed to [dTree's callbacks](https://github.com/ErikGartner/dTree#callbacks)
, the above properties would accessbile on the `extra` parameter using `extra.height`, `extra.ageInYears`, and `extra.favoriteColor`.

For the above examples, here's what the `data` might look like:
```javascript
[{
        id: 0,
        parent1Id: null,
        parent2Id: null,
        name: "Father",
        ageInYears: 26,
        height: "5ft 9in"
        favoriteColor: "Green"
},
{
        id: 1,
        parent1Id: null,
        parent2Id: null,
        name: "Mother",
        ageInYears: 24,
        height: "5ft 6in",
        favoriteColor: "Blue"
},
{
        id: 2,
        parent1Id: 0,
        parent2Id: 1,
        name: "Child",
        ageInYears: 1,
        height: "2ft 5in",
        favoriteColor: null
}];
```

*For more examples on how to use the options object, check out [its unit tests](/src/tests/seederTest.ts#L782).*
</details>



## ❤️ Acknowledgements
🧙🏻 [Erik Gärtner](https://github.com/ErikGartner) for writing and sharing dTree

👩🏿‍🏫 [Microsoft Learn](https://learn.microsoft.com/en-us/training/paths/build-javascript-applications-typescript/) 
for [teaching me Typescript](https://learn.microsoft.com/en-us/training/achievements/learn.language.build-javascript-applications-typescript.trophy?username=JMHeartley)



## 👩‍💻 Technologies Used
+ [Typescript](https://www.typescriptlang.org/) - Javascript superset
+ [Mochajs](https://mochajs.org/) - testing framework
+ [Chaijs](https://www.chaijs.com/) - assertion library
+ [VSCode](https://code.visualstudio.com/) - code editor



## 📃 License
[The MIT License (MIT)](/LICENSE)

Copyright (c) 2022 Justin M Heartley
