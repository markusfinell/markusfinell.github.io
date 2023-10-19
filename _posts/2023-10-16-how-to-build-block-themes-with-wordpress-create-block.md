---
layout: post
title: "How to build block themes with @wordpress/create-block"
date: 2023-10-16 07:00:00 +0200
---

The officially supported <a href="https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/" target="_blank">Create Block</a> tool is great for quickly getting up and running with block development for the WordPress block editor. But did you know it can also be used for creating block themes?

## The problem

I was getting tired of having my projects split up into a theme and one or more block plugins. I might have a PHP template part in the theme which I use in the render function of a block. Maybe there is some styling that only applies to that template part if it is located inside the block. Where do I put the relevant CSS?

Should I build all blocks without CSS or JS and put all styling and interactivity into the theme? Then I would lose the performance benefit of only loading block-specific styles on pages where that block is used.

And I just don't like jumping back and forth between different setups, running compilers in multiple different locations in the same project.

## The solution

The Create Block tool is super fast and easily modified to be able to handle much more than just a single block.

First, create a block plugin:

```
npx @wordpress/create-block@latest my-block-theme
```

You will now have a folder with the following contents:

```
build/
node_modules/
src/
  block.json
  edit.js
  editor.scss
  index.js
  save.js
  style.scss
  view.js
.editorconfig
.gitignore
my-block-theme.php
package-lock.json
package.json
readme.txt
```

By default all of the block files are in the `src` directory. Move them into a new directory `src/blocks/my-block`.

Next, delete the file `my-block-theme.php` and create the files `functions.php`, `style.css` (remember the <a href="https://developer.wordpress.org/themes/basics/main-stylesheet-style-css/" target="_blank">header</a>), `theme.json` (see the <a href="https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/" target="_blank">how-to guide</a>) and `templates/index.html`.

In `functions.php`, add the following code:

```php
function my_block_theme_register_blocks() {
  $blocks_dir = get_stylesheet_directory() . '/build/blocks';
  $src_dir = get_stylesheet_directory() . '/src/blocks';

  // Get all block directories, check for a block.json file to make sure it is in fact a block.
  $blocks = array_filter(
    array_map('basename', glob($blocks_dir . '/\*', GLOB_ONLYDIR)),
    function ($dir) use ($blocks_dir) {
      return file_exists($blocks_dir . '/' . $dir . '/block.json');
    }
  );

  array_map(
    function ($dir) use ($blocks_dir, $src_dir) {
      // Register the block!
      register_block_type($blocks_dir . '/' . $dir);

      // To make sure the block's view script is loaded in the footer, deregister it, and register it again.
      if (file_exists($blocks_dir . '/' . $dir . '/view.js')) {
        wp_deregister_script('my-block-theme-' . $dir . '-view-script');
        wp_register_script('my-block-theme-' . $dir . '-view-script', get_template_directory_uri() . '/build/blocks/' . $dir . '/view.js', [], '0.1.0', true);
      }
    },
    $blocks
  );
}
add_action('init', 'my_block_theme_register_blocks');
```

If you are using a `view.js` script in a block. Make sure to set the `viewScript` property in `block.json` to: `["file:./view.js", "my-block-theme-my-block-view-script"]`. This will make sure the script is loaded correctly.

I am not going to tell you how to structure your CSS and JS. But here is a version of what I usually do:

```
src/
  blocks/
  css/
    app.css
    global/
      reset.css
      typography.css
    ...
  js/
    main.js
```

In `app.css` I will import all other theme css files.

Now we have to extend the Webpack config to include our theme CSS and JS. Create the file `webpack.config.js` in the root of the theme. Add the following code to it (change the paths to your CSS and JS as you need):

```js
const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry(),
    style: "./src/css/app.css",
    script: "./src/js/main.js",
  },
};
```

And we're done! Run `npm start` in your theme and start coding! You now have all of your project's JS, CSS, templates and blocks in one place.

To add more blocks to your theme. Stop npm and go to the `blocks` directory in the terminal and run:

```
npx @wordpress/create-block@latest --no-plugin
```

This will guide you through the setup of a new block. Check out the <a href="https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#options">options</a> for more information.
