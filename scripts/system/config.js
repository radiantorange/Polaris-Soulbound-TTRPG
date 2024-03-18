let AOS = {};

AOS.attributes = {
  body: "ATTRIBUTE.BODY",
  mind: "ATTRIBUTE.MIND",
  soul: "ATTRIBUTE.SOUL",
};

AOS.skills = {
  arcana: "SKILL.ARCANA",
  athletics: "SKILL.ATHLETICS",
  awareness: "SKILL.AWARENESS",
  ballisticSkill: "SKILL.BALLISTIC_SKILL",
  beastHandling: "SKILL.BEAST_HANDLING",
  channelling: "SKILL.CHANNELLING",
  crafting: "SKILL.CRAFTING",
  determination: "SKILL.DETERMINATION",
  devotion: "SKILL.DEVOTION",
  dexterity: "SKILL.DEXTERITY",
  entertain: "SKILL.ENTERTAIN",
  fortitude: "SKILL.FORTITUDE",
  guile: "SKILL.GUILE",
  intimidation: "SKILL.INTIMIDATION",
  intuition: "SKILL.INTUITION",
  lore: "SKILL.LORE",
  medicine: "SKILL.MEDICINE",
  might: "SKILL.MIGHT",
  nature: "SKILL.NATURE",
  reflexes: "SKILL.REFLEXES",
  stealth: "SKILL.STEALTH",
  survival: "SKILL.SURVIVAL",
  theology: "SKILL.THEOLOGY",
  weaponSkill: "SKILL.WEAPON_SKILL",
};

AOS.skillAttributes = {
  arcana: "mind",
  athletics: "body",
  awareness: "mind",
  ballisticSkill: "body",
  beastHandling: "soul",
  channelling: "mind",
  crafting: "mind",
  determination: "soul",
  devotion: "soul",
  dexterity: "body",
  entertain: "soul",
  fortitude: "body",
  guile: "mind",
  intimidation: "soul",
  intuition: "mind",
  lore: "mind",
  medicine: "mind",
  might: "body",
  nature: "mind",
  reflexes: "body",
  stealth: "body",
  survival: "mind",
  theology: "mind",
  weaponSkill: "body",
};

AOS.availability = {
  "": "-",
  common: "AVAILABILITY.COMMON",
  rare: "AVAILABILITY.RARE",
  exotic: "AVAILABILITY.EXOTIC",
  special: "AVAILABILITY.SPECIAL",
};

AOS.armourType = {
  light: "TYPE.LIGHT",
  medium: "TYPE.MEDIUM",
  heavy: "TYPE.HEAVY",
  shield: "TYPE.SHIELD",
};

AOS.range = {
  self: "RANGE.SELF",
  close: "RANGE.CLOSE",
  short: "RANGE.SHORT",
  medium: "RANGE.MEDIUM",
  long: "RANGE.LONG",
};

AOS.actorSize = {
  0: "ACTOR.NPC_SIZE_TINY",
  1: "ACTOR.NPC_SIZE_SMALL",
  2: "ACTOR.NPC_SIZE_MEDIUM",
  3: "ACTOR.NPC_SIZE_LARGE",
  4: "ACTOR.NPC_SIZE_ENOURMOUS",
  5: "ACTOR.NPC_SIZE_MONSTROUS",
};

AOS.npcType = {
  0: "ACTOR.NPC_SWARM",
  1: "ACTOR.NPC_MINION",
  2: "ACTOR.NPC_WARRIOR",
  3: "ACTOR.NPC_CHAMPION",
  4: "ACTOR.NPC_CHOSEN",
};

AOS.speed = {
  none: "ACTOR.SPEED_NONE",
  slow: "ACTOR.SPEED_SLOW",
  normal: "ACTOR.SPEED_NORMAL",
  fast: "ACTOR.SPEED_FAST",
};

AOS.woundType = {
  minor: "WOUND.LIGHT",
  serious: "WOUND.SERIOUS",
  deadly: "WOUND.DEADLY",
};

AOS.woundDamage = {
  minor: 1,
  serious: 2,
  deadly: 3,
};

AOS.ratings = {
  1: "ABILITIES.POOR_NUM",
  2: "ABILITIES.AVERAGE_NUM",
  3: "ABILITIES.GOOD_NUM",
  4: "ABILITIES.GREAT_NUM",
  5: "ABILITIES.SUPERB_NUM",
  6: "ABILITIES.EXTRAORDINARY_NUM",
};

AOS.durations = {
  instant: "DURATION.INSTANT",
  round: "DURATION.ROUND",
  minute: "DURATION.MINUTE",
  hour: "DURATION.HOUR",
  day: "DURATION.DAY",
  permanent: "DURATION.PERMANENT",
  special: "DURATION.SPECIAL",
};

AOS.zoneCover = {
  partial: "ZONE.PARTIAL",
  total: "ZONE.TOTAL",
};

AOS.zoneCoverBenefit = {
  partial: 1,
  total: 2,
};

AOS.zoneHazard = {
  minor: "ZONE.MINOR",
  major: "ZONE.MAJOR",
  deadly: "ZONE.DEADLY",
};

AOS.zoneHazardDamage = {
  minor: 1,
  major: 3,
  deadly: 5,
};

AOS.zoneObscured = {
  light: "ZONE.LIGHTLY_OBSCURED",
  heavy: "ZONE.HEAVILY_OBSCURED",
};

AOS.Expcost = {
  talentsAndMiracles: 2,
  attributes: [0, 2, 7, 14, 23, 34, 47, 62],
  skillAndFokus: [0, 1, 3, 7],
};

AOS.partyItemCategories = {
  longGoal: "PARTY.LONG_TERM_GOAL",
  shortGoal: "PARTY.SHORT_TERM_GOAL",
  ally: "PARTY.ALLY",
  enemy: "PARTY.ENEMY",
  resource: "PARTY.RESOURCE",
  rumour: "PARTY.RUMOUR",
  fear: "PARTY.FEAR",
  threat: "PARTY.THREAT",
};
AOS.partyItemCategoryLabels = {
  longGoal: "PARTY.COMPLETED",
  shortGoal: "PARTY.COMPLETED",
  ally: "PARTY.ALIVE",
  enemy: "PARTY.ALIVE",
  resource: "PARTY.ACTIVE",
  rumour: "PARTY.ACTIVE",
  fear: "PARTY.ACTIVE",
  threat: "PARTY.ACTIVE",
};

AOS.traits = {
  aetheric: "TRAITS.AETHERIC",
  blast: "TRAITS.BLAST",
  cleave: "TRAITS.CLEAVE",
  close: "TRAITS.CLOSE",
  crushing: "TRAITS.CRUSHING",
  defensive: "TRAITS.DEFENSIVE",
  ineffective: "TRAITS.INEFFECTIVE",
  loud: "TRAITS.LOUD",
  magical: "TRAITS.MAGICAL",
  penetrating: "TRAITS.PENETRATING",
  piercing: "TRAITS.PIERCING",
  range: "TRAITS.RANGE",
  reach: "TRAITS.REACH",
  reload: "TRAITS.RELOAD",
  rend: "TRAITS.REND",
  restraining: "TRAITS.RESTRAINING",
  sigmarite: "TRAITS.SIGMARITE",
  slashing: "TRAITS.SLASHING",
  spread: "TRAITS.SPREAD",
  subtle: "TRAITS.SUBTLE",
  thrown: "TRAITS.THROWN",
  twohanded: "TRAITS.TWOHANDED",
};

AOS.dicePath = "systems/polaris-soulbound/asset/image";
AOS.traitDescriptions = {};
AOS.conditionDescriptions = {
  blinded: `<p><b>Cegado</b></p><p>A Blinded creature cannot see.</p>
  <p>The Difficulty of Mind (Awareness) Tests that rely on
  sight are increased by 2.</p>
  <p>Opposed Mind (Awareness) Tests are made at
  Greater Disadvantage.</p>
  <p>The target’s Melee, Accuracy, and Defence decrease
  one step.</p>`,
  charmed: `<p><b>Hechizado</b></p>
  <p>A Charmed creature cannot attack the source of the
charm, and cannot target it with abilities or spells
that would affect it negatively.</p>
<p>The charmer has Advantage in social interactions
with the Charmed target, and the target has
Disadvantage.</p>`,
  deafened: `<p><b>Ensordecido</b></p>
  <p>A Deafened creature cannot hear.</p>
  <p>The dice pool for any Tests a Deafened creature
makes that require hearing is reduced by 1.</p>`,
  frightened: `<p><b>Asustado</b></p>
  <p>While the source of a Frightened creature’s fear is in
  line of sight, they roll one less die for all Tests. The
  character can not willingly move closer to the source
  of its fear.</p>
  `,
  incapacitated: `<p><b>Incapacitado</b></p>
  <p>An Incapacitated creature can’t Move, take Actions,
or spend Mettle.</p>
<p>Incapacitated creatures can’t defend themselves. The
DN to hit an Incapacitated creature is always 2.</p>`,
  poisoned: `<p><b>Envenenado</b></p>
  <p>A Poisoned creature's dice pool is reduced by 1 for
  all Tests.</p>
  `,
  prone: `<p><b>Tumbado</b></p>
  <p>A Prone creature can only move by crawling (see
    page 140), unless they use their Move to stand up to
    end the Condition.</p>
    <p>The creature’s Melee and Accuracy are decreased one
    step.</p>
    <p>A creature attacking a Prone target from Close Range
    increases their Melee or Accuracy one step.
    <p>A creature attacking a Prone target from outside
    Close Range decreases their Accuracy one step
    per Zone: one step for Short Range, two steps for
    Medium Range, and three steps for Long Range</p>`,
  restrained: `<p><b>Inmovilizado</b></p>
  <p>A Restrained creature cannot move.</p>
  <p>A Restrained creature’s Melee, Accuracy, and Defence
decrease one step.</p>`,
  stunned: `<p><b>Aturdido</b></p>
  <p>A Stunned creature can take either an Action or
Move, but not both.</p>
<p>The creature can’t spend Mettle to take additional
Actions.</p>
<p>The creature’s Speed becomes Slow (see page 140).</p>
<p>The Stunned creature’s Defence decreases one step.</p>`,
  unconscious: `<p><b>Inconsciente</b></p>
  <p>An Unconscious creature immediately drops anything
they are holding, falls Prone, and is Incapacitated.</p>
<p>Unconscious creatures can’t move or speak, and are
unaware of their surroundings.</p>`,
};

AOS.traitsWithValue = ["range", "thrown", "blast"];

AOS.systemEffects = {
  partial: {
    id: "partial",
    label: "EFFECT.PartialCover",
    icon: "icons/svg/tower.svg",
    changes: [
      { key: "defence", mode: 7, value: 1 },
      { key: "difficulty", mode: 6, value: -1 },
    ],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: {
          description: "Ranged Attacks",
          script: "return data.weapon && data.weapon.traitList.range",
        },
        1: { description: "Being Detected", script: "" },
      },
    },
  },
  total: {
    id: "total",
    label: "EFFECT.TotalCover",
    icon: "icons/svg/tower.svg",
    changes: [
      { key: "defence", mode: 7, value: 2 },
      { key: "difficulty", mode: 6, value: -2 },
    ],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: {
          description: "Ranged Attacks",
          script: "return !!(data.weapon && data.weapon.traitList.range)",
        },
        1: { description: "Being Detected", script: "" },
      },
    },
  },
  light: {
    id: "light",
    label: "EFFECT.LightlyObscured",
    icon: "icons/svg/blind.svg",
    changes: [{ key: "difficulty", mode: 6, value: 1 }],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: {
          description: "Mind (Awareness) Tests that rely on sight",
          script: "",
        },
      },
    },
  },
  heavy: {
    id: "heavy",
    label: "EFFECT.HeavilyObscured",
    icon: "icons/svg/blind.svg",
    changes: [
      { key: "difficulty", mode: 6, value: 2 },
      { key: "system.combat.melee.bonus", mode: 2, value: -1 },
      { key: "system.combat.accuracy.bonus", mode: 2, value: -1 },
      { key: "system.combat.defence.bonus", mode: 2, value: -1 },
    ],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: {
          description: "Mind (Awareness) Tests that rely on sight",
          script: "",
        },
      },
    },
  },
  difficult: {
    id: "difficult",
    label: "EFFECT.DifficultTerrain",
    icon: "icons/svg/downgrade.svg",
    changes: [{ key: "difficulty", mode: 6, value: 1 }],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: {
          description: "Body (Reflexes) Tests",
          script: "return data.skillKey == 'reflexes'",
        },
      },
    },
  },
};

CONFIG.statusEffects = [
  {
    id: "blinded",
    name: "CONDITION.BLINDED",
    icon: "systems/polaris-soulbound/asset/icons/blinded.svg",
    changes: [
      { key: "difficulty", mode: 6, value: 2 },
      { key: "system.combat.melee.bonus", mode: 2, value: -1 },
      { key: "system.combat.accuracy.bonus", mode: 2, value: -1 },
      { key: "system.combat.defence.bonus", mode: 2, value: -1 },
    ],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: {
          description: "Mind (Awareness) Tests that rely on sight",
          script: "",
        },
      },
    },
  },
  {
    id: "charmed",
    name: "CONDITION.CHARMED",
    icon: "systems/polaris-soulbound/asset/icons/charmed.svg",
  },
  {
    id: "deafened",
    name: "CONDITION.DEAFENED",
    icon: "systems/polaris-soulbound/asset/icons/deafened.svg",
    changes: [{ key: "bonusDice", mode: 6, value: -1 }],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: { description: "Requires Hearing", script: "" },
      },
    },
  },
  {
    id: "frightened",
    name: "CONDITION.FRIGHTENED",
    icon: "systems/polaris-soulbound/asset/icons/frightened.svg",
    changes: [{ key: "bonusDice", mode: 6, value: -1 }],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: {
          description: "Within line of sight of the source of fear",
          script: "",
        },
      },
    },
  },
  {
    id: "incapacitated",
    name: "CONDITION.INCAPACITATED",
    icon: "systems/polaris-soulbound/asset/icons/incapacitated.svg",
  },
  {
    id: "poisoned",
    name: "CONDITION.POISONED",
    icon: "systems/polaris-soulbound/asset/icons/poisoned.svg",
    changes: [{ key: "bonusDice", mode: 6, value: -1 }],
    flags: {
      "polaris-soulbound.changeCondition": {
        0: { description: "All Tests", script: "return true" },
      },
    },
  },
  {
    id: "prone",
    name: "CONDITION.PRONE",
    icon: "systems/polaris-soulbound/asset/icons/prone.svg",
    changes: [
      { key: "system.combat.melee.bonus", mode: 2, value: -1 },
      { key: "system.combat.accuracy.bonus", mode: 2, value: -1 },
    ],
  },
  {
    id: "restrained",
    name: "CONDITION.RESTRAINED",
    icon: "systems/polaris-soulbound/asset/icons/restrained.svg",
    changes: [
      { key: "system.combat.melee.bonus", mode: 2, value: -1 },
      { key: "system.combat.accuracy.bonus", mode: 2, value: -1 },
      { key: "system.combat.defence.bonus", mode: 2, value: -1 },
    ],
  },
  {
    id: "stunned",
    name: "CONDITION.STUNNED",
    icon: "systems/polaris-soulbound/asset/icons/stunned.svg",
    changes: [
      { key: "system.combat.speeds.foot", mode: 5, value: "slow" },
      { key: "system.combat.defence.bonus", mode: 2, value: -1 },
    ],
  },
  {
    id: "unconscious",
    name: "CONDITION.UNCONSCIOUS",
    icon: "systems/polaris-soulbound/asset/icons/unconscious.svg",
  },
  {
    id: "dead",
    name: "EFFECT.StatusDead", // Foundry Default Text Key
    icon: "systems/polaris-soulbound/asset/icons/dead.svg",
  },
];

export default AOS;
