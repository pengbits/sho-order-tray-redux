---
name: Order Tray (overlay)
collection: order
---

# Order Tray Redux

A complete re-code of the order-tray, using [React](https://facebook.github.io/react/) + [Redux](http://redux.js.org/) instead of [Backbone](http://backbonejs.org/)

[SITE-13037](https://issues.sho.com/browse/SITE-13037)

## Requirements

the Order Tray is the primary means of communicating the Showtime offering across different platforms and services. The Order Tray contains multiple 'cards' of information, specific to a provider/service, and the user can control which Cards are shown at any time.

### The Order Tray can
- be opened from any page on sho.com
- be rendered as a fixed overlay over the page _default, shown here_, or as part of the page content itself _order page_
- obscure/dim/mute the underlying page content in some way, to let User know they can't interact with the page content while the tray is open
- be collapsed by the User, revealing the page underneath
- show any number of Cards, triggered by url param/hash
- sort the Cards in a custom order, triggered by url param/hash

### The Order Tray must
- fire a pixel when opened
- be docked/fixed to viewport so controls for picking cards persist as User scrolls

### The Cards must
- be represented as standalone pages on sho.com, for accessibility/SEO purposes
- fire a pixel when opened/focused
- be auto-opened via url/hash


## Example 1: Open Tray
<a href="#/order" class="button--solid-red">Get Showtime</a>

```
<a href="#/order" class="button--solid-red">Get Showtime</a>
```

## Example 2: Open Tray with Provider Focused
<a href="#/order/provider/92" class="button--solid-red">Get Showtime with Apple</a>

```
<a href="#/order/provider/92" class="button--solid-red">Get Showtime with Apple</a>
```

## Example 3: Open Tray with Sage Code
<a href="#/order/int-default-3784" class="button--solid-red">Got Showtime?</a>

```
<a href="#/order/int-default-3784" class="button--solid-red">Got Showtime?</a>
```


## Example 4: Open Tray with Sage Code and Provider Focused
<a href="#/order/provider/92/int-default-3784" class="button--solid-red">Order with Apple</a>

```
<a href="#/order/provider/92/int-default-3784" class="button--solid-red">Order with Apple</a>
```

## Example 5: Open Tray with Theme (Simulate Optimizely experiment)

<a href="#/order/theme/8373912671" class="button--solid-red">Get Showtime A/B test</a>

```
<a href="#/order/theme/8373912671" class="button--solid-red">Get Showtime A/B test</a>
```

_this is just a way to preview the content changes that correspond to an optimizely experiment, 
which is not quite the same as testing the experiment itself. When a real experiment is running, the theme will be stored in a variable on the window object:_

```
  window.sho_variations.order_tray.theme = 8373912671;
```


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sollicitudin elit, quis blandit elit congue ac. Sed eu velit nec ipsum ornare dictum. Aenean id aliquam felis. Curabitur suscipit lectus quis lacinia ullamcorper. Nulla vitae vestibulum diam, ac blandit ipsum. Morbi congue ante et turpis blandit, sed consequat mi convallis. Pellentesque finibus lacus neque, tincidunt vulputate risus molestie at. Maecenas laoreet, dolor ut condimentum tincidunt, arcu massa porta eros, nec mattis felis massa ut quam. Maecenas pretium vitae nunc sit amet eleifend. Nam nec turpis nisi. Morbi condimentum ornare tortor vel euismod. Aliquam erat volutpat.

Duis volutpat imperdiet ex eget ornare. Aliquam quis tortor metus. Mauris euismod nisl id tortor varius iaculis. Maecenas feugiat dolor vestibulum egestas rutrum. Praesent imperdiet congue sem. Ut a arcu et ligula imperdiet aliquet. Donec mauris lacus, tincidunt nec nisl eget, accumsan suscipit lacus. Proin vel magna tempus eros feugiat elementum eu sit amet ligula. Nulla eget consectetur lacus.

Aliquam tempor velit non pharetra elementum. Sed venenatis lorem et cursus pellentesque. Vivamus aliquam ipsum lacinia sapien facilisis imperdiet. Aliquam ac suscipit dui. Fusce tincidunt neque nulla. Praesent semper eu purus in lacinia. Duis elementum, turpis interdum rhoncus aliquet, ex metus consequat eros, sed sollicitudin odio sem in est. Curabitur semper, metus nec iaculis dapibus, quam nunc finibus justo, at lobortis leo elit sed eros. Pellentesque ornare, urna vel rhoncus imperdiet, nisl purus feugiat purus, et commodo arcu odio sit amet odio. Donec sit amet ligula feugiat, luctus nulla at, pulvinar leo. Etiam feugiat sapien quis orci ultrices suscipit. Nunc tristique lacinia nibh in placerat. Sed vel lectus a risus tincidunt consequat. Duis viverra nibh sit amet nibh venenatis aliquam. Nulla metus massa, ultrices vitae ultricies at, dignissim fermentum massa.

Nam rhoncus justo quis sapien elementum, nec rhoncus velit finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed felis ante, facilisis vel rhoncus a, varius nec arcu. Vestibulum vestibulum faucibus risus, id efficitur ex. Aenean orci augue, sagittis sit amet ullamcorper a, auctor in arcu. Ut euismod sit amet dolor et volutpat. Morbi faucibus vel neque id aliquet. Etiam ornare efficitur suscipit. Vivamus vitae nunc nec justo fermentum facilisis in suscipit turpis. Morbi condimentum a odio vitae tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris fringilla justo eros, euismod laoreet ipsum laoreet quis.

Nunc vestibulum urna enim. Cras ornare nunc eu convallis blandit. Quisque tempus eros ac tortor dignissim, eget pellentesque sapien vestibulum. Proin dignissim neque vitae congue tristique. Fusce placerat euismod vestibulum. Integer a tincidunt nulla. Donec in scelerisque eros, eu blandit leo. Sed porta dolor nec turpis vestibulum pharetra. Aliquam dapibus libero ac elit malesuada posuere porttitor sed metus. Vestibulum quam purus, consequat sed tortor ut, cursus pulvinar nisi. Nunc tellus tortor, dictum sit amet dignissim nec, varius in libero. Nam maximus finibus diam, ut tincidunt est suscipit in. Vestibulum lacus nibh, vestibulum eu laoreet vitae, pharetra at elit. Sed et fringilla dolor...