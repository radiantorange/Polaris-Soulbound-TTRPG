

export default class ModuleUpdater extends Dialog {

    constructor(module, html) 
    {

        super({
            title: `${game.i18n.localize("UpdaterTitle1")} ${module.title} ${game.i18n.localize("UpdaterTitle2")}`,
            content: html,
            module,
            buttons:
            {
              update:
              {
                label: game.i18n.localize("BUTTON.UPDATE"),
                callback: html => {
                    if (!game.settings.get(module.id, "initialized"))
                        return ui.notifications.notify(game.i18n.localize("UPDATER.Error"))
                    let settings = this.getUpdateSettings(html)
                    this.updateImportedContent(settings)
                }
              }
            },
            default: "update"
          })
    }

    static async create(module)
    {
        let html = await renderTemplate("systems/polaris-soulbound/template/apps/module-updater.hbs", module)
        return new this(module, html)
    }

    getUpdateSettings(html)
    {
        let updateSettings = {}
        updateSettings.actors = html.find('[name="actors"]').is(':checked')
        updateSettings.journals = html.find('[name="journals"]').is(':checked')
        updateSettings.items = html.find('[name="items"]').is(':checked')
        updateSettings.tables = html.find('[name="tables"]').is(':checked')
        updateSettings.scenes = html.find('[name="scenes"]').is(':checked')
        updateSettings.excludeNameChange = html.find('[name="excludeNameChange"]').is(':checked')
        return updateSettings
    }

    async updateImportedContent(settings)
    {
        let documents = await this.getDocuments()
        this.count = {created : 0, updated : 0}
        for(let type in settings)
        {
            if (type != "excludeNameChange" && settings[type])
                await this.updateDocuments(documents[type], settings)
        }
        ui.notifications.notify(`${game.i18n.format("UPDATER.Notification", { created: this.count.created,  updated: this.count.updated,  name: this.data.module.id, version: this.data.module.version })}`)

    }

    async updateDocuments(documents, settings)
    {
        if (!documents.length)
            return
        let toCreate = []
        let toDelete = []
        let documentClass
        for (let document of documents)
        {
            if (!documentClass)
                documentClass = CONFIG[document.documentName].documentClass
            if (game[document.collectionName].has(document.id))
            {
                let existingDoc = game[document.collectionName].get(document.id)
                if (!settings.excludeNameChange || (settings.excludeNameChange && document.name == existingDoc.name))
                {
                    let folder = existingDoc.folder
                    let permission = existingDoc.permission
                    toDelete.push(existingDoc.id)
                    let newDoc = document.toObject()
                    newDoc.folder = folder;
                    newDoc.permission = permission
                    toCreate.push(newDoc)
                    console.log(`Updated Document ${document.name}`)
                    this.count.updated++;
                }
            }
            else 
            {
                let folder = document.getFlag(this.data.module.id, "initialization-folder")
                folder = game.folders.getName(folder)
                let newDoc = document.toObject()
                if (folder)
                    newDoc.folder = folder.id
                toCreate.push(newDoc)
                console.log(`Imported Document ${document.name}`)
                this.count.created++;
            }
        }
        await documentClass.deleteDocuments(toDelete)
        let created = await documentClass.createDocuments(toCreate)

        if (documentClass.name == "Scene")
        {
            created.forEach(async s => {
                let thumb = await s.createThumbnail();
                s.update({ "thumb": thumb.thumb })
            })
        }
    }

    async getDocuments()
    {
        let module = this.data.module;
        let packs = module.data.flags.initializationPacks.map(i => game.packs.get(i))
        let documents = {
            actors : [],
            journals : [],
            items : [],
            tables : [],
            scenes : []
        };
        for (let pack of packs)
        {
            let docs = await pack.getDocuments();
            switch (pack.documentName)
            {
                case "Actor": documents.actors = documents.actors.concat(docs)
                    break;
                case "JournalEntry": documents.journals = documents.journals.concat(docs)
                    break;
                case "Item": documents.items = documents.items.concat(docs)
                    break;
                case "RollTable": documents.tables = documents.tables.concat(docs)
                    break;
                case "Scene": documents.scenes = documents.scenes.concat(docs)
                    break;
            }
        }
        return documents
    }
}