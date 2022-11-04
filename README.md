# Tracky client
![tracky banner](/presentation/banner.png)

Tracky client is the frontend of the [Tracky](https://github.com/MDeLuise/tracky) service.

This repository contains android and iOS app used to connect to Tracky.

## Installation
The following are the steps in order to install the application.

### Android
* Download and install the provided `.apk` file from the `release/android` directory

### iOS
* Install the [Expo Go](https://apps.apple.com/app/id982107779) app from the App Store
* Open [this link](exp://exp.host/@null42/TrackyClient) from the Apple device to install the app in Expo Go


## Usage
### Prerequisites
The following are the prerequisites in order to run the application:
* A running instance of the [backend](https://github.com/MDeLuise/tracky)
* A generated api key

### Android
Simply run the installed application.

### iOS
Run the [Expo Go](https://apps.apple.com/app/id982107779) app, and then from that open the application.

## How to contribute
Fell free to contribute! Just a few useful information below.


This project use the Trunk-Based Development as source-control branching model. The usual workflow for contributing is the following:
1. create a new branch starting from `main` branch,
1. work on that,
1. create a pull request to merge the branch in the `main`.

Once the pull request is approved, please rebase the branch upon `main` and squash the commits before merging providing a meaningful commit message as follow:
```
Short (72 chars or less) summary

More detailed explanatory text. Wrap it to 72 characters. The blank
line separating the summary from the body is critical (unless you omit
the body entirely).

Write your commit message in the imperative: "Fix bug" and not "Fixed
bug" or "Fixes bug." This convention matches up with commit messages
generated by commands like git merge and git revert.

Further paragraphs come after blank lines.

- Bullet points are okay, too.
- Typically a hyphen or asterisk is used for the bullet, followed by a
  single space. Use a hanging indent.
```


## Future update
- [ ] Configure decimal and total digit for each target graph
- [ ] Sort targets and values
- [ ] Add stats visualization (e.g. increment respect last value, mean, ...)
- [ ] Batch removing of targets/values
- [ ] Cache targets and values
- [ ] Dark mode
- [ ] Multi users support
- [ ] Export of values
- [ ] Filter values by start/end dates
- [ ] Get last _n_ target's values
- [X] Add unit of measurement to target's values
- [X] Edit existing target
- [X] Edit values