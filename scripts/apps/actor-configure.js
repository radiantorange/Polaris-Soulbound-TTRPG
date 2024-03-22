export default class ActorConfigure extends FormApplication
{
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "actor-configure",
            template : "systems/polaris-soulbound/template/apps/actor-configure.hbs",
            width:420
        })
    }

    
    async _updateObject(event, formData) {
        this.object.update(formData)
    }
}