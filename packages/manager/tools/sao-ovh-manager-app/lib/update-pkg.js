module.exports = ({ name, description, regions }) => ({
  name: `@ovh-ux/manager-${name}-app`,
  version: '0.0.0',
  private: true,
  repository: {
    type: 'git',
    url: 'git+https://github.com/ovh/manager.git',
    directory: `packages/manager/apps/${name}`,
  },
  description,
  license: 'BSD-3-Clause',
  author: 'OVH SAS',
  scripts: {
    build: 'webpack --env.production',
    dev: 'webpack-dev-server',
    'dev:watch': 'yarn run dev',
    start: `lerna exec --stream --scope='@ovh-ux/manager-${name}-app' --include-dependencies -- npm run build --if-present`,
    'start:dev': `lerna exec --stream --scope='@ovh-ux/manager-${name}-app' --include-dependencies -- npm run dev --if-present`,
    'start:watch': `lerna exec --stream --parallel --scope='@ovh-ux/manager-${name}-app' --include-dependencies -- npm run dev:watch --if-present`,
  },
  dependencies: {
    '@ovh-ux/request-tagger': '^0.1.1',
    '@ovh-ux/manager-config': '^6.5.1',
    '@ovh-ux/manager-core': '^12.0.0 || ^13.0.0',
    '@ovh-ux/manager-error-page': '^2.3.1',
    [`@ovh-ux/manager-${name}`]: '^0.0.0 || ^1.0.0',
    '@ovh-ux/manager-ng-layout-helpers': '^2.6.1',
    '@ovh-ux/ng-ovh-api-wrappers': '^5.0.0',
    '@ovh-ux/ng-ovh-http': '^5.0.0',
    '@ovh-ux/ng-ovh-request-tagger': '^1.1.7',
    '@ovh-ux/ng-ovh-sso-auth': '^4.6.3',
    '@ovh-ux/ng-ovh-swimming-poll': '^5.0.6',
    '@ovh-ux/ng-shell-tracking': '^0.2.1',
    '@ovh-ux/ng-translate-async-loader': '^2.1.5',
    '@ovh-ux/ng-ui-router-breadcrumb': '^1.1.7',
    '@ovh-ux/shell': '^1.8.1',
    '@ovh-ux/ui-kit': '^6.3.0',
    '@uirouter/angularjs': '^1.0.23',
    angular: '^1.7.5',
    'angular-aria': '^1.7.8',
    'angular-dynamic-locale': '^0.1.37',
    'angular-i18n': '^1.7.8',
    'angular-cookies': '^1.7.8',
    'angular-resource': '^1.7.8',
    'angular-sanitize': '^1.7.8',
    'angular-translate': '^2.18.1',
    'angular-translate-loader-pluggable': '^1.3.1',
    'core-js': '^3.6.5',
    jquery: '^2.1.3',
    'lodash-es': '^4.17.15',
    'ovh-api-services': '^16.0.0',
    flatpickr: '~4.6.3',
    oclazyload: '^1.1.0',
    'whatwg-fetch': '^3.5.0',
    'regenerator-runtime': '^0.13.7',
  },
  devDependencies: {
    '@ovh-ux/manager-webpack-config': '^6.1.1',
    lodash: '^4.17.15',
    glob: '^7.1.6',
    webpack: '^4.44.2',
    'webpack-merge': '^4.2.2',
  },
  regions,
});
