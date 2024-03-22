import { AgeOfSigmarActor } from "./actor/actor-aos.js";
import { AgeOfSigmarItem } from "./item/item-aos.js";
import { PlayerSheet } from "./actor/sheet/player-sheet.js";
import { NpcSheet } from "./actor/sheet/npc-sheet.js";
import { PartySheet } from "./actor/sheet/party-sheet.js";
import { AgeOfSigmarItemSheet } from "./item/sheet/item-sheet.js";
import { initializeHandlebars } from "./system/handlebars.js";
import hooks from "./system/hooks.js"
import AOS from "./system/config.js"
import Migration from "./system/migrations.js";
import SoulboundUtility from "./system/utility.js";
import Test from "./system/tests/test.js";
import CombatTest from "./system/tests/combat-test.js";
import SpellTest from "./system/tests/spell-test.js";
import MiracleTest from "./system/tests/miracle-test.js";
import ItemTraits from "./apps/item-traits.js"
import AgeOfSigmarEffect from "./system/effect.js";
import AgeOfSigmarEffectSheet from "./apps/active-effect-config.js";
import SoulboundCounter from "./apps/counter.js";
import ModuleUpdater from "./apps/module-updater.js";
import ModuleInitializer from "./apps/module-initialization.js";
import TagManager from "./system/tag-manager.js";
import ZoneConfig from "./apps/zone-config.js";
import CharacterCreation from "./apps/character-creation.js";
import { Level4TextPageSheet } from "./apps/journal-sheet.js";
import { PlayerModel } from "./model/actor/player.js";
import { NPCModel } from "./model/actor/npc.js";
import { PartyModel } from "./model/actor/party.js";
import { AethericDeviceModel } from "./model/item/aethericDevice.js";
import { ArmourModel } from "./model/item/armour.js";
import { EquipmentModel } from "./model/item/equipment.js";
import { MiracleModel } from "./model/item/miracle.js";
import { RuneModel } from "./model/item/rune.js";
import { SpellModel } from "./model/item/spell.js";
import { TalentModel } from "./model/item/talent.js";
import { WeaponModel } from "./model/item/weapon.js";
import { PartyItemModel } from "./model/item/partyItem.js";
import { ArchetypeModel } from "./model/item/archetype.js";

Hooks.once("init", () => {


  // #if _ENV === "development"
  CONFIG.debug.soulbound = true;
  SoulboundUtility.log("Development Mode: Logs on")
  //#endif

    CONFIG.Actor.documentClass = AgeOfSigmarActor;
    CONFIG.Item.documentClass = AgeOfSigmarItem;
    CONFIG.ActiveEffect.documentClass = AgeOfSigmarEffect

    CONFIG.Actor.dataModels["player"] = PlayerModel;
    CONFIG.Actor.dataModels["npc"] = NPCModel;
    CONFIG.Actor.dataModels["party"] = PartyModel;

    CONFIG.Item.dataModels["aethericDevice"] = AethericDeviceModel;
    CONFIG.Item.dataModels["armour"] = ArmourModel;
    CONFIG.Item.dataModels["equipment"] = EquipmentModel;
    CONFIG.Item.dataModels["miracle"] = MiracleModel;
    CONFIG.Item.dataModels["rune"] = RuneModel;
    CONFIG.Item.dataModels["spell"] = SpellModel;
    CONFIG.Item.dataModels["talent"] = TalentModel;
    CONFIG.Item.dataModels["weapon"] = WeaponModel;
    CONFIG.Item.dataModels["partyItem"] = PartyItemModel;
    CONFIG.Item.dataModels["archetype"] = ArchetypeModel;



    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("polaris-soulbound", PlayerSheet, { types: ["player"], makeDefault: true });
    Actors.registerSheet("polaris-soulbound", NpcSheet, { types: ["npc"], makeDefault: true });
    Actors.registerSheet("polaris-soulbound", PartySheet, { types: ["party"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("polaris-soulbound", AgeOfSigmarItemSheet, { makeDefault: true });
    DocumentSheetConfig.registerSheet(ActiveEffect, "polaris-soulbound", AgeOfSigmarEffectSheet, { makeDefault: true, label : "Soulbound Active Effect Config" });
    DocumentSheetConfig.registerSheet(JournalEntryPage, "polaris-soulbound", Level4TextPageSheet, { types : ["text"], makeDefault: true, label : "Soulbound Journal Sheet" });
    initializeHandlebars();
    
    game.aos = {
        config : AOS,
        migration : Migration,
        utility : SoulboundUtility,
        rollClass : {
            Test,
            CombatTest,
            SpellTest,
            MiracleTest
        },
        apps: {
            ItemTraits,
            ModuleUpdater,
            ModuleInitializer,
            ZoneConfig,
            CharacterCreation
        },
        tags: new TagManager()
    };
    
    game.counter = new SoulboundCounter()
    
    CONFIG.fontDefinitions["Quadrant-Regular"] = {editor : true, fonts : []}
    CONFIG.defaultFontFamily = "Quadrant-Regular"
    CONFIG.canvasTextStyle._fontFamily = "Quadrant-Regular"
});

hooks();