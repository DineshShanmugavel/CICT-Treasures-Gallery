// Parses the given source files (JSX included) and reports syntax errors.
import { transformWithOxc } from 'vite';
import { readFileSync } from 'node:fs';
let failed = 0;
for (const file of process.argv.slice(2)) {
  try {
    const result = await transformWithOxc(readFileSync(file, 'utf8'), file, { lang: file.endsWith('x') ? 'jsx' : 'js', jsx: { runtime: 'automatic' } });
    if (result.errors?.length) throw new Error(result.errors.map((e) => e.message ?? e).join('\n'));
  } catch (error) {
    failed += 1;
    console.log(`✗ ${file}\n${error.message}\n`);
  }
}
console.log(failed ? `${failed} file(s) failed` : 'all parsed');
