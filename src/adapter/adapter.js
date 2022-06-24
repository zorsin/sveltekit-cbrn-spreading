import { writeFile, readFile } from 'fs/promises';
import { readPackageUp } from 'read-pkg-up';
import node from '@sveltejs/adapter-node';

export default function () {
  const adapter = node({
    out: 'build',
    precompress: true,
  });

  return {
    name: 'adapter-custom',
    async adapt(builder) {
      builder.rimraf('build');
      const { log } = builder;
      const {
        packageJson: manifest = { name: 'cbrn-spread', version: '0.0.0', dependencies: {} },
      } = (await readPackageUp()) || {};

      await adapter.adapt(builder);

      const serverFile = await readFile('src/adapter/server.js');
      await writeFile('build/server.js', serverFile);

      await writeFile(
        'build/package.json',
        JSON.stringify(
          {
            name: [manifest.name.split('/').pop(), manifest.version.replace(/\./g, '-')]
              .filter(Boolean)
              .join('_'),
            version: manifest.version,
            type: 'module',
            files: [],
            dependencies: manifest.dependencies,
          },
          null,
          2,
        ),
      );

      log.success(`Builded server to build/`);
    },
  };
}
