## Run the app
 Open the app in Chrome. Or run Chrome in Kiosk mode (see below)

### Start Chrome Kiosk
Run `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --app=http://localhost:4200` in terminal.

### Menu
Use `ESC` to open the in app menu which will let you control the app while using.

| Shortcut                  | Keys            | Comments                                                       |
| ------------------------- | --------------- | -------------------------------------------------------------- |
| Menu                      | `ESC`           |                                                                |
| Advance                   | `Space`         | Advances to next screen (start, intro, instructions, round)    |
| Select Team 1             | `←`             | Select Team 1 and makes it eligible for any actions            |
| Select Team 2             | `→`             | Select Team 2 and makes it eligible for any actions            |
| Increase Score            | `↑`             | Increases the score of the selected team by 1                  |
| Decrease Score            | `↓`             | Decreases the score of the selected team by 1                  |
| Buzzer 1                  | `Numpad 1`      | Selects and buzzes for team 1, the key can be configured       |
| Buzzer 2                  | `Numpad 2`      | Selects and buzzes for team 1, the key can be configured       |
|                           |                 |                                                                |
| Reveal Answer #           | `1-8`           | Reveals an answer on the board                                 |
| Unreveal Answer #         | `Shift`, `1-8`  | Closes an answer on the board again                            |
| Toggle Reveal All Answers | `Shift`, `A`    | Reveals all answers with an animation                          |
| Strike                    | `X`             | Gives a strike to the selected team                            |
| Unstrike                  | `Shift`, `X`    | Removes all strikes of the selected team                       |
| Credit Score              | `S`             | Gives the current score to selected team.                      |
| Uncredit Score            | `Shift`, `S`    | Decreases the selected team's score by the current score       |
| Reset                     | `R`             | Resets to no team selected and buzzered                        |
| Reset All                 | `Shift`, `R`    | Resets both teams' scores and rounds played                    |
|                           |                 |                                                                |
| Music "Game"              | `⌥`, `1`        |                                                                |
| Music "Millionaire"       | `⌥`, `2`        |                                                                |
| Music "Jazz"              | `⌥`, `3`        |                                                                |
| Playe/Pause Music         | `⌥`, `P`        |                                                                |
| Duck Music                | `⌥`, `O`        | lowers the volume until unducked again                         |
| Volume Up                 | `⌥`, `↑`        |                                                                |
| Volume Down               | `⌥`, `↓`        |                                                                |

### Key definition
Key codes can be found here:
https://www.toptal.com/developers/keycode 
Just press a key and copy `event.code` to `keyCode`.
For the sake of completeness also add a shortcut description which will appear in the menu.
`Shortcut(title: string, keys: string[])`

```
  buzzer1: {
    keyCode: "Numpad1", // Used to detect the keypress
    menuDescription: new Shorcut("Buzzer Left", ["Numpad 1"]) //Appears in the help in the menu
  }
```

