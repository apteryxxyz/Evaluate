'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20230428151823 extends Migration {

  async up() {
    this.addSql('create table `paste` (`id` text not null, `edit_code` text not null, `lifetime` integer not null default -1, `created_at` datetime not null, primary key (`id`));');

    this.addSql('create table `statistics` (`id` text not null, `used_languages` text not null, `command_count` integer not null default 0, `evaluator_count` integer not null default 0, `capture_count` integer not null default 0, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`));');
  }

}
exports.Migration20230428151823 = Migration20230428151823;
