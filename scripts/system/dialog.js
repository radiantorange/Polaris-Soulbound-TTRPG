import AgeOfSigmarEffect from "./effect.js";

export class RollDialog extends Dialog {

    static get defaultOptions() {
        let options = super.defaultOptions;
        options.classes.push("roll-dialog")
        options.classes.push("polaris-soulbound")
        options.resizable = true;
        return options
    }

    async _render(...args)
    {
        await super._render(...args)
        let automatic = this._runConditional("script")
        this.applyAutomaticChanges(automatic)
    }

    static async create(data) {
        let hide = this.runConditional("hide", data)
        this.removeHiddenChanges(hide, data);
        data.condensedChanges = this.condenseChanges(data.changes);
        return new Promise(async (resolve, reject) => {
            const html = await renderTemplate("systems/polaris-soulbound/template/dialog/common-roll.hbs", data);
            return new this({
                title: data.title,
                content: html,
                actor : data.actor,
                targets : data.targets,
                dialogData : data,
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("BUTTON.ROLL"),
                        callback: async (html) => {
                            let data = this.extractDialogData(html)
                            data.dn = {
                                difficulty : parseInt(html.find("#difficulty")[0].value),
                                complexity : parseInt(html.find("#complexity")[0].value),
                                name : `${game.aos.config.attributes[data.attribute]} ${data.skill ? "(" + game.aos.config.skills[data.skill] + ")" : ""}`
                            }
                            resolve(data);
                        },
                    }
                },
                default: "roll"
            }, {width: 600}).render(true)
        })
    }
    static extractDialogData(html) {
        const attribute = html.find("#attribute")[0].value;
        const skill = html.find("#skill")[0].value;
        const doubleTraining = html.find("#double-training")[0].checked;
        const doubleFocus = html.find("#double-focus")[0].checked;
        const bonusDice = parseInt(html.find("#bonusDice")[0].value);
        const bonusFocus = parseInt(html.find("#bonusFocus")[0].value);
        const triggerToDamage = html.find("#triggerToDamage")[0]?.value;
        const allocation = [];

        return { attribute, skill, doubleTraining, doubleFocus, bonusDice, bonusFocus, triggerToDamage, allocation }
    }

    
    static _dialogData(actor, attribute, skill, options={})
    {
        return {
            attributes : actor.attributes,
            skills : actor.skills,
            skillKey : skill,
            attributeKey: attribute || game.aos.config.skillAttributes[skill],
            difficulty : options.difficulty || 4,
            complexity : options.complexity || 1,
            bonusDice: options.bonusDice || 0, // some spells or miracles grant bonus dice 
            bonusFocus: options.bonusFocus || 0,
            changes : actor.allDialogChanges( {targets : Array.from(game.user.targets).map(t => t.actor)}),
            actor : actor,
            targets : Array.from(game.user.targets),
            resist: options.resist
        }
    }
    static runConditional(type, data) {
        let results = {}
        for (let id in data.changes) {
          let change = data.changes[id];
          try {
            let func = new Function("data", change.conditional[type]).bind({ actor: data.actor, targets: data.targets, effect: change.document })
            results[id] = (func(data) == true) // Only accept true returns
          }
          catch (e) {
            console.error("Something went wrong when processing conditional dialog effect: " + e, change)
            results[id] = false
          }
        }
        return results
      }
  
    _runConditional(type)
    {
      return this.constructor.runConditional(type, this.data.dialogData);
    }
  
    applyAutomaticChanges(automatic) {
      try {
        let automaticIds = Object.keys(automatic).filter(i => automatic[i]);
  
        // If a condensed change includes at least one ID automatically activate, activate the whole change
        let activatedIndex = this.data.dialogData.condensedChanges.map((cc, index) => {
          if (cc.id.some(id => automaticIds.includes(id)))
            return index;
        }).filter(i => Number.isNumeric(i));
  
        let select = this.element.find(".effect-select")[0]
        let options = Array.from(select.children)
        options.forEach((opt, index) => {
          if (activatedIndex.includes(index)) {
            opt.selected = true;
            select.dispatchEvent(new Event("change"))
          }
        })
        if (Object.values(automatic).some(i => i))
          select.focus()
      }
      catch(e)
    {
        console.error("Error applying automatic dialog changes: " + e)
    }

  }

    static removeHiddenChanges(hidden, data)
    {
      for(let id in hidden)
      {
        if (hidden[id])
        {
          delete data.changes[id];
        }
      }
    }

    // Condense effects that have the same description into one clickable element
    static condenseChanges(changes)
    {
      let condensed = [];
      for(let id in changes)
      {
        let existing = condensed.find(i => i.description == changes[id].conditional.description)
        if (existing)
        {
          existing.id.push(id);

          // Only push this change's document if it's unique
          if (!existing.tooltip.find(i => i.id == changes[id].document.id))
          {
            existing.tooltip.push(changes[id].document)
          }
        }
        else 
        {
          condensed.push({id : [id], description : changes[id].conditional.description, tooltip : [changes[id].document]})
        }
      }

      condensed.forEach(i => {
        i.tooltip = `From: ${i.tooltip.map(i => i.name).join(", ")}`
      })
      return condensed
    }

    activateListeners(html)
    {
        super.activateListeners(html)

        this.effectValues = {
            "difficulty" : null,
            "complexity" : null,
            "double-training" : null,
            "double-focus" : null,
            "bonusDice" : null,
            "bonusFocus" : null,
            "triggerToDamage" : null
        }

        this.bounds = {
            "difficulty" : [2, 6]
        }
        

        this.inputs = {}

        html.find("input").focusin(ev => {
            ev.target.select();
        })

        this.inputs.difficulty = html.find('#difficulty').change(ev => {
            this.userEntry.difficulty = parseInt(ev.target.value)
            this.applyEffects()
        })[0]
        this.inputs.complexity = html.find('#complexity').change(ev => {
            this.userEntry.complexity = parseInt(ev.target.value)
            this.applyEffects()
        })[0]

        this.inputs["double-training"] = html.find('#double-training').change(ev => {
            this.userEntry["double-training"] = $(ev.currentTarget).is(":checked")
            this.applyEffects()
        })[0]
        this.inputs["double-focus"] = html.find('#double-focus').change(ev => {
            this.userEntry["double-focus"] = $(ev.currentTarget).is(":checked")
            this.applyEffects()
        })[0]
        this.inputs.bonusDice = html.find('#bonusDice').change(ev => {
            this.userEntry.bonusDice = parseInt(ev.target.value)
            this.applyEffects()
        })[0]
        this.inputs.bonusFocus = html.find('#bonusFocus').change(ev => {
            this.userEntry.bonusFocus = parseInt(ev.target.value)
            this.applyEffects()
        })[0]
        this.inputs.triggerToDamage = html.find('#triggerToDamage').change(ev => {
            this.userEntry.triggerToDamage = ev.target.value
            this.applyEffects()
        })[0]

        html.find(".effect-select").change(this._onEffectSelect.bind(this))

        this.userEntry = {
            "difficulty" : parseInt(this.inputs?.difficulty?.value),
            "complexity" : parseInt(this.inputs?.complexity?.value),
            "double-training" : this.inputs["double-training"].checked,
            "double-focus" : this.inputs["double-focus"].checked,
            "bonusDice" : parseInt(this.inputs.bonusDice.value),
            "bonusFocus" : parseInt(this.inputs.bonusFocus.value),
            "triggerToDamage" : this.inputs["triggerToDamage"]?.value
        }

    }

    _onEffectSelect(ev) 
    {
        // Reset effect values
        this.effectValues = {
            "difficulty" : null,
            "complexity" : null,
            "double-training" : null,
            "double-focus" : null,
            "bonusDice" : null,
            "bonusFocus" : null,
            "triggerToDamage" : null
        }
        
        let changes = $(ev.currentTarget).val()
        .map(index => this.data.dialogData.condensedChanges[index]) // Convert indices to condensed changes
        .reduce((prev, current) => prev.concat(current.id), [])     // Combine all condensed ids
        .map(id => this.data.dialogData.changes[id])                // Turn ids into changes

        for (let c of changes)
        {
            if (AgeOfSigmarEffect.numericTypes.includes(c.key))
                this.effectValues[c.key] = (this.effectValues[c.key] || 0) + parseInt(c.value)
            else if (c.key == "double-training" || c.key == "double-focus" || c.key == "triggerToDamage")
            {
                let value = typeof c.value == "boolean" ? c.value : c.value == "true"
                this.effectValues[c.key] = value
            }
        }
        this.applyEffects()
    }

    applyEffects()
    {
        for (let input in this.inputs)
        {
            if (!this.inputs[input])
                continue
            if (this.effectValues[input] != null)
            {
                if (this.inputs[input].type == "checkbox")
                    this.inputs[input].checked = this.effectValues[input]
                else if (Number.isNumeric(this.effectValues[input]))
                {
                    let newVal = this.userEntry[input] + this.effectValues[input]
                    if (this.bounds[input])
                        this.inputs[input].value = Math.clamped(newVal, this.bounds[input][0], this.bounds[input][1])
                    else 
                        this.inputs[input].value = newVal
                }
                else 
                    this.inputs[input].value = this.effectValues[input]
            }
            else // if not part of effect values, use user entry only
            {
                if (this.inputs[input].type == "checkbox")
                    this.inputs[input].checked = this.userEntry[input]
                else
                    this.inputs[input].value = this.userEntry[input]
            }


        }
    }
}

export class CombatDialog extends RollDialog {
    static async create(data) {
        let hide = this.runConditional("hide", data)
        this.removeHiddenChanges(hide, data);
        data.condensedChanges = this.condenseChanges(data.changes);
        return new Promise(async (resolve, reject) => {
            const html = await renderTemplate("systems/polaris-soulbound/template/dialog/combat-roll.hbs", data);
            return new this({
                title: data.title,
                actor : data.actor,
                targets : data.targets,
                dialogData : data,
                content: html,
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("BUTTON.ROLL"),
                        callback: async (html) => {
                            let testData = this.extractDialogData(html)
                            testData.combat = mergeObject(data.combat, testData.combat)
                            testData.itemId = data.weapon.id
                            testData.dn = this._getDn(data.weapon.name, testData.rating, testData.targetDefence);
                            if (testData.dualWieldingData)
                            {
                                testData.dualWieldingData.primary.dn = this._getDn(data.weapon.name, testData.rating, testData.dualWieldingData.primary.defence)
                                testData.dualWieldingData.secondary.dn = this._getDn(data.actor.items.get(testData.dualWieldingData.secondary.itemId).name, testData.rating, testData.dualWieldingData.secondary.defence)
                            }
    
                            resolve(testData);
                        },
                    }
                },
                default: "roll"
            }, {width: 600}).render(true)
        })
    }
    static extractDialogData(html) {
        let data = super.extractDialogData(html)
        data.rating = parseInt(html.find("#attack")[0].value);
        data.combat = {armour : html.find("#armour")[0].value, bonusDamage : parseInt(html.find("#bonusDamage")[0].value)}
        data.targetDefence = parseInt(html.find("#defence")[0].value);

        if (html.find("#dual-wielding").is(":checked"))
        {
            data.dualWieldingData = {
                primary : {
                    pool : parseInt(html.find(".primary .pool")[0].value),
                    defence : parseInt(html.find(".primary #defence")[0].value),
                    armour : parseInt(html.find(".primary #armour")[0].value),
                    name : html.find(".primary .target-name")[0].textContent,
                    tokenId : html.find(".primary .target-name")[0].dataset.tokenId
                },
                secondary: {
                    pool : parseInt(html.find(".secondary .pool")[0].value),
                    defence : parseInt(html.find(".secondary #defence")[0].value),
                    armour : parseInt(html.find(".secondary #armour")[0].value),
                    itemId : html.find("#dual-weapon")[0].value,
                    name : html.find(".secondary .target-name")[0].textContent,
                    tokenId : html.find(".secondary .target-name")[0].dataset.tokenId
                }
            }
        }

        return data
    }

    static _getDn(name, rating, defence) {
        let difficulty = 4 - (rating - defence);
        difficulty = Math.clamped(difficulty, 2, 6)
        return {name, difficulty, complexity : 1}
    }
        
    static _dialogData(actor, weapon)
    {
        let skill = weapon.category === "melee" ? "weaponSkill" : "ballisticSkill"
        let attribute = weapon.system.attribute || game.aos.config.skillAttributes[skill]
        let data = super._dialogData(actor, attribute, skill)
        data.combat = {
            melee: actor.combat.melee.relative,
            accuracy: actor.combat.accuracy.relative,
            attribute: attribute ,
            skill: skill,
            swarmDice: actor.type === "npc" && actor.isSwarm ? actor.combat.health.toughness.value : 0,
            bonusDamage : 0
        }

        data.showDualWielding = actor.items.filter(i => i.isAttack && i.equipped).length >= 2
        data.weapon = weapon
        data.otherWeapons = actor.items.filter(i => i.isAttack && i.equipped && i.id != weapon.id)
        
        let targets = Array.from(game.user.targets)
        const hasTarget = targets.length; // No additinal Input when target function is used
        data.attackRating = weapon.category === "melee" ? data.combat.melee : data.combat.accuracy
        data.targets = targets

        data.primaryTarget = {
            defence : 3,
            armour : 0
        }
        data.secondaryTarget = duplicate(data.primaryTarget)

        if (hasTarget) {
            data.primaryTarget = {
                name : targets[0].name,
                defence : targets[0].actor.combat.defence.relative,
                armour : targets[0].actor.combat.armour.value,
                tokenId : targets[0].id
            }

            if (targets[1])
            {
                data.secondaryTarget = {
                    name : targets[1].name,
                    defence : targets[1].actor.combat.defence.relative,
                    armour : targets[1].actor.combat.armour.value,
                    tokenId : targets[1].id
                }
            }
            else // Populate secondary target with the same as the primary target
                data.secondaryTarget = duplicate(data.primaryTarget)
        }

        if (game.settings.get("polaris-soulbound", "loseTarget") && canvas.scene) {
            game.user.updateTokenTargets([])
        }

        return data
    }

    _onEffectSelect(ev)
    {
        this.effectValues.bonusDamage = null
        super._onEffectSelect(ev)
    }

    activateListeners(html)
    {
        super.activateListeners(html)

        this.effectValues["bonusDamage"] = null
        this.effectValues["defence"] = null
        this.effectValues["armour"] = null
        this.effectValues["attack"] = null

        this.bounds["defence"] = [1, 6]
        this.bounds["attack"] = [1, 6]

        this.inputs.bonusDamage = html.find('#bonusDamage').change(ev => {
            this.userEntry.bonusDamage = parseInt(ev.target.value)
            this.applyEffects()
        })[0]

        this.inputs.defence = html.find('#defence').change(ev => {
            this.userEntry.defence = parseInt(ev.target.value)
            this.applyEffects()
        })[0]

        this.inputs.armour = html.find('#armour').change(ev => {
            this.userEntry.armour = parseInt(ev.target.value)
            this.applyEffects()
        })[0]

        this.inputs.attack = html.find('#attack').change(ev => {
            this.userEntry.attack  = parseInt(ev.target.value)
            this.applyEffects()
        })[0]

        this.userEntry["bonusDamage"] = parseInt(this.inputs.bonusDamage.value)
        this.userEntry["defence"] = parseInt(this.inputs.defence.value)
        this.userEntry["armour"] = parseInt(this.inputs.armour.value)
        this.userEntry["attack"] = parseInt(this.inputs.attack.value)


        html.find("#attribute, #skill, #double-training, #bonusDice, .effect-select").change(ev => {
            this.updateDualWieldingPools(ev)
        })

        html.find(".pool").change(ev => {
            let parent = $(ev.currentTarget).parents(".dual")[0]
            let dialog = $(ev.currentTarget).parents(".dialog")
            
            let isPrimary = parent.classList.contains("primary")

            let poolSize = this.numberOfDice()

            let inputValue = parseInt(ev.currentTarget.value)

            if (inputValue > poolSize)
            {
                this.updateDualWieldingPools(ev)
                return ui.notifications.error(game.i18n.localize("DIALOG.POOL_INPUT_ERROR"))
            }

            let otherInput
            if (isPrimary)
                otherInput = dialog.find("[name='secondary-pool']")[0]
            else // if isSecondary
                otherInput = dialog.find("[name='primary-pool']")[0]


            otherInput.value = poolSize - inputValue
        })


        html.find("#dual-wielding").change(ev => {
            this.toggleDualWielding(ev)
        })
    }

    toggleDualWielding(ev) {
        let checked = $(ev.currentTarget).is(":checked")
        let el = $(ev.currentTarget).parents(".dialog")
        if (checked)
        {
            el.find(".dual").each((index, element) => {
                element.style.display = "flex"
            })
            el.find(".non-dual").each((index, element) => {
                element.style.display = "none"
            })
            $(ev.currentTarget).parents(".app")[0].style.height = (parseInt($(ev.currentTarget).parents(".app")[0].style.height) + 110) + "px"

            if (this.data.targets.length == 1)
                el.find(".secondary .target-name")[0].textContent = `(${this.data.targets[0].name})`

            this.updateDualWieldingPools(ev)

        }
        else
        {
            el.find(".dual").each((index, element) => {
                element.style.display = "none"
            })
            el.find(".non-dual").each((index, element) => {
                element.style.display = "flex"
            })
            $(ev.currentTarget).parents(".app")[0].style.height = (parseInt($(ev.currentTarget).parents(".app")[0].style.height) - 110) + "px"
        }
    }


    updateDualWieldingPools(ev) {
        let el = $(ev.currentTarget).parents(".dialog")

        let primary = el.find(".dual.primary")
        let secondary = el.find(".dual.secondary")
        let pool = this.numberOfDice()

        let primaryPool = Math.floor(pool / 2)
        let secondaryPool = Math.floor(pool / 2)
        if (pool % 2 != 0)
            primaryPool++

        primary.find(".pool")[0].value = primaryPool
        secondary.find(".pool")[0].value = secondaryPool
    }

    numberOfDice()
    {
        let html = this.element
        let actor = this.data.actor
        let attribute = html.find("#attribute")[0].value
        let skill = html.find("#skill")[0].value
        let doubleTraining = html.find("#double-training").is(":checked")
        let bonusDice = parseInt(html.find("#bonusDice")[0].value)
        let num = actor.attributes[attribute].value + bonusDice
        if (skill)
        {
            let skillObject = this.data.actor.skills[skill]
            num += (doubleTraining ? skillObject.training * 2 : skillObject.training) + skillObject.bonus
        }
        return num
    }
}


export class SpellDialog extends RollDialog {
    static async create(data) {
        let hide = this.runConditional("hide", data)
        this.removeHiddenChanges(hide, data);
        data.condensedChanges = this.condenseChanges(data.changes);
        return new Promise(async (resolve, reject) => {
            const html = await renderTemplate("systems/polaris-soulbound/template/dialog/spell-roll.hbs", data);
            return new this({
                title: data.title,
                dialogData : data,
                actor : data.actor,
                targets : data.targets,
                content: html,
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("BUTTON.ROLL"),
                        callback: async (html) => {
                            let testData = this.extractDialogData(html)
                            testData.itemId = data.spell.id
                            testData.dn = {
                                difficulty : parseInt(html.find("#difficulty")[0].value),
                                complexity : parseInt(html.find("#complexity")[0].value),
                                name : data.spell.name
                            }
                            resolve(testData);
                        },
                    }
                },
                default: "roll"
            }, {width: 600}).render(true)
        })
    }
    
    static _dialogData(actor, spell)
    {
        let skill = "channelling" 
        let attribute = spell.system.attribute || game.aos.config.skillAttributes[skill]
        let data = super._dialogData(actor, attribute, skill)
        mergeObject(data, spell.difficultyNumber)
        data.spell = spell
        if (game.settings.get("polaris-soulbound", "loseTarget") && canvas.scene) {
            game.user.updateTokenTargets([])
        }
        return data
    }    
}

export class MiracleDialog extends RollDialog {
    
    static _dialogData(actor, power)
    {
        let skill = power.test.opposed  ? "devotion" : ""
        let attribute = game.aos.config.skillAttributes[skill]
        let data = super._dialogData(actor, attribute, skill)

        return data
    }    
}