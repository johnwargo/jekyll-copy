# Jekyll Copy

A simple command-line command for copying Jekyll template files to the current project folder.

According to the Jekyll documentation:

> Since version 3.2 , a new Jekyll project bootstrapped with jekyll new uses gem-based themes to define the look of the site. This results in a lighter default directory structure: _layouts, _includes and _sass are stored in the theme-gem, by default.
>
> minima is the current default theme, and bundle show minima will show you where minima theme's files are stored on your computer.

This created a problem for me (and many other developers, I imagine) as I regularly needed to modify template files for my Jekyll projects and could never remember where to find them. Yes, I could go to the Jekyll documentation reference shown above and type in `bundle show minima` but that's extra work and I also can't always remember what template I'm using for the project, so I'd have to look that up as well.

**Note:** The command listed in that documentation quote is actually incorrect, the Gem team is deprecating the `show` command, so the current way to do this is `gem info minima`. 