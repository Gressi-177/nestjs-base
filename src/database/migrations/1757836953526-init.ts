/* eslint-disable no-console */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1757836953526 implements MigrationInterface {
  name = 'Init1757836953526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create all tables first
    await queryRunner.query(`
            CREATE TABLE "augments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "apiName" character varying(255) NOT NULL,
                "tftSetId" uuid NOT NULL,
                "icon" character varying(500),
                "texture" character varying(255),
                "type" character varying(50),
                "isUnique" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_1e625a6748e1f0d981066669701" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_2063564913e673a7f9c09e2923" ON "augments" ("apiName", "tftSetId")
        `);
    await queryRunner.query(`
            CREATE TABLE "languages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "code" character varying(10) NOT NULL,
                "name" character varying(100) NOT NULL,
                "nativeName" character varying(100) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_7397752718d1c9eb873722ec9b2" UNIQUE ("code"),
                CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "encounter_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "encounterId" uuid NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "name" character varying(255) NOT NULL,
                "encounterRulesText" text,
                CONSTRAINT "PK_5d77eabd491d1d7d82efca3c232" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_f0056594f1156ae1c876a03e62" ON "encounter_translations" ("encounterId", "languageCode")
        `);
    await queryRunner.query(`
            CREATE TABLE "encounters" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "apiName" character varying(255) NOT NULL,
                "tftSetId" uuid NOT NULL,
                "championSkin" character varying(255),
                CONSTRAINT "PK_b2e596be58aabc4ccc8f8458b53" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_9cbe31f86e6644f204b38e60cd" ON "encounters" ("apiName", "tftSetId")
        `);
    await queryRunner.query(`
            CREATE TABLE "items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "apiName" character varying(255) NOT NULL,
                "tftSetId" uuid NOT NULL,
                "icon" character varying(500),
                "isUnique" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_6deed8c1e8e558148628232941" ON "items" ("apiName", "tftSetId")
        `);
    await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "apiName" character varying(255) NOT NULL,
                "tftSetId" uuid NOT NULL,
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_cd07ca01b2b26b8d8bf42c60b9" ON "roles" ("apiName", "tftSetId")
        `);
    await queryRunner.query(`
            CREATE TABLE "traits" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "apiName" character varying(255) NOT NULL,
                "tftSetId" uuid NOT NULL,
                "icon" character varying(500),
                CONSTRAINT "PK_3956071aa0a8eb8210aa1c6a563" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_8df6011ce0f47a2716aa15fcf2" ON "traits" ("apiName", "tftSetId")
        `);
    await queryRunner.query(`
            CREATE TABLE "tft_sets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "setVersion" character varying(20) NOT NULL,
                "displayName" character varying(100) NOT NULL,
                "viApiUrl" character varying(500) NOT NULL,
                "enApiUrl" character varying(500) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "lastSyncAt" TIMESTAMP,
                "syncStatus" text,
                CONSTRAINT "UQ_d77c3c4d317459970f7aa0dc8cf" UNIQUE ("setVersion"),
                CONSTRAINT "PK_9310ea4a6d293b152d33276f1e1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_d77c3c4d317459970f7aa0dc8c" ON "tft_sets" ("setVersion")
        `);
    await queryRunner.query(`
            CREATE TABLE "units" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "apiName" character varying(255) NOT NULL,
                "tftSetId" uuid NOT NULL,
                "characterName" character varying(255),
                "cost" integer NOT NULL,
                "icon" character varying(500),
                "squareIcon" character varying(500),
                "tileIcon" character varying(500),
                "role" character varying(100),
                CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e5657b4fc9329c40ced6b9e028" ON "units" ("apiName", "tftSetId")
        `);
    await queryRunner.query(`
            CREATE TABLE "unit_stats" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "unitId" uuid NOT NULL,
                "armor" numeric(10, 2),
                "attackSpeed" numeric(10, 2),
                "critChance" numeric(10, 2),
                "critMultiplier" numeric(10, 2),
                "damage" numeric(10, 2),
                "hp" numeric(10, 2),
                "initialMana" numeric(10, 2),
                "magicResist" numeric(10, 2),
                "mana" numeric(10, 2),
                "range" numeric(10, 2),
                CONSTRAINT "REL_f8f8a4102a181dff9ee05f4452" UNIQUE ("unitId"),
                CONSTRAINT "PK_a197ca4f4d7e0bee5687cf772f9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "unit_traits" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "unitId" uuid NOT NULL,
                "traitId" uuid NOT NULL,
                CONSTRAINT "PK_14d57898993e1c34ebd076307aa" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_1896a690716befa47c1e247c5a" ON "unit_traits" ("unitId", "traitId")
        `);
    await queryRunner.query(`
            CREATE TABLE "unit_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "unitId" uuid NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "name" character varying(255) NOT NULL,
                CONSTRAINT "PK_5019a13c7bafd3fcb370c1bb7e4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_05c13a5a2595c33332dcb5a801" ON "unit_translations" ("languageCode", "name")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_4e2c447f92732111f8ba2dc406" ON "unit_translations" ("unitId", "languageCode")
        `);
    await queryRunner.query(`
            CREATE TABLE "unit_abilities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "unitId" uuid NOT NULL,
                "icon" character varying(500),
                CONSTRAINT "REL_a2167452516c6f1596b3346c53" UNIQUE ("unitId"),
                CONSTRAINT "PK_094220f2d3a21ee353e8638373d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "unit_ability_variables" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "abilityId" uuid NOT NULL,
                "variableName" character varying(100) NOT NULL,
                "level1Value" numeric(15, 8),
                "level2Value" numeric(15, 8),
                "level3Value" numeric(15, 8),
                CONSTRAINT "PK_0ed65ccbb7f2f04dac42291c72f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_2fb55621419b92338d343af5ea" ON "unit_ability_variables" ("abilityId", "variableName")
        `);
    await queryRunner.query(`
            CREATE TABLE "unit_ability_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "abilityId" uuid NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                CONSTRAINT "PK_e8276e750fd2b566acf27ac7ec6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_feaa7d5738a0fe42e3bf0e7c55" ON "unit_ability_translations" ("abilityId", "languageCode")
        `);
    await queryRunner.query(`
            CREATE TABLE "trait_units" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "traitId" uuid NOT NULL,
                "unitId" uuid NOT NULL,
                "unitCost" integer NOT NULL,
                CONSTRAINT "PK_8e8bde443d61f4796d15d1b0b77" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_971f10b00ea2695a1fa9f96646" ON "trait_units" ("traitId", "unitId")
        `);
    await queryRunner.query(`
            CREATE TABLE "trait_effects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "traitId" uuid NOT NULL,
                "minUnits" integer NOT NULL,
                "maxUnits" integer NOT NULL,
                "style" integer,
                CONSTRAINT "PK_0857a0ba24008caf8a8f3fd246e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_3385184e8974cd8d1faa9d578d" ON "trait_effects" ("traitId", "minUnits")
        `);
    await queryRunner.query(`
            CREATE TABLE "trait_effect_variables" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "traitEffectId" uuid NOT NULL,
                "variableKey" character varying(100) NOT NULL,
                "variableValue" numeric(15, 8) NOT NULL,
                CONSTRAINT "PK_b9ff971590309d77fe63efe0a88" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_bd380360ce9cd87a74cc2905fd" ON "trait_effect_variables" ("traitEffectId", "variableKey")
        `);
    await queryRunner.query(`
            CREATE TABLE "role_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "roleId" uuid NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                CONSTRAINT "PK_d4b291a34e4535e472c6c42500a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_f1413ac3756373fb7bca4ede93" ON "role_translations" ("roleId", "languageCode")
        `);
    await queryRunner.query(`
            CREATE TABLE "role_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "roleId" uuid NOT NULL,
                "itemId" uuid NOT NULL,
                "recommendationOrder" integer,
                CONSTRAINT "PK_60cbbdf5952a05f61d738fdc880" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_8245a354791da4c38838415d3a" ON "role_items" ("roleId", "itemId")
        `);
    await queryRunner.query(`
            CREATE TABLE "trait_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "traitId" uuid NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                CONSTRAINT "PK_347fa975f3ff3afdd0e934afbf6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0f93a86fe03064428bde7e81eb" ON "trait_translations" ("languageCode", "name")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_7557227bb3512f55b1e215890f" ON "trait_translations" ("traitId", "languageCode")
        `);
    await queryRunner.query(`
            CREATE TABLE "item_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "itemId" uuid NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                CONSTRAINT "PK_aa0ebb87949cfad7216c74bd2b2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_506c6eb31793c7260f1cf64caa" ON "item_translations" ("languageCode", "name")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_8934539471a9856f038fa4541d" ON "item_translations" ("itemId", "languageCode")
        `);
    await queryRunner.query(`
            CREATE TABLE "item_traits" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "itemId" uuid NOT NULL,
                "traitId" uuid NOT NULL,
                "isIncompatible" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_05000f1c5a15ed75696d7e8002b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_22e2f519814a079aab350144b3" ON "item_traits" ("itemId", "traitId")
        `);
    await queryRunner.query(`
            CREATE TABLE "item_compositions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "itemId" uuid NOT NULL,
                "componentApiName" character varying(255) NOT NULL,
                "position" integer NOT NULL,
                CONSTRAINT "PK_390a35c29be1e236d500271471c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_999c74fda1fe09183e77bbfa55" ON "item_compositions" ("itemId", "position")
        `);
    await queryRunner.query(`
            CREATE TABLE "item_tags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "itemId" uuid NOT NULL,
                "tag" character varying(100) NOT NULL,
                CONSTRAINT "PK_bdc3f2833142bfd6d43fefc6bbc" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_4a3498cfa5c4a0c1033ce3535c" ON "item_tags" ("itemId", "tag")
        `);
    await queryRunner.query(`
            CREATE TABLE "item_effects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "itemId" uuid NOT NULL,
                "effectKey" character varying(100) NOT NULL,
                "effectValue" numeric(15, 8) NOT NULL,
                CONSTRAINT "PK_efd50007627230a271148ed9eef" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_18728f43dd5afb894778ce0ffd" ON "item_effects" ("itemId", "effectKey")
        `);
    await queryRunner.query(`
            CREATE TABLE "extra_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "translationKey" character varying(255) NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "value" text NOT NULL,
                CONSTRAINT "PK_e768207e001820f9f89b5044027" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_44f412616aceeeb48e2b05a001" ON "extra_translations" ("languageCode", "translationKey")
        `);
    await queryRunner.query(`
            CREATE TABLE "augment_translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "augmentId" uuid NOT NULL,
                "languageCode" character varying(10) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                CONSTRAINT "PK_f4dcf7e840b13c54e1e2e6e1ea5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_fcdf5cc11ef1671b509a2f6769" ON "augment_translations" ("languageCode", "name")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_21cd1a682e9ad9562aaf2e0f3d" ON "augment_translations" ("augmentId", "languageCode")
        `);
    await queryRunner.query(`
            CREATE TABLE "augment_traits" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "augmentId" uuid NOT NULL,
                "traitId" uuid NOT NULL,
                CONSTRAINT "PK_6f122fffba6ed05051996e77922" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_96ca4c56c05975f57762dee955" ON "augment_traits" ("augmentId", "traitId")
        `);
    await queryRunner.query(`
            CREATE TABLE "augment_tags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "augmentId" uuid NOT NULL,
                "tag" character varying(100) NOT NULL,
                CONSTRAINT "PK_e868ce9c3d9a7ef36fc3c5a2d7e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_908f72fac4dcecb0ccf8b0c726" ON "augment_tags" ("augmentId", "tag")
        `);
    await queryRunner.query(`
            CREATE TABLE "augment_effects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "augmentId" uuid NOT NULL,
                "effectKey" character varying(100) NOT NULL,
                "effectValue" numeric(15, 8) NOT NULL,
                CONSTRAINT "PK_adbc7955cf4276ddad37fade710" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_00964f30cd882b43c64161462b" ON "augment_effects" ("augmentId", "effectKey")
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "email" character varying NOT NULL,
                "firstName" character varying,
                "lastName" character varying,
                "password" character varying NOT NULL,
                "isEmailVerified" boolean NOT NULL DEFAULT false,
                "picture" character varying,
                "googleId" character varying,
                "refreshToken" character varying,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "augments"
            ADD CONSTRAINT "FK_174f84bcc517482b014a103d9df" FOREIGN KEY ("tftSetId") REFERENCES "tft_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "encounter_translations"
            ADD CONSTRAINT "FK_ef8c87834d6c45ed7b45bff686d" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "encounter_translations"
            ADD CONSTRAINT "FK_26f9915c81ec0a76b80811a5e43" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "encounters"
            ADD CONSTRAINT "FK_bf8c2087b6b4370b2e826735574" FOREIGN KEY ("tftSetId") REFERENCES "tft_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ADD CONSTRAINT "FK_6395ddc3737213cfb3c787d79a0" FOREIGN KEY ("tftSetId") REFERENCES "tft_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "roles"
            ADD CONSTRAINT "FK_f88211318016b84cb0df7c139f1" FOREIGN KEY ("tftSetId") REFERENCES "tft_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "traits"
            ADD CONSTRAINT "FK_64540fe9a1753b865609fb108cb" FOREIGN KEY ("tftSetId") REFERENCES "tft_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "units"
            ADD CONSTRAINT "FK_bd3339c523b5ef6436ebfb5f290" FOREIGN KEY ("tftSetId") REFERENCES "tft_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_stats"
            ADD CONSTRAINT "FK_f8f8a4102a181dff9ee05f4452d" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_traits"
            ADD CONSTRAINT "FK_635adb909666a0661525af57728" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_traits"
            ADD CONSTRAINT "FK_4d26e6b45f9e9e2ba3bde900031" FOREIGN KEY ("traitId") REFERENCES "traits"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_translations"
            ADD CONSTRAINT "FK_f801b1135bfb460d3355d5669d0" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_translations"
            ADD CONSTRAINT "FK_70aca0feaaa31a03834b650ce20" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_abilities"
            ADD CONSTRAINT "FK_a2167452516c6f1596b3346c53f" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_ability_variables"
            ADD CONSTRAINT "FK_eb274971ede94891e3fa37f4621" FOREIGN KEY ("abilityId") REFERENCES "unit_abilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_ability_translations"
            ADD CONSTRAINT "FK_d67b5dda5650676e332eabf5551" FOREIGN KEY ("abilityId") REFERENCES "unit_abilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_ability_translations"
            ADD CONSTRAINT "FK_0fb4b803beffbdb9889a5fd654b" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_units"
            ADD CONSTRAINT "FK_6bc5a5e8abcfef2f0c8a0239598" FOREIGN KEY ("traitId") REFERENCES "traits"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_units"
            ADD CONSTRAINT "FK_26efdcc85d86bc043dbe449e3cd" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_effects"
            ADD CONSTRAINT "FK_e41f21ab20082fd128b72edb701" FOREIGN KEY ("traitId") REFERENCES "traits"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_effect_variables"
            ADD CONSTRAINT "FK_975c2810d2c356fcf037834bbf4" FOREIGN KEY ("traitEffectId") REFERENCES "trait_effects"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role_translations"
            ADD CONSTRAINT "FK_2cc794066a952f1f36ec4445cd3" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role_translations"
            ADD CONSTRAINT "FK_09136ccf64b6ba21520b5aa2366" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role_items"
            ADD CONSTRAINT "FK_2d5aa38a24009b30736d42f8ed0" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role_items"
            ADD CONSTRAINT "FK_417ab193b82cd239f26e7045c98" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_translations"
            ADD CONSTRAINT "FK_224477ef0769ca1630ac5ac36d2" FOREIGN KEY ("traitId") REFERENCES "traits"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_translations"
            ADD CONSTRAINT "FK_9c308b7107c9e38e4e0baa278e5" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "item_translations"
            ADD CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "item_translations"
            ADD CONSTRAINT "FK_bb7d903bccc6ee8045b4977b72e" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "item_traits"
            ADD CONSTRAINT "FK_9b1376988ae278ffe14c7332cfd" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "item_traits"
            ADD CONSTRAINT "FK_a6b4d5389aa99dbf85a18d0e11a" FOREIGN KEY ("traitId") REFERENCES "traits"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "item_compositions"
            ADD CONSTRAINT "FK_23797a13e73ca6b972caac863c8" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "item_tags"
            ADD CONSTRAINT "FK_3ab057a60bc8b2697356a1f294b" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "item_effects"
            ADD CONSTRAINT "FK_8b12f2a0d86086e6392a316c942" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "extra_translations"
            ADD CONSTRAINT "FK_769cecd3a924db99bf86c95c48c" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_translations"
            ADD CONSTRAINT "FK_5d2f136568c7026d83f6e5c2d4d" FOREIGN KEY ("augmentId") REFERENCES "augments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_translations"
            ADD CONSTRAINT "FK_bc061057fd4bc760a82f1d480bb" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_traits"
            ADD CONSTRAINT "FK_90bc29fbaf52f8b2f00da03ec45" FOREIGN KEY ("augmentId") REFERENCES "augments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_traits"
            ADD CONSTRAINT "FK_c6a622d51830ac315ab131fd67b" FOREIGN KEY ("traitId") REFERENCES "traits"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_tags"
            ADD CONSTRAINT "FK_cd30e76c00f9cb5599202323244" FOREIGN KEY ("augmentId") REFERENCES "augments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_effects"
            ADD CONSTRAINT "FK_b4abedc34e6944c6721d6723a02" FOREIGN KEY ("augmentId") REFERENCES "augments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // Seed initial data after creating all tables
    await this.seedInitialData(queryRunner);
  }

  private async seedInitialData(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting initial data seeding...');

    // Check if TFT sets already exist
    const existingCount = await queryRunner.query(
      'SELECT COUNT(*) as count FROM "tft_sets"',
    );
    if (existingCount[0].count > 0) {
      console.log('TFT Sets already exist, skipping seed...');
      return;
    }

    // Insert TFT Set
    const tftSetData = {
      setVersion: 'Set15',
      displayName: 'TFT Set 15: InkBorn Fables',
      viApiUrl: 'https://data.metatft.com/lookups/TFTSet15_latest_vi_vn.json',
      enApiUrl: 'https://data.metatft.com/lookups/TFTSet15_latest_en_us.json',
      isActive: true,
      syncStatus: 'pending',
    };

    await queryRunner.query(
      `INSERT INTO "tft_sets" ("setVersion", "displayName", "viApiUrl", "enApiUrl", "isActive", "syncStatus", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [
        tftSetData.setVersion,
        tftSetData.displayName,
        tftSetData.viApiUrl,
        tftSetData.enApiUrl,
        tftSetData.isActive,
        tftSetData.syncStatus,
      ],
    );

    console.log(
      `Created TFT Set: ${tftSetData.setVersion} - ${tftSetData.displayName}`,
    );
    console.log('Initial data seeding completed successfully!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "augment_effects" DROP CONSTRAINT "FK_b4abedc34e6944c6721d6723a02"
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_tags" DROP CONSTRAINT "FK_cd30e76c00f9cb5599202323244"
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_traits" DROP CONSTRAINT "FK_c6a622d51830ac315ab131fd67b"
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_traits" DROP CONSTRAINT "FK_90bc29fbaf52f8b2f00da03ec45"
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_translations" DROP CONSTRAINT "FK_bc061057fd4bc760a82f1d480bb"
        `);
    await queryRunner.query(`
            ALTER TABLE "augment_translations" DROP CONSTRAINT "FK_5d2f136568c7026d83f6e5c2d4d"
        `);
    await queryRunner.query(`
            ALTER TABLE "extra_translations" DROP CONSTRAINT "FK_769cecd3a924db99bf86c95c48c"
        `);
    await queryRunner.query(`
            ALTER TABLE "item_effects" DROP CONSTRAINT "FK_8b12f2a0d86086e6392a316c942"
        `);
    await queryRunner.query(`
            ALTER TABLE "item_tags" DROP CONSTRAINT "FK_3ab057a60bc8b2697356a1f294b"
        `);
    await queryRunner.query(`
            ALTER TABLE "item_compositions" DROP CONSTRAINT "FK_23797a13e73ca6b972caac863c8"
        `);
    await queryRunner.query(`
            ALTER TABLE "item_traits" DROP CONSTRAINT "FK_a6b4d5389aa99dbf85a18d0e11a"
        `);
    await queryRunner.query(`
            ALTER TABLE "item_traits" DROP CONSTRAINT "FK_9b1376988ae278ffe14c7332cfd"
        `);
    await queryRunner.query(`
            ALTER TABLE "item_translations" DROP CONSTRAINT "FK_bb7d903bccc6ee8045b4977b72e"
        `);
    await queryRunner.query(`
            ALTER TABLE "item_translations" DROP CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117"
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_translations" DROP CONSTRAINT "FK_9c308b7107c9e38e4e0baa278e5"
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_translations" DROP CONSTRAINT "FK_224477ef0769ca1630ac5ac36d2"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_items" DROP CONSTRAINT "FK_417ab193b82cd239f26e7045c98"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_items" DROP CONSTRAINT "FK_2d5aa38a24009b30736d42f8ed0"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_translations" DROP CONSTRAINT "FK_09136ccf64b6ba21520b5aa2366"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_translations" DROP CONSTRAINT "FK_2cc794066a952f1f36ec4445cd3"
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_effect_variables" DROP CONSTRAINT "FK_975c2810d2c356fcf037834bbf4"
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_effects" DROP CONSTRAINT "FK_e41f21ab20082fd128b72edb701"
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_units" DROP CONSTRAINT "FK_26efdcc85d86bc043dbe449e3cd"
        `);
    await queryRunner.query(`
            ALTER TABLE "trait_units" DROP CONSTRAINT "FK_6bc5a5e8abcfef2f0c8a0239598"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_ability_translations" DROP CONSTRAINT "FK_0fb4b803beffbdb9889a5fd654b"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_ability_translations" DROP CONSTRAINT "FK_d67b5dda5650676e332eabf5551"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_ability_variables" DROP CONSTRAINT "FK_eb274971ede94891e3fa37f4621"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_abilities" DROP CONSTRAINT "FK_a2167452516c6f1596b3346c53f"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_translations" DROP CONSTRAINT "FK_70aca0feaaa31a03834b650ce20"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_translations" DROP CONSTRAINT "FK_f801b1135bfb460d3355d5669d0"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_traits" DROP CONSTRAINT "FK_4d26e6b45f9e9e2ba3bde900031"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_traits" DROP CONSTRAINT "FK_635adb909666a0661525af57728"
        `);
    await queryRunner.query(`
            ALTER TABLE "unit_stats" DROP CONSTRAINT "FK_f8f8a4102a181dff9ee05f4452d"
        `);
    await queryRunner.query(`
            ALTER TABLE "units" DROP CONSTRAINT "FK_bd3339c523b5ef6436ebfb5f290"
        `);
    await queryRunner.query(`
            ALTER TABLE "traits" DROP CONSTRAINT "FK_64540fe9a1753b865609fb108cb"
        `);
    await queryRunner.query(`
            ALTER TABLE "roles" DROP CONSTRAINT "FK_f88211318016b84cb0df7c139f1"
        `);
    await queryRunner.query(`
            ALTER TABLE "items" DROP CONSTRAINT "FK_6395ddc3737213cfb3c787d79a0"
        `);
    await queryRunner.query(`
            ALTER TABLE "encounters" DROP CONSTRAINT "FK_bf8c2087b6b4370b2e826735574"
        `);
    await queryRunner.query(`
            ALTER TABLE "encounter_translations" DROP CONSTRAINT "FK_26f9915c81ec0a76b80811a5e43"
        `);
    await queryRunner.query(`
            ALTER TABLE "encounter_translations" DROP CONSTRAINT "FK_ef8c87834d6c45ed7b45bff686d"
        `);
    await queryRunner.query(`
            ALTER TABLE "augments" DROP CONSTRAINT "FK_174f84bcc517482b014a103d9df"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_00964f30cd882b43c64161462b"
        `);
    await queryRunner.query(`
            DROP TABLE "augment_effects"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_908f72fac4dcecb0ccf8b0c726"
        `);
    await queryRunner.query(`
            DROP TABLE "augment_tags"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_96ca4c56c05975f57762dee955"
        `);
    await queryRunner.query(`
            DROP TABLE "augment_traits"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_21cd1a682e9ad9562aaf2e0f3d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_fcdf5cc11ef1671b509a2f6769"
        `);
    await queryRunner.query(`
            DROP TABLE "augment_translations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_44f412616aceeeb48e2b05a001"
        `);
    await queryRunner.query(`
            DROP TABLE "extra_translations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_18728f43dd5afb894778ce0ffd"
        `);
    await queryRunner.query(`
            DROP TABLE "item_effects"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4a3498cfa5c4a0c1033ce3535c"
        `);
    await queryRunner.query(`
            DROP TABLE "item_tags"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_999c74fda1fe09183e77bbfa55"
        `);
    await queryRunner.query(`
            DROP TABLE "item_compositions"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_22e2f519814a079aab350144b3"
        `);
    await queryRunner.query(`
            DROP TABLE "item_traits"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8934539471a9856f038fa4541d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_506c6eb31793c7260f1cf64caa"
        `);
    await queryRunner.query(`
            DROP TABLE "item_translations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7557227bb3512f55b1e215890f"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0f93a86fe03064428bde7e81eb"
        `);
    await queryRunner.query(`
            DROP TABLE "trait_translations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8245a354791da4c38838415d3a"
        `);
    await queryRunner.query(`
            DROP TABLE "role_items"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f1413ac3756373fb7bca4ede93"
        `);
    await queryRunner.query(`
            DROP TABLE "role_translations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_bd380360ce9cd87a74cc2905fd"
        `);
    await queryRunner.query(`
            DROP TABLE "trait_effect_variables"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_3385184e8974cd8d1faa9d578d"
        `);
    await queryRunner.query(`
            DROP TABLE "trait_effects"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_971f10b00ea2695a1fa9f96646"
        `);
    await queryRunner.query(`
            DROP TABLE "trait_units"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_feaa7d5738a0fe42e3bf0e7c55"
        `);
    await queryRunner.query(`
            DROP TABLE "unit_ability_translations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2fb55621419b92338d343af5ea"
        `);
    await queryRunner.query(`
            DROP TABLE "unit_ability_variables"
        `);
    await queryRunner.query(`
            DROP TABLE "unit_abilities"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4e2c447f92732111f8ba2dc406"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_05c13a5a2595c33332dcb5a801"
        `);
    await queryRunner.query(`
            DROP TABLE "unit_translations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1896a690716befa47c1e247c5a"
        `);
    await queryRunner.query(`
            DROP TABLE "unit_traits"
        `);
    await queryRunner.query(`
            DROP TABLE "unit_stats"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e5657b4fc9329c40ced6b9e028"
        `);
    await queryRunner.query(`
            DROP TABLE "units"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_d77c3c4d317459970f7aa0dc8c"
        `);
    await queryRunner.query(`
            DROP TABLE "tft_sets"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8df6011ce0f47a2716aa15fcf2"
        `);
    await queryRunner.query(`
            DROP TABLE "traits"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_cd07ca01b2b26b8d8bf42c60b9"
        `);
    await queryRunner.query(`
            DROP TABLE "roles"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6deed8c1e8e558148628232941"
        `);
    await queryRunner.query(`
            DROP TABLE "items"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9cbe31f86e6644f204b38e60cd"
        `);
    await queryRunner.query(`
            DROP TABLE "encounters"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f0056594f1156ae1c876a03e62"
        `);
    await queryRunner.query(`
            DROP TABLE "encounter_translations"
        `);
    await queryRunner.query(`
            DROP TABLE "languages"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2063564913e673a7f9c09e2923"
        `);
    await queryRunner.query(`
            DROP TABLE "augments"
        `);
  }
}
