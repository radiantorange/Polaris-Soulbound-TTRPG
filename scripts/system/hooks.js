import AOS_MacroUtil from "./macro.js";

import SoulboundChat from "./chat.js";
import Migration from "./migrations.js";
import FoundryOverrides from "./overrides.js";
import SoulboundUtility from "./utility.js";
import BugReportFormSoulbound from "../apps/bug-report.js";

export default function registerHooks() {
  Hooks.once("init", () => {
    game.settings.register("polaris-soulbound", "initiativeRule", {
      name: "SETTING.INIT_RULE",
      hint: "SETTING.INIT_HINT",
      scope: "world",
      config: true,
      default: "default",
      type: String,
      restricted: true,
      choices: {
        default: "SETTING.INIT_DEFAULT",
        roll1d6: "SETTING.INIT_ROLL1d",
        roll2d6: "SETTING.INIT_ROLL2d",
      },
      onChange: (rule) => {
        _registerInitiative(rule);
      },
    });

    game.settings.register("polaris-soulbound", "systemMigrationVersion", {
      scope: "world",
      config: false,
      default: "",
      type: String,
    });

    game.settings.register("polaris-soulbound", "soulfire", {
      name: "Soulfire",
      hint: "",
      scope: "world",
      config: false,
      default: 0,
      type: Number,
    });
    game.settings.register("polaris-soulbound", "doom", {
      name: "Doom",
      hint: "",
      scope: "world",
      config: false,
      default: 0,
      type: Number,
    });
    game.settings.register("polaris-soulbound", "playerCounterEdit", {
      name: "Player Counter Edit",
      hint: "",
      scope: "world",
      config: false,
      default: true,
      type: Boolean,
    });
    game.settings.register("polaris-soulbound", "counterParty", {
      name: "Counter Party Link",
      hint: "",
      scope: "world",
      config: false,
      default: "",
      type: String,
    });

    game.settings.register("polaris-soulbound", "counterPosition", {
      name: "Counter Position",
      hint: "",
      scope: "client",
      config: false,
      default: {},
      type: Object,
    });

    game.settings.register("polaris-soulbound", "showCounter", {
      name: "Show Counter",
      hint: "Show the Soulfire / Doom Counter",
      scope: "client",
      config: true,
      default: true,
      type: Boolean,
    });

    game.settings.register("polaris-soulbound", "bugReportName", {
      name: "Bug Report Name",
      scope: "world",
      config: false,
      default: "",
      type: String,
    });

    game.settings.register("polaris-soulbound", "loseTarget", {
      name: "SETTING.TARGET_RULE",
      hint: "SETTING.TARGET_HINT",
      scope: "client",
      config: true,
      default: true,
      type: Boolean,
    });

    game.macro = AOS_MacroUtil;

    _registerInitiative(
      game.settings.get("polaris-soulbound", "initiativeRule")
    );

    game.socket.on("system.polaris-soulbound", async (data) => {
      if (data.type == "updateCounter") {
        game.counter.render(true);
      } else if (data.type == "setCounter" && game.user.isGM) {
        if (game.counter.party)
          game.counter.party.update({
            [`data.${data.payload.type}.value`]: parseInt(data.payload.value),
          });
        else
          await game.settings.set(
            "polaris-soulbound",
            data.payload.type,
            data.payload.value
          );
        game.counter.render(true);
      }
    });
  });

  Hooks.on(
    "getChatLogEntryContext",
    SoulboundChat.addChatMessageContextOptions
  );

  Hooks.on("renderChatLog", (app, html) =>
    SoulboundChat.activateListeners(html)
  );

  Hooks.on("renderChatMessage", (message, html) => {
    let item = html.find(".polaris-soulbound.chat.item");
    if (item.length) {
      item.attr("draggable", true);
      item[0].addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            type: "itemFromChat",
            payload: message.getFlag("polaris-soulbound", "itemData"),
          })
        );
      });
    }
  });

  /**
   * Create a macro when dropping an entity on the hotbar
   * Item      - open roll dialog for item
   */
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.type == "Item" || data.type == "Actor") {
      createMacro(bar, data, slot);
      return false;
    }
  });

  async function createMacro(bar, data, slot) {
    // Create item macro if rollable item - weapon, spell, prayer, trait, or skill
    let document = await fromUuid(data.uuid);
    let macro;
    if (document.documentName == "Item") {
      let command = `game.macro.rollItemMacro("${document.name}", "${document.type}");`;
      macro = game.macros.contents.find(
        (m) => m.name === document.name && m.command === command
      );
      if (!macro) {
        macro = await Macro.create(
          {
            name: document.name,
            type: "script",
            img: document.img,
            command: command,
          },
          { displaySheet: false }
        );
      }
    } else if (document.documentName == "Actor") {
      macro = await Macro.create(
        {
          name: document.name,
          type: "script",
          img: document.img,
          command: `game.actors.get("${document.id}").sheet.render(true)`,
        },
        { displaySheet: false }
      );
    }
    if (macro) game.user.assignHotbarMacro(macro, slot);
  }

  /** Helpers  */

  function _registerInitiative(rule) {
    switch (rule) {
      case "default":
        CONFIG.Combat.initiative = {
          formula: "@combat.initiative.total",
          decimals: 0,
        };
        break;
      case "roll1d6":
        CONFIG.Combat.initiative = {
          formula: "1d6 + @combat.initiative.total",
          decimals: 0,
        };
        break;
      case "roll2d6":
        CONFIG.Combat.initiative = {
          formula: "2d6 + @combat.initiative.total",
          decimals: 0,
        };
        break;
    }
  }

  Hooks.on("ready", () => {
    Migration.checkMigration();
    FoundryOverrides();
    game.counter.render(true);
    game.aos.tags.createTags();

    CONFIG.ChatMessage.documentClass.prototype.getTest = function () {
      let rollData = this.getFlag("polaris-soulbound", "rollData");
      if (rollData) return game.aos.rollClass.Test.recreate(rollData);
    };

    for (let key in game.aos.config) {
      if (typeof game.aos.config[key] == "object") {
        for (let prop in game.aos.config[key]) {
          if (typeof game.aos.config[key][prop] == "string")
            game.aos.config[key][prop] = game.i18n.localize(
              game.aos.config[key][prop]
            );
        }
      }
    }

    for (let effect of CONFIG.statusEffects) {
      effect.name = game.i18n.localize(effect.name);
    }

    game.actors.contents.forEach((a) => {
      SoulboundUtility.log("Post Ready Preparation");
      if (a.postReadyEffects?.length || a.derivedEffects?.length) {
        a._initialize();
      }
    });
  });

  /**
   * Add right click option to actors to add all basic skills
   */
  Hooks.on("getActorDirectoryEntryContext", async (html, options) => {
    let canLink = (li) => {
      let actor = game.actors.get(li.attr("data-document-id"));
      return actor.type == "party";
    };
    options.push({
      name: game.i18n.localize("ACTOR.COUNTER_LINK"),
      condition: game.user.isGM && canLink,
      icon: '<i class="fas fa-link"></i>',
      callback: async (target) => {
        await game.settings.set(
          "polaris-soulbound",
          "counterParty",
          target.attr("data-document-id")
        );
        game.counter.render(true);
      },
    });
  });

  Hooks.on("preCreateActiveEffect", (effect, data, options, user) => {
    if (effect.parent?.type == "spell" || effect.parent?.type == "miracle")
      effect.updateSource({ transfer: false });

    if (
      effect.item &&
      effect.item.equippable &&
      effect.parent.documentName == "Item"
    )
      effect.updateSource({ "flags.polaris-soulbound.requiresEquip": true });
    else if (effect.item && effect.parent.documentName == "Actor") {
      effect.updateSource({
        "flags.polaris-soulbound.requiresEquip": getProperty(
          data,
          "flags.polaris-soulbound.requiresEquip"
        ),
      });
      effect.updateSource({ disabled: effect.disabled });
    }
  });

  Hooks.on("updateActor", (actor, updateData) => {
    if (
      actor.type == "party" &&
      actor.id == game.settings.get("polaris-soulbound", "counterParty")
    ) {
      if (
        hasProperty(updateData, "system.soulfire.value") ||
        hasProperty(updateData, "system.doom.value")
      )
        game.counter.render(true);
    }
  });

  Hooks.on("renderSidebarTab", async (app, html) => {
    if (app.options.id == "settings") {
      let button = $(
        `<button class='bug-report'>${game.i18n.localize(
          "BUTTON.PostBug"
        )}</button>`
      );

      button.click((ev) => {
        new BugReportFormSoulbound().render(true);
      });

      button.insertAfter(html.find("#game-details"));
    }
  });

  Hooks.on("preCreateScene", (scene, data) => {
    scene.updateSource({ gridDistance: 5, gridUnits: "ft" });
  });

  Hooks.on("updateCombat", (combat) => {
    let actor = combat.combatant.actor;
    if (actor.combat.mettle.value < actor.combat.mettle.max)
      actor.update({
        "system.combat.mettle.value":
          actor.combat.mettle.value + actor.combat.mettle.regain,
      });

    let zones = game.aos.utility
      .withinDrawings(combat.combatant.token)
      .filter((d) => d.getFlag("polaris-soulbound", "hazard"));
    zones.forEach((z) => {
      let hazard = z.getFlag("polaris-soulbound", "hazard");
      let ignoreArmour = z.getFlag("polaris-soulbound", "ignoreArmour");
      let damage = game.aos.config.zoneHazardDamage[hazard];
      actor.applyDamage(damage, { ignoreArmour });
    });
  });

  Hooks.on("preUpdateToken", (token, updateData) => {
    if (Number.isNumeric(updateData.x) || Number.isNumeric(updateData.y)) {
      let newX = updateData.x || token.x;
      let newY = updateData.y || token.y;

      let oldX = token.x;
      let oldY = token.y;

      newX += canvas.grid.size / 2;
      newY += canvas.grid.size / 2;
      oldX += canvas.grid.size / 2;
      oldY += canvas.grid.size / 2;

      if (token.parent?.drawings) {
        for (let drawing of token.parent.drawings.contents) {
          if (
            SoulboundUtility.pointInDrawing({ x: newX, y: newY }, drawing) &&
            !SoulboundUtility.pointInDrawing({ x: oldX, y: oldY }, drawing)
          ) {
            token.actor.onEnterDrawing(drawing);
          } else if (
            !SoulboundUtility.pointInDrawing({ x: newX, y: newY }, drawing) &&
            SoulboundUtility.pointInDrawing({ x: oldX, y: oldY }, drawing)
          ) {
            token.actor.onLeaveDrawing(drawing);
          }
        }
      }
    }
  });

  Hooks.on("preCreateJournalEntry", _keepID);
  Hooks.on("preCreateScene", _keepID);
  Hooks.on("preCreateRollTable", _keepID);

  function _keepID(document, data, options) {
    if (data._id) options.keepId = SoulboundUtility._keepID(data._id, document);
  }
}
