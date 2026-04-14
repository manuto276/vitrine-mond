# vitrine-mond

A theme for [Vitrine](https://github.com/felixstrobel/vitrine), inspired by [Mond](https://visualskins.com/skin/mond), a theme for [Rainmeter](https://www.rainmeter.net/).

![Theme Preview](.github/assets/preview.png)

## Features

- Day of the week in large decorative type (Anurati)
- Date and time display (Fira Sans)
- Optional weather conditions via [Open-Meteo](https://open-meteo.com/) (no API key required)
- Dark and light theme

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `theme` | string | `dark` | Color scheme — `dark` or `light` |
| `showDate` | boolean | `true` | Show the day of the week and date |
| `showTime` | boolean | `true` | Show the current time |
| `showWeather` | boolean | `false` | Show current weather conditions |
| `weatherCity` | string | — | City used to fetch weather data |
| `temperatureUnit` | string | `celsius` | `celsius` or `fahrenheit` |

## Build

```sh
make install   # install dependencies (runs inside Docker, Node 20)
make build     # produce dist/ (runs inside Docker, Node 20)
```

Requires Docker.
