# Jekyll Copy

A simple command-line command for copying Jekyll template files to the current Jekyll project folder.

According to the Jekyll documentation:

> Since version 3.2 , a new Jekyll project bootstrapped with jekyll new uses gem-based themes to define the look of the site. This results in a lighter default directory structure: _layouts, _includes and _sass are stored in the theme-gem, by default.
>
> Minima is the current default theme, and `bundle show minima` will show you where minima theme's files are stored on your computer.

**Note:** The command listed in that documentation quote is actually incorrect, the Bundler team [deprecated](https://github.com/rubygems/bundler/blob/master/CHANGELOG.md#210pre1-august-28-2019) the `show` command, so the current way to do this is `bundle info minima`. You're welcome.

This created a problem for me (and many other developers, I imagine) as I regularly needed to modify template files for my Jekyll projects and could never remember where to find them. Yes, I could go to the Jekyll documentation reference shown above and type in `bundle show minima` but that's extra work and I also can't always remember what template I'm using for the project, so I'd have to look that up as well.

This module simplifies the process of copying Jekyll theme files into your current project folder so you can modify them to suit your project needs.

## Installation

To install the module, open a terminal window and execute the following command:

```shell
npm install -g jekyll-copy
```

This installs a new `jcp` command you can use to work with your project's Jekyll template files.

## Usage

The module includes two commands you can use to work with your Jekyll template files:

+ `ls` - List the contents of a Jekyll project's current template folder.
+ `cp` - Copy a Jekyll project's template file to the project folder.

