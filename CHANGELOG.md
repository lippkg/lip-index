# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - 2023-12-30

### Added

- Source field support for `tooth.json`.

## [0.5.0] - 2023-12-28

### Added

- Content returned by `/teeth` API now contains tooth information.

### Fixed

- Clearing stale data before updating.

### Security

- Upgrade vulnerable dependency `Octokit`.

## [0.4.0] - 2023-12-25

### Changed

- Only query repositories with `format_version` 2 for `tooth.json`.

## [0.3.0] - 2023-10-04

### Changed

- Change API definitions.

### Fixed

- Incorrect definition of stable version.

## [0.2.0] - 2023-09-09

### Changed

- Change the exposed port from `11400` to `80`.
- Optimize data model.
- Change APIs.

## [0.1.1] - 2023-09-08

### Fixed

- Problems caused by URI encoding.
- Wrong debug messages.

## [0.1.0] - 2023-09-07

### Added

- Basic functionality.

[unreleased]: https://github.com/lippkg/lip-index/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/lippkg/lip-index/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/lippkg/lip-index/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/lippkg/lip-index/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/lippkg/lip-index/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/lippkg/lip-index/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/lippkg/lip-index/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/lippkg/lip-index/releases/tag/v0.1.0
