# Jekyll Copy

A simple command-line command for copying Jekyll template files to the current Jekyll project folder.

According to the Jekyll documentation:

> Since version 3.2 , a new Jekyll project bootstrapped with jekyll new uses gem-based themes to define the look of the site. This results in a lighter default directory structure: _layouts, _includes and _sass are stored in the theme-gem, by default.
>
> Minima is the current default theme, and `bundle show minima` will show you where minima theme's files are stored on your computer.

**Note:** The command listed in that documentation quote is actually incorrect, the Bundler team [deprecated](https://github.com/rubygems/bundler/blob/master/CHANGELOG.md#210pre1-august-28-2019) the `show` command, so the current way to do this is `bundle info minima`. You're welcome.

This created a problem for me (and many other developers, I imagine) as I regularly needed to modify template files for my Jekyll projects and could never remember where to find them. Yes, I could go to the Jekyll documentation reference shown above and type in `bundle info <template_name>` but that's extra work and I also can't always remember what template I'm using for the project, so I'd have to look that up as well.

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

Let's see them in action!

### ls

I can never remember which template folder contains which files, so I added the `ls` command to help me view template folder contents to find the file I want to copy. The command supports two forms.

To list all of the files in the template's root folder, execute the following command:

```shell
jcp ls
```

The module will read the current project's `config.yml` file to determine which Jekyll template is in play, then query the OS for the template folder location by executing `bundle info <template_name>`. When the command executes, it outputs the template root folder contents as shown below:

```text
┌────────────────────────────┐
│                            │
│   Jekyll File Copy (jcp)   │
│                            │
└────────────────────────────┘
Validating Jekyll configuration
Jekyll project uses the Minima template
Minima template folder: D:/Ruby26-x64/lib/ruby/gems/2.6.0/gems/minima-2.5.1
Command: List Folder Contents
Listing contents of D:/Ruby26-x64/lib/ruby/gems/2.6.0/gems/minima-2.5.1:

<directory> assets
<file>      LICENSE.txt
<file>      README.md
<directory> _includes
<directory> _layouts
<directory> _sass
```

You can also pass a template folder name into the command like this:

```shell
jcp ls _includes
```

In this example, the module will list all of the files in the provided folder:

```text
┌────────────────────────────┐
│                            │
│   Jekyll File Copy (jcp)   │
│                            │
└────────────────────────────┘
Validating Jekyll configuration
Jekyll project uses the Minima template
Minima template folder: D:/Ruby26-x64/lib/ruby/gems/2.6.0/gems/minima-2.5.1
Command: List Folder Contents
Listing contents of D:\Ruby26-x64\lib\ruby\gems\2.6.0\gems\minima-2.5.1\_includes:

<file>      disqus_comments.html
<file>      footer.html
<file>      google-analytics.html
<file>      head.html
<file>      header.html
<file>      icon-github.html
<file>      icon-github.svg
<file>      icon-twitter.html
<file>      icon-twitter.svg
<file>      social.html
```

### cp

Once you've used the `ls` command to identify the template file you want copied to your project folder, you copy it using the following command:

```shell
jcp cp <file_path>
```

In this example, `<file_path>` refers to the relative path pointing to the file in the template folder.

For example, using the previous `ls` examples, if I wanted to copy the template's header file to my project folder (so I could modify it for my specific needs), I would execute the following command:

```shell
jcp cp _includes/header.html
```

The module validates the project config, then copies the file while outputting the following:

```text
┌────────────────────────────┐
│                            │
│   Jekyll File Copy (jcp)   │
│                            │
└────────────────────────────┘
Validating Jekyll configuration
Jekyll project uses the Minima template
Minima template folder: D:/Ruby26-x64/lib/ruby/gems/2.6.0/gems/minima-2.5.1
Command: Copy File
Source: D:\Ruby26-x64\lib\ruby\gems\2.6.0\gems\minima-2.5.1\_includes\header.html
Destination: D:\dev\node\jekyll-copy\_includes
Creating destination folder: D:\dev\node\jekyll-copy\_includes
Copying header.html
File successfully copied
```

## Limitations

+ Does not support wildcards, `.`, and other standard file specifications
+ Cannot copy an entire folder's contents or more than one file at a time

***

You can find information on many different topics on my [personal blog](http://www.johnwargo.com). Learn about all of my publications at [John Wargo Books](http://www.johnwargobooks.com).

If you find this code useful and feel like thanking me for providing it, please consider <a href="https://www.buymeacoffee.com/johnwargo" target="_blank">Buying Me a Coffee</a>, or making a purchase from [my Amazon Wish List](https://amzn.com/w/1WI6AAUKPT5P9).
