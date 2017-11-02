/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'No Dragon LODs'
    },
    requiredFiles: [],
    getFilesToPatch: function(filenames) {
        return filenames;
    },
    execute: {
        initialize: function(patch, helpers, settings, locals) {
            locals.dragonRace = [];
            locals.dragonSkeletonPath = 'actors\\dragon\\character assets\\skeleton.nif';

            helpers.loadRecords('RACE', false).forEach(function(record) {
                let override = xelib.GetWinningOverride(record);
                if (xelib.GetValue(override, 'ANAM').toLowerCase() === locals.dragonSkeletonPath) {
                    locals.dragonRace.push(String(xelib.GetFormID(record, false, false)));
                };
            });
        },
        process: [{
            load: function(plugin, helpers, settings, locals) {
                return {
                    signature: 'NPC_',
                    filter: function(record) {
                        return locals.dragonRace.includes(String(xelib.GetUIntValue(record, 'RNAM')));
                    }
                }
            },
            patch: function(record, helpers, settings, locals) {
                helpers.logMessage(xelib.Name(record));
                xelib.SetIntValue(record, 'DNAM\\Far away model distance', 0);
            }
        }]
    }
});