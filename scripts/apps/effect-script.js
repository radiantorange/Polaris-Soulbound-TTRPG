export default class EffectScriptConfig extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "effect-script-config",
      template: "systems/polaris-soulbound/template/apps/effect-script.hbs",
      height: 400,
      width: 500,
      title: game.i18n.localize("HEADER.EFFECT_SCRIPT_CONFIG"),
      editable: game.user.isGM,
      resizable: true,
    });
  }

  getData() {
    let data = super.getData();
    data.script = this.change?.script;
    data.description = this.change?.description;
    data.hide = this.change?.hide;
    data.aceActive = game.modules.get("acelib")?.active;
    return data;
  }

  _updateObject(event, formData) {
    if (this.scriptEditor) {
      formData.script = this.scriptEditor.getValue();
    }

    if (this.hideEditor) {
      formData.hide = this.hideEditor.getValue();
    }

    let script = formData.script || "";
    let description = formData.description || "";
    let hide = formData.hide || "";

    return this.object.effect.update({
      [`flags.polaris-soulbound.changeCondition.${this.object.index}`]: {
        script,
        description,
        hide,
      },
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    try {
      if (game.modules.get("acelib")?.active) {
        this.scriptEditor = ace.edit(html.find(".ace-editor.script input")[0]);
        this.scriptEditor.setOptions(
          mergeObject(ace.userSettings, {
            mode: "ace/mode/js",
            keyboardHandler: "ace/mode/vscode",
          })
        );
        this.scriptEditor.setValue(this.change?.script);

        this.hideEditor = ace.edit(html.find(".ace-editor.hide input")[0]);
        this.hideEditor.setOptions(
          mergeObject(ace.userSettings, {
            mode: "ace/mode/js",
            keyboardHandler: "ace/mode/vscode",
          })
        );
        this.hideEditor.setValue(this.change?.hide);
      }
    } catch (e) {
      console.error("Error initializing ACE Editor: " + e);
    }
  }

  get change() {
    return this.object.effect.changeConditionals[this.object.index];
  }
}
