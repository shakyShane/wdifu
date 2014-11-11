#wdifu

So, you want to run a CSS regression test against two commits, but without having to store the 
actual screen shots in the repo? Of course you do. What you really want is this, right?

```bash
$ wdifu <commit1> <commit2> local.dev 320px
```

##What...

Given two commit hashes, a url & a width, this tool will do the following:

* checkout the first commit
* screen grab the entire page
* checkout the second commit
* screen grab that page aswell
* do a detailed diff on all screen shots
* produce a HTML/JSON output report showing the conflicts (complete with fancy overlays and sh*t)


