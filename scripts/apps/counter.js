export default class SoulboundCounter extends Application {
  constructor(...args) {
    super(...args);
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "counter";
    options.template = "systems/polaris-soulbound/template/apps/counter.hbs";
    options.popOut = true;
    return options;
  }
  /* -------------------------------------------- */
  /**
   * Provide data to the HTML template for rendering
   * @type {Object}
   */
  getData() {
    const data = super.getData();
    if (this.party) {
      data.party = this.party;
      data.soulfire = this.party.soulfire.value;
      data.doom = this.party.doom.value;
    } else {
      data.soulfire = game.settings.get("polaris-soulbound", "soulfire");
      data.doom = game.settings.get("polaris-soulbound", "doom");
    }
    data.canEdit =
      game.user.isGM ||
      game.settings.get("polaris-soulbound", "playerCounterEdit");

    return data;
  }

  render(force = false, options = {}) {
    if (game.settings.get("polaris-soulbound", "showCounter")) {
      let position = game.settings.get("polaris-soulbound", "counterPosition");
      options.top = position.top || window.innerHeight - 200;
      options.left = position.left || 250;
      super.render(force, options);
    }
  }

  async _render(...args) {
    await super._render(...args);
    delete ui.windows[this.appId];
  }

  close() {
    return;
  }

  setCounterDrag() {
    new Draggable(this, this._element, this._element.find(".handle")[0], false);
  }

  setPosition(...args) {
    super.setPosition(...args);
    game.settings.set("polaris-soulbound", "counterPosition", this.position);
  }

  activateListeners(html) {
    super.activateListeners(html);

    new Draggable(this, html, html.find(".handle")[0], false);

    html.find("input").focusin((ev) => {
      ev.target.select();
    });
    // Call setCounter when input is used
    this.input = html.find("input").change(async (ev) => {
      const type = $(ev.currentTarget).attr("data-type");
      SoulboundCounter.setCounter(ev.target.value, type);
    });

    // Call changeCounter when +/- is used
    html.find(".incr,.decr").mousedown(async (ev) => {
      let input = $(ev.target.parentElement).find("input");
      const type = input.attr("data-type");
      const multiplier = $(ev.currentTarget).hasClass("incr") ? 1 : -1;
      $(ev.currentTarget).toggleClass("clicked");
      let newValue = await SoulboundCounter.changeCounter(1 * multiplier, type);
      input[0].value = newValue;
    });

    html.find(".incr,.decr").mouseup((ev) => {
      $(ev.currentTarget).removeClass("clicked");
    });

    html.find(".party a").mousedown(async (ev) => {
      if (ev.button == 0) this.party.sheet.render(true);
      else {
        await game.settings.set("polaris-soulbound", "counterParty", "");
        game.counter.render(true);
      }
    });

    // html.mousedown(ev => {
    //   this.position = duplicate(this.app.position);
    //   this._initial = {x: event.clientX, y: event.clientY};

    //       // Add temporary handlers
    //     window.addEventListener(...this.handlers.dragMove);
    //     window.addEventListener(...this.handlers.dragUp);
    // })
  }

  // ************************* STATIC FUNCTIONS ***************************

  /**
   * Set the counter of (type) to (value)
   * @param value Value to set counter to
   * @param type  Type of counter, "momentum" or "doom"
   */
  static async setCounter(value, type) {
    value = Math.round(value);

    if (!game.user.isGM) {
      game.socket.emit("system.polaris-soulbound", {
        type: "setCounter",
        payload: { value, type },
      });
    } else if (this.party) {
      if (type == "soulfire")
        await this.party.update({ "system.soulfire.value": parseInt(value) });
      else await this.party.update({ "system.doom.value": parseInt(value) });
    } else await game.settings.set("polaris-soulbound", type, value);

    // Emit socket event for users to rerender their counters
    game.socket.emit("system.polaris-soulbound", { type: "updateCounter" });

    // Some actors have effects based on doom, rerender their sheets to reflect the change
    if (type == "doom")
      Object.values(ui.windows)
        .filter((i) => i instanceof ActorSheet)
        .forEach((s) => {
          s.actor.prepareData();
          s.render(true);
        });

    return value;
  }

  /**
   * Change the counter of (type) by (value)
   * @param diff How much to change the counter
   * @param type  Type of counter, "momentum" or "doom"
   */
  static async changeCounter(diff, type) {
    let value = this.getValue(type);
    return await SoulboundCounter.setCounter(value + diff, type);
  }

  static getValue(type) {
    if (this.party) return parseInt(this.party[type].value);
    else return game.settings.get("polaris-soulbound", type);
  }

  get soulfire() {
    return SoulboundCounter.getValue("soulfire");
  }

  get doom() {
    return SoulboundCounter.getValue("doom");
  }

  static get party() {
    return game.actors.get(
      game.settings.get("polaris-soulbound", "counterParty")
    );
  }

  get party() {
    return SoulboundCounter.party;
  }
}
