import * as migration_20260621_043659_initial_production_schema from './20260621_043659_initial_production_schema';
import * as migration_20260629_184210_add_site_settings from './20260629_184210_add_site_settings';

export const migrations = [
  {
    up: migration_20260621_043659_initial_production_schema.up,
    down: migration_20260621_043659_initial_production_schema.down,
    name: '20260621_043659_initial_production_schema',
  },
  {
    up: migration_20260629_184210_add_site_settings.up,
    down: migration_20260629_184210_add_site_settings.down,
    name: '20260629_184210_add_site_settings'
  },
];
