# Header navigation plugin

[Blog post](https://medium.com/@readwithai/a-header-navigation-plugin-for-the-obsidian-markdown-editor-924656446fee), [@readwithai](https://x.com/readwithai)

This is a header navigation plugin for the markdown editor called Obsidian.
This plugin lets you quickly navigate between headers and fold them.
It provides a command to toggle the folding of a header.

It is a third-party plugin and has no affiliation with the Obsidian editor.

# Installation
This plugin should is available through the "Community plugins" features of Obsidian's settings.

Alternatively, you can install it directly by:

1. Cloning the git repository into `.obsidian/plugins` in your vault
1. Running `npm install`, `npm run dev` in the repository
1. Reloading obsidian
1. Enabling the plugin in the community plugins tab of settings.

# Usage
Press `Ctrl-p` to open the command palette and search for "header nagivation".
This will show the commands that this plugin provides.

I would suggest binding these commands to hotkeys. You might find a plugin like [sequence hotkeys](https://github.com/moolmanruan/obsidian-sequence-hotkeys) useful: this allows you to define a "prefix" key such as `Ctrl-m` for motion commands so that you can then assign e.g `Ctrl-m Up` etc for moving around headers.

![demonstraction of features](demo.gif)

# Influences and related tools
This is very much influenced by the functions provided by emacs <a href="https://orgmode.org/">org-mode</a>.

This project uses the [remark](https://github.com/remarkjs/remark/) markdown parser and its source code is included (under and MIT license) within the built `main.js` file.

This plugin was based on the [obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin).

[Quiet outline](https://github.com/guopenghui/obsidian-quiet-outline) provides a sidebar tool similar to a "code browser" that allows you to perform similar motions with a mouse, and well as reorder headings.

# About me
*If you like this you might like my [repl for obsidian](https://github.com/talwrii/obsidian-repl)*

I make productivity tools and AI tools related to reading and research.
If that sounds interesting you can follow me on <a href="https://x.com/readwithai">twitter</a> or <a href="https://bsky.app/profile/readwithai.bsky.social">bluesky</a>.

I write about these topics on <a href="https://readwithai.substack.com/readwithai">substack</a>.

If you find *this* piece of software useful. Maybe give me money (like $2 dollars?) on my <a href="https://ko-fi.com/readwithai">kofi</a>.
