# Code Tables

Code tables will align tab characters on subsequent lines to create tables.

In other words, code like this (`␉` is a tab character):

```csharp
var arr = [␉1,␉2,␉3,␉4,
␉5,␉6,␉7,␉8 ]

  #␉comment␉here␉above
  text =␉'one',␉'another one',␉'last',
␉'just kidding',␉'haha',␉'done for real';
```

Will be rendered like this:

```csharp
var arr = [ 1, 2, 3, 4,
            5, 6, 7, 8 ]

  #      comment         here           above
  text = 'one',          'another one', 'last',
         'just kidding', 'haha',        'done for real';
```

## Known Issues

Currently, vscode does not put in tab characters by default. I will probably include a shortcut or something to input tabs

## Release Notes

### 0.1.0

Tabs are rendered into tables correctly.
