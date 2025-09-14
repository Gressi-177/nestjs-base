import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

// Import entities
import { AugmentEffect } from './entities/augment-effect.entity';
import { AugmentTag } from './entities/augment-tag.entity';
import { AugmentTrait } from './entities/augment-trait.entity';
import { AugmentTranslation } from './entities/augment-translation.entity';
import { Augment } from './entities/augment.entity';
import { EncounterTranslation } from './entities/encounter-translation.entity';
import { Encounter } from './entities/encounter.entity';
import { ExtraTranslation } from './entities/extra-translation.entity';
import { ItemComposition } from './entities/item-composition.entity';
import { ItemEffect } from './entities/item-effect.entity';
import { ItemTag } from './entities/item-tag.entity';
import { ItemTrait } from './entities/item-trait.entity';
import { ItemTranslation } from './entities/item-translation.entity';
import { Item } from './entities/item.entity';
import { Language } from './entities/language.entity';
import { RoleItem } from './entities/role-item.entity';
import { RoleTranslation } from './entities/role-translation.entity';
import { Role } from './entities/role.entity';
import { TftSet } from './entities/tft-set.entity';
import { TraitEffectVariable } from './entities/trait-effect-variable.entity';
import { TraitEffect } from './entities/trait-effect.entity';
import { TraitTranslation } from './entities/trait-translation.entity';
import { TraitUnit } from './entities/trait-unit.entity';
import { Trait } from './entities/trait.entity';
import { UnitAbilityTranslation } from './entities/unit-ability-translation.entity';
import { UnitAbilityVariable } from './entities/unit-ability-variable.entity';
import { UnitAbility } from './entities/unit-ability.entity';
import { UnitStats } from './entities/unit-stats.entity';
import { UnitTrait } from './entities/unit-trait.entity';
import { UnitTranslation } from './entities/unit-translation.entity';
import { Unit } from './entities/unit.entity';

interface TftDataResponse {
  items: any[];
  units: any[];
  augments: any[];
  traits: any[];
  armory_items: any[];
  roles: Record<string, any>;
  encounters: Record<string, any>;
  extraTranslations: Record<string, any>;
}

@Injectable()
export class TftService {
  private readonly logger = new Logger(TftService.name);

  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    @InjectRepository(UnitTranslation)
    private unitTranslationRepository: Repository<UnitTranslation>,
    @InjectRepository(UnitAbility)
    private unitAbilityRepository: Repository<UnitAbility>,
    @InjectRepository(UnitAbilityTranslation)
    private unitAbilityTranslationRepository: Repository<UnitAbilityTranslation>,
    @InjectRepository(UnitAbilityVariable)
    private unitAbilityVariableRepository: Repository<UnitAbilityVariable>,
    @InjectRepository(UnitStats)
    private unitStatsRepository: Repository<UnitStats>,
    @InjectRepository(UnitTrait)
    private unitTraitRepository: Repository<UnitTrait>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(ItemTranslation)
    private itemTranslationRepository: Repository<ItemTranslation>,
    @InjectRepository(ItemEffect)
    private itemEffectRepository: Repository<ItemEffect>,
    @InjectRepository(ItemComposition)
    private itemCompositionRepository: Repository<ItemComposition>,
    @InjectRepository(ItemTag)
    private itemTagRepository: Repository<ItemTag>,
    @InjectRepository(ItemTrait)
    private itemTraitRepository: Repository<ItemTrait>,
    @InjectRepository(Trait)
    private traitRepository: Repository<Trait>,
    @InjectRepository(TraitTranslation)
    private traitTranslationRepository: Repository<TraitTranslation>,
    @InjectRepository(TraitEffect)
    private traitEffectRepository: Repository<TraitEffect>,
    @InjectRepository(TraitEffectVariable)
    private traitEffectVariableRepository: Repository<TraitEffectVariable>,
    @InjectRepository(TraitUnit)
    private traitUnitRepository: Repository<TraitUnit>,
    @InjectRepository(Augment)
    private augmentRepository: Repository<Augment>,
    @InjectRepository(AugmentTranslation)
    private augmentTranslationRepository: Repository<AugmentTranslation>,
    @InjectRepository(AugmentEffect)
    private augmentEffectRepository: Repository<AugmentEffect>,
    @InjectRepository(AugmentTag)
    private augmentTagRepository: Repository<AugmentTag>,
    @InjectRepository(AugmentTrait)
    private augmentTraitRepository: Repository<AugmentTrait>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleTranslation)
    private roleTranslationRepository: Repository<RoleTranslation>,
    @InjectRepository(RoleItem)
    private roleItemRepository: Repository<RoleItem>,
    @InjectRepository(Encounter)
    private encounterRepository: Repository<Encounter>,
    @InjectRepository(EncounterTranslation)
    private encounterTranslationRepository: Repository<EncounterTranslation>,
    @InjectRepository(ExtraTranslation)
    private extraTranslationRepository: Repository<ExtraTranslation>,
    @InjectRepository(TftSet)
    private tftSetRepository: Repository<TftSet>,
    private dataSource: DataSource,
  ) {}

  private async setupTftSetConfig(setVersion: string, queryRunner: any) {
    const existingSet = await queryRunner.manager.findOne(TftSet, {
      where: { setVersion },
    });

    if (!existingSet) {
      // Tạo config cho set mới
      const tftSet = queryRunner.manager.create(TftSet, {
        setVersion,
        displayName: `TFT ${setVersion}`,
        viApiUrl: `https://data.metatft.com/lookups/TFT${setVersion}_latest_vi_vn.json`,
        enApiUrl: `https://data.metatft.com/lookups/TFT${setVersion}_latest_en_us.json`,
        isActive: true,
        syncStatus: 'pending',
      });
      await queryRunner.manager.save(tftSet);
      this.logger.log(`Created TFT Set config for ${tftSet.setVersion}`);
    }
  }

  async syncTftDataForSet(
    setVersion: string,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Starting TFT data synchronization for ${setVersion}...`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get API URLs cho set version
      const tftSet = await queryRunner.manager.findOne(TftSet, {
        where: { setVersion, isActive: true },
      });

      if (!tftSet) {
        throw new Error(`TFT Set ${setVersion} not found or inactive`);
      }

      // Update sync status
      await queryRunner.manager.update(TftSet, tftSet.id, {
        syncStatus: 'in_progress',
      });

      // Fetch data từ cả 2 API
      const [viData, enData] = await Promise.all([
        this.fetchTftData(tftSet.viApiUrl),
        this.fetchTftData(tftSet.enApiUrl),
      ]);

      // Tạo hoặc cập nhật languages
      await this.syncLanguages(queryRunner);

      // Sync data với tftSet
      await this.syncItems(viData, enData, queryRunner, tftSet);
      await this.syncArmoryItems(viData, enData, queryRunner, tftSet);
      await this.syncUnits(viData, enData, queryRunner, tftSet);
      await this.syncTraits(viData, enData, queryRunner, tftSet);
      await this.syncAugments(viData, enData, queryRunner, tftSet);
      await this.syncRoles(viData, enData, queryRunner, tftSet);
      await this.syncEncounters(viData, enData, queryRunner, tftSet);
      await this.syncExtraTranslations(viData, enData, queryRunner, tftSet);

      // Set version integration completed!

      // Update sync completion
      await queryRunner.manager.update(TftSet, tftSet.id, {
        syncStatus: 'success',
        lastSyncAt: new Date(),
      });

      await queryRunner.commitTransaction();

      this.logger.log(
        `TFT data synchronization for ${tftSet.setVersion} completed successfully`,
      );
      return {
        success: true,
        message: `Data synchronized successfully for ${tftSet.setVersion}`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Update error status if tftSet exists
      const tftSet = await this.tftSetRepository.findOne({
        where: { setVersion, isActive: true },
      });
      if (tftSet) {
        await this.tftSetRepository.update(tftSet.id, { syncStatus: 'failed' });
      }

      this.logger.error(
        `Error during TFT data synchronization for ${tftSet.setVersion}:`,
        error,
      );
      return {
        success: false,
        message: `Synchronization failed for ${tftSet.setVersion}: ${error.message}`,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async syncTftData(): Promise<{ success: boolean; message: string }> {
    this.logger.log('Starting TFT data synchronization with default set...');

    try {
      const defaultSet = await this.getDefaultTftSet();
      this.logger.log(`Using default TFT set: ${defaultSet.setVersion}`);

      return await this.syncTftDataForSet(defaultSet.setVersion);
    } catch (error) {
      this.logger.error('Failed to get default TFT set:', error);
      return {
        success: false,
        message: `Failed to sync: ${error.message}`,
      };
    }
  }

  async getAllTftSets() {
    return await this.tftSetRepository.find({
      order: { setVersion: 'DESC' },
    });
  }

  async getDefaultTftSet() {
    const defaultSet = await this.tftSetRepository.findOne({
      where: { isActive: true },
      order: { setVersion: 'DESC' },
    });

    if (!defaultSet) {
      throw new Error('No active TFT set found');
    }

    return defaultSet;
  }

  async updateTftSet(
    setVersion: string,
    updates: {
      displayName?: string;
      viApiUrl?: string;
      enApiUrl?: string;
      isActive?: boolean;
    },
  ) {
    const tftSet = await this.tftSetRepository.findOne({
      where: { setVersion },
    });

    if (!tftSet) {
      throw new Error(`TFT Set ${setVersion} not found`);
    }

    Object.assign(tftSet, updates);
    return await this.tftSetRepository.save(tftSet);
  }

  private async fetchTftData(url: string): Promise<TftDataResponse> {
    try {
      this.logger.log(`Fetching data from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as TftDataResponse;
    } catch (error) {
      this.logger.error(`Failed to fetch data from ${url}:`, error);
      throw new Error(`Failed to fetch data from ${url}`);
    }
  }

  private async syncLanguages(queryRunner: any) {
    this.logger.log('Syncing languages...');

    const languages = [
      {
        code: 'vi_vn',
        name: 'Vietnamese',
        nativeName: 'Tiếng Việt',
        isActive: true,
      },
      { code: 'en_us', name: 'English', nativeName: 'English', isActive: true },
    ];

    for (const langData of languages) {
      const existingLang = await queryRunner.manager.findOne(Language, {
        where: { code: langData.code },
      });

      if (!existingLang) {
        const language = queryRunner.manager.create(Language, langData);
        await queryRunner.manager.save(language);
        this.logger.log(`Created language: ${langData.code}`);
      }
    }
  }

  private async syncItems(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing items for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    // Merge items từ cả 2 ngôn ngữ
    const itemsMap = new Map();

    // Process Vietnamese items
    for (const itemData of viData.items || []) {
      itemsMap.set(itemData.apiName, {
        vi: itemData,
        en: null,
      });
    }

    // Process English items
    for (const itemData of enData.items || []) {
      if (itemsMap.has(itemData.apiName)) {
        itemsMap.get(itemData.apiName).en = itemData;
      } else {
        itemsMap.set(itemData.apiName, {
          vi: null,
          en: itemData,
        });
      }
    }

    for (const [apiName, { vi, en }] of itemsMap) {
      const baseData = vi || en;
      if (!baseData) continue;

      // Tạo hoặc cập nhật item
      let item = await queryRunner.manager.findOne(Item, {
        where: { apiName, tftSetId: tftSet.id },
      });

      if (!item) {
        item = queryRunner.manager.create(Item, {
          apiName: baseData.apiName,
          tftSetId: tftSet.id,
          icon: baseData.icon,
          isUnique: baseData.unique || false,
        });
        await queryRunner.manager.save(item);
      }

      // Sync translations
      if (vi) {
        await this.syncItemTranslation(item, vi, viLang, queryRunner);
      }
      if (en) {
        await this.syncItemTranslation(item, en, enLang, queryRunner);
      }

      // Sync effects, compositions, tags, traits
      await this.syncItemEffects(item, baseData, queryRunner);
      await this.syncItemCompositions(item, baseData, queryRunner);
      await this.syncItemTags(item, baseData, queryRunner);
      await this.syncItemTraits(item, baseData, queryRunner);
    }
  }

  private async syncItemTranslation(
    item: Item,
    itemData: any,
    language: Language,
    queryRunner: any,
  ) {
    // Skip if name is null/undefined/empty - required field
    if (!itemData.name || itemData.name.trim() === '') {
      return;
    }

    const existingTranslation = await queryRunner.manager.findOne(
      ItemTranslation,
      {
        where: { item: { id: item.id }, language: { id: language.id } },
      },
    );

    const translationData = {
      item,
      language,
      name: itemData.name.trim(),
      description: itemData.desc || '',
    };

    if (existingTranslation) {
      await queryRunner.manager.update(
        ItemTranslation,
        existingTranslation.id,
        translationData,
      );
    } else {
      const translation = queryRunner.manager.create(
        ItemTranslation,
        translationData,
      );
      await queryRunner.manager.save(translation);
    }
  }

  private async syncItemEffects(item: Item, itemData: any, queryRunner: any) {
    // Xóa effects cũ
    await queryRunner.manager.delete(ItemEffect, { item: { id: item.id } });

    // Tạo effects mới
    if (itemData.effects) {
      for (const [key, value] of Object.entries(itemData.effects)) {
        // Skip if value is null, undefined, or not a valid number
        if (value == null || isNaN(Number(value))) {
          continue;
        }

        const effect = queryRunner.manager.create(ItemEffect, {
          item,
          effectKey: key,
          effectValue: Number(value),
        });
        await queryRunner.manager.save(effect);
      }
    }
  }

  private async syncItemCompositions(
    item: Item,
    itemData: any,
    queryRunner: any,
  ) {
    // Xóa compositions cũ
    await queryRunner.manager.delete(ItemComposition, {
      item: { id: item.id },
    });

    // Tạo compositions mới
    if (itemData.composition && Array.isArray(itemData.composition)) {
      for (let index = 0; index < itemData.composition.length; index++) {
        const componentApiName = itemData.composition[index];
        const composition = queryRunner.manager.create(ItemComposition, {
          item,
          componentApiName,
          position: index,
        });
        await queryRunner.manager.save(composition);
      }
    }
  }

  private async syncItemTags(item: Item, itemData: any, queryRunner: any) {
    // Xóa tags cũ
    await queryRunner.manager.delete(ItemTag, { item: { id: item.id } });

    // Tạo tags mới
    if (itemData.tags && Array.isArray(itemData.tags)) {
      for (const tagName of itemData.tags) {
        const tag = queryRunner.manager.create(ItemTag, {
          item,
          tag: tagName,
        });
        await queryRunner.manager.save(tag);
      }
    }
  }

  private async syncItemTraits(item: Item, itemData: any, queryRunner: any) {
    // Xóa item traits cũ
    await queryRunner.manager.delete(ItemTrait, { item: { id: item.id } });

    // Tạo item traits mới
    if (itemData.associatedTraits && Array.isArray(itemData.associatedTraits)) {
      for (const traitApiName of itemData.associatedTraits) {
        // Find trait by API name
        const trait = await queryRunner.manager.findOne(Trait, {
          where: { apiName: traitApiName, tftSetId: item.tftSetId },
        });
        if (trait) {
          const itemTrait = queryRunner.manager.create(ItemTrait, {
            item,
            trait,
          });
          await queryRunner.manager.save(itemTrait);
        }
      }
    }

    if (
      itemData.incompatibleTraits &&
      Array.isArray(itemData.incompatibleTraits)
    ) {
      for (const traitApiName of itemData.incompatibleTraits) {
        // Find trait by API name
        const trait = await queryRunner.manager.findOne(Trait, {
          where: { apiName: traitApiName, tftSetId: item.tftSetId },
        });
        if (trait) {
          const itemTrait = queryRunner.manager.create(ItemTrait, {
            item,
            trait,
            isIncompatible: true,
          });
          await queryRunner.manager.save(itemTrait);
        }
      }
    }
  }

  private async syncArmoryItems(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing armory items for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    // Merge armory items từ cả 2 ngôn ngữ
    const itemsMap = new Map();

    // Process Vietnamese armory items
    for (const itemData of viData.armory_items || []) {
      itemsMap.set(itemData.apiName, {
        vi: itemData,
        en: null,
      });
    }

    // Process English armory items
    for (const itemData of enData.armory_items || []) {
      if (itemsMap.has(itemData.apiName)) {
        itemsMap.get(itemData.apiName).en = itemData;
      } else {
        itemsMap.set(itemData.apiName, {
          vi: null,
          en: itemData,
        });
      }
    }

    for (const [apiName, { vi, en }] of itemsMap) {
      const baseData = vi || en;
      if (!baseData) continue;

      // Tạo hoặc cập nhật item (armory items cũng lưu trong table items)
      let item = await queryRunner.manager.findOne(Item, {
        where: { apiName, tftSetId: tftSet.id },
      });

      if (!item) {
        item = queryRunner.manager.create(Item, {
          apiName: baseData.apiName,
          tftSetId: tftSet.id,
          icon: baseData.icon,
          isUnique: baseData.unique || false,
        });
        await queryRunner.manager.save(item);
      }

      // Sync translations
      if (vi) {
        await this.syncItemTranslation(item, vi, viLang, queryRunner);
      }
      if (en) {
        await this.syncItemTranslation(item, en, enLang, queryRunner);
      }

      // Sync effects, compositions, tags, traits (reuse existing methods)
      await this.syncItemEffects(item, baseData, queryRunner);
      await this.syncItemCompositions(item, baseData, queryRunner);
      await this.syncItemTags(item, baseData, queryRunner);
      await this.syncItemTraits(item, baseData, queryRunner);
    }
  }

  // Methods cho các entity khác
  private async syncUnits(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing units for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    // Merge units từ cả 2 ngôn ngữ
    const unitsMap = new Map();

    // Process Vietnamese units
    for (const unitData of viData.units || []) {
      unitsMap.set(unitData.apiName, {
        vi: unitData,
        en: null,
      });
    }

    // Process English units
    for (const unitData of enData.units || []) {
      if (unitsMap.has(unitData.apiName)) {
        unitsMap.get(unitData.apiName).en = unitData;
      } else {
        unitsMap.set(unitData.apiName, {
          vi: null,
          en: unitData,
        });
      }
    }

    for (const [apiName, { vi, en }] of unitsMap) {
      const baseData = vi || en;
      if (!baseData) continue;

      // Tạo hoặc cập nhật unit
      let unit = await queryRunner.manager.findOne(Unit, {
        where: { apiName, tftSetId: tftSet.id },
      });

      if (!unit) {
        unit = queryRunner.manager.create(Unit, {
          apiName: baseData.apiName,
          tftSetId: tftSet.id,
          characterName: baseData.characterName,
          cost: baseData.cost,
          icon: baseData.icon,
          squareIcon: baseData.squareIcon,
          tileIcon: baseData.tileIcon,
          role: baseData.role,
        });
        await queryRunner.manager.save(unit);
      }

      // Sync translations
      if (vi) {
        await this.syncUnitTranslation(unit, vi, viLang, queryRunner);
      }
      if (en) {
        await this.syncUnitTranslation(unit, en, enLang, queryRunner);
      }

      // Sync ability, stats, traits
      if (baseData.ability) {
        await this.syncUnitAbility(
          unit,
          baseData.ability,
          vi,
          en,
          viLang,
          enLang,
          queryRunner,
        );
      }
      if (baseData.stats) {
        await this.syncUnitStats(unit, baseData.stats, queryRunner);
      }
      if (baseData.traits && Array.isArray(baseData.traits)) {
        await this.syncUnitTraits(unit, baseData.traits, queryRunner);
      }
    }
  }

  private async syncUnitTranslation(
    unit: Unit,
    unitData: any,
    language: Language,
    queryRunner: any,
  ) {
    // Skip if name is null/undefined/empty - required field
    if (!unitData.name || unitData.name.trim() === '') {
      return;
    }

    const existingTranslation = await queryRunner.manager.findOne(
      UnitTranslation,
      {
        where: { unit: { id: unit.id }, language: { id: language.id } },
      },
    );

    const translationData = {
      unit,
      language,
      name: unitData.name.trim(),
    };

    if (existingTranslation) {
      await queryRunner.manager.update(
        UnitTranslation,
        existingTranslation.id,
        translationData,
      );
    } else {
      const translation = queryRunner.manager.create(
        UnitTranslation,
        translationData,
      );
      await queryRunner.manager.save(translation);
    }
  }

  private async syncUnitAbility(
    unit: Unit,
    abilityData: any,
    viData: any,
    enData: any,
    viLang: Language,
    enLang: Language,
    queryRunner: any,
  ) {
    // Tạo hoặc cập nhật ability
    let ability = await queryRunner.manager.findOne(UnitAbility, {
      where: { unitId: unit.id },
    });

    if (!ability) {
      ability = queryRunner.manager.create(UnitAbility, {
        unitId: unit.id,
        icon: abilityData.icon,
      });
      await queryRunner.manager.save(ability);
    }

    // Sync ability translations
    if (viData && viData.ability) {
      await this.syncUnitAbilityTranslation(
        ability,
        viData.ability,
        viLang,
        queryRunner,
      );
    }
    if (enData && enData.ability) {
      await this.syncUnitAbilityTranslation(
        ability,
        enData.ability,
        enLang,
        queryRunner,
      );
    }

    // Sync ability variables
    if (abilityData.variables && Array.isArray(abilityData.variables)) {
      await this.syncUnitAbilityVariables(
        ability,
        abilityData.variables,
        queryRunner,
      );
    }
  }

  private async syncUnitAbilityTranslation(
    ability: UnitAbility,
    abilityData: any,
    language: Language,
    queryRunner: any,
  ) {
    // Skip if name is null/undefined/empty - required field
    if (!abilityData.name || abilityData.name.trim() === '') {
      return;
    }

    const existingTranslation = await queryRunner.manager.findOne(
      UnitAbilityTranslation,
      {
        where: { ability: { id: ability.id }, language: { id: language.id } },
      },
    );

    const translationData = {
      ability,
      language,
      name: abilityData.name.trim(),
      description: abilityData.desc || '',
    };

    if (existingTranslation) {
      await queryRunner.manager.update(
        UnitAbilityTranslation,
        existingTranslation.id,
        translationData,
      );
    } else {
      const translation = queryRunner.manager.create(
        UnitAbilityTranslation,
        translationData,
      );
      await queryRunner.manager.save(translation);
    }
  }

  private async syncUnitAbilityVariables(
    ability: UnitAbility,
    variables: any[],
    queryRunner: any,
  ) {
    // Xóa variables cũ
    await queryRunner.manager.delete(UnitAbilityVariable, {
      ability: { id: ability.id },
    });

    // Tạo variables mới
    for (const variable of variables) {
      if (variable.name && variable.value) {
        let level1Value: number | null = null;
        let level2Value: number | null = null;
        let level3Value: number | null = null;

        if (Array.isArray(variable.value)) {
          // If value is array, map to level values
          if (variable.value.length >= 1 && !isNaN(Number(variable.value[0]))) {
            level1Value = Number(variable.value[0]);
          }
          if (variable.value.length >= 2 && !isNaN(Number(variable.value[1]))) {
            level2Value = Number(variable.value[1]);
          }
          if (variable.value.length >= 3 && !isNaN(Number(variable.value[2]))) {
            level3Value = Number(variable.value[2]);
          }
        } else if (!isNaN(Number(variable.value))) {
          // If single value, use for all levels
          const numValue = Number(variable.value);
          level1Value = level2Value = level3Value = numValue;
        }

        // Only create if at least one level has a valid value
        if (
          level1Value !== null ||
          level2Value !== null ||
          level3Value !== null
        ) {
          const abilityVariable = queryRunner.manager.create(
            UnitAbilityVariable,
            {
              ability,
              variableName: variable.name,
              level1Value,
              level2Value,
              level3Value,
            },
          );
          await queryRunner.manager.save(abilityVariable);
        }
      }
    }
  }

  private async syncUnitStats(unit: Unit, statsData: any, queryRunner: any) {
    const stats = await queryRunner.manager.findOne(UnitStats, {
      where: { unitId: unit.id },
    });

    const statsPayload = {
      unitId: unit.id,
      armor: statsData.armor,
      attackSpeed: statsData.attackSpeed,
      critChance: statsData.critChance,
      critMultiplier: statsData.critMultiplier,
      damage: statsData.damage,
      hp: statsData.hp,
      initialMana: statsData.initialMana,
      magicResist: statsData.magicResist,
      mana: statsData.mana,
      range: statsData.range,
    };

    if (stats) {
      await queryRunner.manager.update(UnitStats, stats.id, statsPayload);
    } else {
      const newStats = queryRunner.manager.create(UnitStats, statsPayload);
      await queryRunner.manager.save(newStats);
    }
  }

  private async syncUnitTraits(unit: Unit, traits: string[], queryRunner: any) {
    // Xóa unit traits cũ
    await queryRunner.manager.delete(UnitTrait, { unit: { id: unit.id } });

    // Tạo unit traits mới
    for (const traitApiName of traits) {
      // Find trait by API name
      const trait = await queryRunner.manager.findOne(Trait, {
        where: { apiName: traitApiName, tftSetId: unit.tftSetId },
      });
      if (trait) {
        const unitTrait = queryRunner.manager.create(UnitTrait, {
          unit,
          trait,
        });
        await queryRunner.manager.save(unitTrait);
      }
    }
  }

  private async syncTraits(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing traits for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    // Merge traits từ cả 2 ngôn ngữ
    const traitsMap = new Map();

    // Process Vietnamese traits
    for (const traitData of viData.traits || []) {
      traitsMap.set(traitData.apiName, {
        vi: traitData,
        en: null,
      });
    }

    // Process English traits
    for (const traitData of enData.traits || []) {
      if (traitsMap.has(traitData.apiName)) {
        traitsMap.get(traitData.apiName).en = traitData;
      } else {
        traitsMap.set(traitData.apiName, {
          vi: null,
          en: traitData,
        });
      }
    }

    for (const [apiName, { vi, en }] of traitsMap) {
      const baseData = vi || en;
      if (!baseData) continue;

      // Tạo hoặc cập nhật trait
      let trait = await queryRunner.manager.findOne(Trait, {
        where: { apiName, tftSetId: tftSet.id },
      });

      if (!trait) {
        trait = queryRunner.manager.create(Trait, {
          apiName: baseData.apiName,
          tftSetId: tftSet.id,
          icon: baseData.icon,
        });
        await queryRunner.manager.save(trait);
      }

      // Sync translations
      if (vi) {
        await this.syncTraitTranslation(trait, vi, viLang, queryRunner);
      }
      if (en) {
        await this.syncTraitTranslation(trait, en, enLang, queryRunner);
      }

      // Sync effects và units
      if (baseData.effects && Array.isArray(baseData.effects)) {
        await this.syncTraitEffects(trait, baseData.effects, queryRunner);
      }
      if (baseData.units && Array.isArray(baseData.units)) {
        await this.syncTraitUnits(trait, baseData.units, queryRunner);
      }
    }
  }

  private async syncTraitTranslation(
    trait: Trait,
    traitData: any,
    language: Language,
    queryRunner: any,
  ) {
    // Skip if name is null/undefined/empty - required field
    if (!traitData.name || traitData.name.trim() === '') {
      return;
    }

    const existingTranslation = await queryRunner.manager.findOne(
      TraitTranslation,
      {
        where: { trait: { id: trait.id }, language: { id: language.id } },
      },
    );

    const translationData = {
      trait,
      language,
      name: traitData.name.trim(),
      description: traitData.desc || '',
    };

    if (existingTranslation) {
      await queryRunner.manager.update(
        TraitTranslation,
        existingTranslation.id,
        translationData,
      );
    } else {
      const translation = queryRunner.manager.create(
        TraitTranslation,
        translationData,
      );
      await queryRunner.manager.save(translation);
    }
  }

  private async syncTraitEffects(
    trait: Trait,
    effects: any[],
    queryRunner: any,
  ) {
    // Xóa effects cũ
    await queryRunner.manager.delete(TraitEffect, { trait: { id: trait.id } });

    // Tạo effects mới
    for (const effect of effects) {
      const traitEffect = queryRunner.manager.create(TraitEffect, {
        trait,
        minUnits: effect.minUnits,
        maxUnits: effect.maxUnits,
        style: effect.style,
      });
      await queryRunner.manager.save(traitEffect);

      // Sync effect variables
      if (effect.variables) {
        await this.syncTraitEffectVariables(
          traitEffect,
          effect.variables,
          queryRunner,
        );
      }
    }
  }

  private async syncTraitEffectVariables(
    traitEffect: TraitEffect,
    variables: any,
    queryRunner: any,
  ) {
    // Xóa variables cũ
    await queryRunner.manager.delete(TraitEffectVariable, {
      traitEffect: { id: traitEffect.id },
    });

    // Tạo variables mới
    for (const [key, value] of Object.entries(variables)) {
      // Skip if value is null, undefined, or not a valid number
      if (value == null || isNaN(Number(value))) {
        continue;
      }

      const variable = queryRunner.manager.create(TraitEffectVariable, {
        traitEffect,
        variableKey: key,
        variableValue: Number(value),
      });
      await queryRunner.manager.save(variable);
    }
  }

  private async syncTraitUnits(trait: Trait, units: any[], queryRunner: any) {
    // Xóa trait units cũ
    await queryRunner.manager.delete(TraitUnit, { trait: { id: trait.id } });

    // Tạo trait units mới
    for (const unitData of units) {
      // Find unit by API name
      const unit = await queryRunner.manager.findOne(Unit, {
        where: { apiName: unitData.unit, tftSetId: trait.tftSetId },
      });
      if (unit) {
        const traitUnit = queryRunner.manager.create(TraitUnit, {
          trait,
          unit,
          unitCost: unitData.unit_cost,
        });
        await queryRunner.manager.save(traitUnit);
      }
    }
  }

  private async syncAugments(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing augments for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    // Merge augments từ cả 2 ngôn ngữ
    const augmentsMap = new Map();

    // Process Vietnamese augments
    for (const augmentData of viData.augments || []) {
      augmentsMap.set(augmentData.apiName, {
        vi: augmentData,
        en: null,
      });
    }

    // Process English augments
    for (const augmentData of enData.augments || []) {
      if (augmentsMap.has(augmentData.apiName)) {
        augmentsMap.get(augmentData.apiName).en = augmentData;
      } else {
        augmentsMap.set(augmentData.apiName, {
          vi: null,
          en: augmentData,
        });
      }
    }

    for (const [apiName, { vi, en }] of augmentsMap) {
      const baseData = vi || en;
      if (!baseData) continue;

      // Tạo hoặc cập nhật augment
      let augment = await queryRunner.manager.findOne(Augment, {
        where: { apiName, tftSetId: tftSet.id },
      });

      if (!augment) {
        augment = queryRunner.manager.create(Augment, {
          apiName: baseData.apiName,
          tftSetId: tftSet.id,
          icon: baseData.icon,
          isUnique: baseData.unique || false,
          texture: baseData.texture,
          augmentType: baseData.type || 'regular',
        });
        await queryRunner.manager.save(augment);
      }

      // Sync translations, effects, tags, traits
      if (vi) {
        await this.syncAugmentTranslation(augment, vi, viLang, queryRunner);
      }
      if (en) {
        await this.syncAugmentTranslation(augment, en, enLang, queryRunner);
      }

      await this.syncAugmentEffects(augment, baseData, queryRunner);
      await this.syncAugmentTags(augment, baseData, queryRunner);
      await this.syncAugmentTraits(augment, baseData, queryRunner);
    }
  }

  private async syncAugmentTranslation(
    augment: Augment,
    augmentData: any,
    language: Language,
    queryRunner: any,
  ) {
    // Skip if name is null/undefined/empty - required field
    if (!augmentData.name || augmentData.name.trim() === '') {
      return;
    }

    const existingTranslation = await queryRunner.manager.findOne(
      AugmentTranslation,
      {
        where: { augment: { id: augment.id }, language: { id: language.id } },
      },
    );

    const translationData = {
      augment,
      language,
      name: augmentData.name.trim(),
      description: augmentData.desc || '',
    };

    if (existingTranslation) {
      await queryRunner.manager.update(
        AugmentTranslation,
        existingTranslation.id,
        translationData,
      );
    } else {
      const translation = queryRunner.manager.create(
        AugmentTranslation,
        translationData,
      );
      await queryRunner.manager.save(translation);
    }
  }

  private async syncAugmentEffects(
    augment: Augment,
    augmentData: any,
    queryRunner: any,
  ) {
    // Xóa effects cũ
    await queryRunner.manager.delete(AugmentEffect, {
      augment: { id: augment.id },
    });

    // Tạo effects mới
    if (augmentData.effects) {
      for (const [key, value] of Object.entries(augmentData.effects)) {
        // Skip if value is null, undefined, or not a valid number
        if (value == null || isNaN(Number(value))) {
          continue;
        }

        const effect = queryRunner.manager.create(AugmentEffect, {
          augment,
          effectKey: key,
          effectValue: Number(value),
        });
        await queryRunner.manager.save(effect);
      }
    }
  }

  private async syncAugmentTags(
    augment: Augment,
    augmentData: any,
    queryRunner: any,
  ) {
    // Xóa tags cũ
    await queryRunner.manager.delete(AugmentTag, {
      augment: { id: augment.id },
    });

    // Tạo tags mới
    if (augmentData.tags && Array.isArray(augmentData.tags)) {
      for (const tagName of augmentData.tags) {
        const tag = queryRunner.manager.create(AugmentTag, {
          augment,
          tag: tagName,
        });
        await queryRunner.manager.save(tag);
      }
    }
  }

  private async syncAugmentTraits(
    augment: Augment,
    augmentData: any,
    queryRunner: any,
  ) {
    // Xóa augment traits cũ
    await queryRunner.manager.delete(AugmentTrait, {
      augment: { id: augment.id },
    });

    // Tạo augment traits mới
    if (
      augmentData.associatedTraits &&
      Array.isArray(augmentData.associatedTraits)
    ) {
      for (const traitApiName of augmentData.associatedTraits) {
        // Find trait by API name
        const trait = await queryRunner.manager.findOne(Trait, {
          where: { apiName: traitApiName, tftSetId: augment.tftSetId },
        });
        if (trait) {
          const augmentTrait = queryRunner.manager.create(AugmentTrait, {
            augment,
            trait,
          });
          await queryRunner.manager.save(augmentTrait);
        }
      }
    }
  }

  private async syncRoles(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing roles for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    const rolesData = [
      { lang: viLang, data: viData.roles || {} },
      { lang: enLang, data: enData.roles || {} },
    ];

    const processedRoles = new Set();

    for (const { lang, data } of rolesData) {
      for (const [, roleData] of Object.entries(data)) {
        if (!processedRoles.has(`${roleData.apiName}_${tftSet.setVersion}`)) {
          // Tạo hoặc cập nhật role
          let role = await queryRunner.manager.findOne(Role, {
            where: { apiName: roleData.apiName, tftSetId: tftSet.id },
          });

          if (!role) {
            role = queryRunner.manager.create(Role, {
              apiName: roleData.apiName,
              tftSetId: tftSet.id,
              setVersion: tftSet.setVersion,
            });
            await queryRunner.manager.save(role);
            processedRoles.add(`${roleData.apiName}_${tftSet.setVersion}`);
          }

          // Sync role items
          await this.syncRoleItems(role, roleData, queryRunner);
        }

        // Sync translation cho role này
        await this.syncRoleTranslation(roleData, lang, queryRunner, tftSet);
      }
    }
  }

  private async syncRoleTranslation(
    roleData: any,
    language: Language,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    const role = await queryRunner.manager.findOne(Role, {
      where: { apiName: roleData.apiName, tftSetId: tftSet.id },
    });

    if (!role) return;

    const existingTranslation = await queryRunner.manager.findOne(
      RoleTranslation,
      {
        where: { role: { id: role.id }, language: { id: language.id } },
      },
    );

    // Skip if name is null/undefined/empty - required field
    if (!roleData.name || roleData.name.trim() === '') {
      return;
    }

    const translationData = {
      role,
      language,
      name: roleData.name.trim(),
      description: roleData.description || '',
    };

    if (existingTranslation) {
      await queryRunner.manager.update(
        RoleTranslation,
        existingTranslation.id,
        translationData,
      );
    } else {
      const translation = queryRunner.manager.create(
        RoleTranslation,
        translationData,
      );
      await queryRunner.manager.save(translation);
    }
  }

  private async syncRoleItems(role: Role, roleData: any, queryRunner: any) {
    // Xóa role items cũ
    await queryRunner.manager.delete(RoleItem, { role: { id: role.id } });

    // Tạo role items mới
    if (roleData.items && Array.isArray(roleData.items)) {
      for (const itemApiName of roleData.items) {
        // Find item by API name - prioritize same setVersion first, then fallback to any
        let item = await queryRunner.manager.findOne(Item, {
          where: { apiName: itemApiName, tftSetId: role.tftSetId },
        });

        // Fallback to any item with same apiName if not found in current set
        if (!item) {
          item = await queryRunner.manager.findOne(Item, {
            where: { apiName: itemApiName },
          });
        }

        if (item) {
          const roleItem = queryRunner.manager.create(RoleItem, {
            role,
            item,
          });
          await queryRunner.manager.save(roleItem);
        }
      }
    }
  }

  private async syncEncounters(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing encounters for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    const encountersData = [
      { lang: viLang, data: viData.encounters || {} },
      { lang: enLang, data: enData.encounters || {} },
    ];

    const processedEncounters = new Set();

    for (const { lang, data } of encountersData) {
      for (const [, encounterData] of Object.entries(data)) {
        if (
          !processedEncounters.has(
            `${encounterData.apiName}_${tftSet.setVersion}`,
          )
        ) {
          // Tạo hoặc cập nhật encounter
          let encounter = await queryRunner.manager.findOne(Encounter, {
            where: { apiName: encounterData.apiName, tftSetId: tftSet.id },
          });

          if (!encounter) {
            encounter = queryRunner.manager.create(Encounter, {
              apiName: encounterData.apiName,
              tftSetId: tftSet.id,
              setVersion: tftSet.setVersion,
              championSkin: encounterData.ChampionSkin,
            });
            await queryRunner.manager.save(encounter);
            processedEncounters.add(
              `${encounterData.apiName}_${tftSet.setVersion}`,
            );
          }
        }

        // Sync translation cho encounter này
        await this.syncEncounterTranslation(
          encounterData,
          lang,
          queryRunner,
          tftSet,
        );
      }
    }
  }

  private async syncEncounterTranslation(
    encounterData: any,
    language: Language,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    const encounter = await queryRunner.manager.findOne(Encounter, {
      where: { apiName: encounterData.apiName, tftSetId: tftSet.id },
    });

    if (!encounter) return;

    // Skip if name is null/undefined/empty - required field
    if (!encounterData.name || encounterData.name.trim() === '') {
      return;
    }

    const existingTranslation = await queryRunner.manager.findOne(
      EncounterTranslation,
      {
        where: {
          encounter: { id: encounter.id },
          language: { id: language.id },
        },
      },
    );

    const translationData = {
      encounter,
      language,
      name: encounterData.name.trim(),
      encounterRulesText: encounterData.EncounterRulesText || '',
    };

    if (existingTranslation) {
      await queryRunner.manager.update(
        EncounterTranslation,
        existingTranslation.id,
        translationData,
      );
    } else {
      const translation = queryRunner.manager.create(
        EncounterTranslation,
        translationData,
      );
      await queryRunner.manager.save(translation);
    }
  }

  private async syncExtraTranslations(
    viData: TftDataResponse,
    enData: TftDataResponse,
    queryRunner: any,
    tftSet: TftSet,
  ) {
    this.logger.log(`Syncing extra translations for ${tftSet.setVersion}...`);

    const viLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'vi_vn' },
    });
    const enLang = await queryRunner.manager.findOne(Language, {
      where: { code: 'en_us' },
    });

    const extraData = [
      { lang: viLang, data: viData.extraTranslations || {} },
      { lang: enLang, data: enData.extraTranslations || {} },
    ];

    for (const { lang, data } of extraData) {
      for (const [key, value] of Object.entries(data)) {
        // Skip if value is null/undefined/empty - required field
        if (value == null || String(value).trim() === '') {
          continue;
        }

        const existingTranslation = await queryRunner.manager.findOne(
          ExtraTranslation,
          {
            where: { translationKey: key, languageCode: lang.code },
          },
        );

        const translationData = {
          translationKey: key,
          value: String(value).trim(),
          languageCode: lang.code,
          language: lang,
        };

        if (existingTranslation) {
          await queryRunner.manager.update(
            ExtraTranslation,
            existingTranslation.id,
            translationData,
          );
        } else {
          const translation = queryRunner.manager.create(
            ExtraTranslation,
            translationData,
          );
          await queryRunner.manager.save(translation);
        }
      }
    }
  }
}
