import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- color en services
    ALTER TABLE "services"
      ADD COLUMN IF NOT EXISTS "color" varchar DEFAULT '#2f56c9';

    -- home_page_highlights
    CREATE TABLE IF NOT EXISTS "home_page_highlights" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "title"       varchar NOT NULL,
      "description" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "home_page_highlights"
        ADD CONSTRAINT "home_page_highlights_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "home_page_highlights_order_idx"
      ON "home_page_highlights" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_highlights_parent_id_idx"
      ON "home_page_highlights" USING btree ("_parent_id");

    -- about_page_values
    CREATE TABLE IF NOT EXISTS "about_page_values" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "label"      varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "about_page_values"
        ADD CONSTRAINT "about_page_values_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "about_page_values_order_idx"
      ON "about_page_values" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "about_page_values_parent_id_idx"
      ON "about_page_values" USING btree ("_parent_id");

    -- servicios_page
    CREATE TABLE IF NOT EXISTS "servicios_page" (
      "id"         serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "servicios_page_hero_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar NOT NULL,
      "label"      varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "servicios_page_hero_stats"
        ADD CONSTRAINT "servicios_page_hero_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."servicios_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "servicios_page_hero_stats_order_idx"
      ON "servicios_page_hero_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "servicios_page_hero_stats_parent_id_idx"
      ON "servicios_page_hero_stats" USING btree ("_parent_id");

    -- proyectos_page
    CREATE TABLE IF NOT EXISTS "proyectos_page" (
      "id"         serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "proyectos_page_hero_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar NOT NULL,
      "label"      varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "proyectos_page_hero_stats"
        ADD CONSTRAINT "proyectos_page_hero_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "proyectos_page_hero_stats_order_idx"
      ON "proyectos_page_hero_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "proyectos_page_hero_stats_parent_id_idx"
      ON "proyectos_page_hero_stats" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" DROP COLUMN IF EXISTS "color";
    DROP TABLE IF EXISTS "home_page_highlights";
    DROP TABLE IF EXISTS "about_page_values";
    DROP TABLE IF EXISTS "servicios_page_hero_stats";
    DROP TABLE IF EXISTS "servicios_page";
    DROP TABLE IF EXISTS "proyectos_page_hero_stats";
    DROP TABLE IF EXISTS "proyectos_page";
  `)
}
