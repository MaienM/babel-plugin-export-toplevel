# babel-plugin-export-toplevel

A simple transform to automatically export all top-level names.

This is mostly useful for testing purposes, so you can have access to these names in testing while not exporting them in
other environments.

## Effect

Transforms

``` javascript
const hiddenFunction = () => {};
const publicFunction = () => {};

export default publicFunction;
```

to something akin to

``` javascript
const hiddenFunction = () => {};
const publicFunction = () => {};

export default publicFunction;
export { publicFunction, hiddenFunction };
```

## Install

``` shell
npm i --save-dev babel-plugin-export-toplevel
```

## Usage

`.babelrc`

``` json
{
  "plugins": ["export-toplevel"]
}
```
