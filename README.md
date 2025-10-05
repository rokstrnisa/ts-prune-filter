# ts-prune-filter

A simple and configurable tool for finding unused exports in TypeScript projects.

The tool wraps [`ts-prune`](https://github.com/nadeesha/ts-prune) and filters its output using configurable pattern-matching rules.

You can specify which files and exports to ignore. See [.ts-prune.json](.ts-prune.json) for a starter configuration.

## Installation

1. Install `ts-prune` and `ts-node` as dev dependencies in your project:

```bash
npm install --save-dev ts-prune ts-node
# or
pnpm add -D ts-prune ts-node
# or
yarn add -D ts-prune ts-node
```

2. Copy [`check-unused.ts`](check-unused.ts) to your project, e.g. to `scripts/check-unused.ts`.

3. Copy [`.ts-prune.json`](.ts-prune.json) to your project's root and adapt it to your needs.

4. Add a script to your `package.json`:

```json
{
    "scripts": {
        "check-unused": "ts-node scripts/check-unused.ts"
    }
}
```

## Configuration

### `ignoreUsedInModule`

When `true`, exports marked as "used in module" by `ts-prune` are ignored.

### `rules`

An array of filtering rules. Each rule has:

- **`files`**: Array of regex patterns to match file paths.
- **`exports`**: Array of regex patterns to match export names.

If a file matches a rule's file patterns _and_ the export matches that rule's export patterns, the export is ignored.

For example, the following rule will ignore `config` and `middleware` exports in `middleware.ts`:

```json
{
    "files": ["middleware.ts"],
    "exports": ["config", "middleware"]
}
```

See [.ts-prune.json](.ts-prune.json) for a starter configuration.

## Usage

```bash
npm run check-unused
# or
pnpm check-unused
# or
yarn check-unused
```

### Exit Codes

- **0**: No unused exports found.
- **1**: Unused exports detected.

### Sample Output

```
✓ No unused exports found!
```

or

```
Found 5 potentially unused export(s):

src/utils/helper.ts:42 - unusedFunction
src/components/Old.tsx:10 - default
lib/legacy.ts:15 - deprecatedExport
lib/legacy.ts:23 - oldHelper
config/unused.ts:8 - UNUSED_CONSTANT
```

## Contributing

Found a bug or have an idea?

1. Open an issue.
2. Fork the repo, make a change on a new branch, and open a pull request.

## Credits

Built on top of [ts-prune](https://github.com/nadeesha/ts-prune) by [Nadeesha Cabral](https://github.com/nadeesha).
