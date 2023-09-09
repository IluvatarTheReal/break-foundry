// Shamelessly stolen utils from the DND5e system

/* -------------------------------------------- */
/*  Formulas                                    */
/* -------------------------------------------- */

/**
 * Convert a bonus value to a simple integer for displaying on the sheet.
 * @param {number|string|null} bonus  Bonus formula.
 * @param {object} [data={}]          Data to use for replacing @ strings.
 * @returns {number}                  Simplified bonus as an integer.
 * @protected
 */
export function simplifyBonus(bonus, data = {}) {
	if (!bonus) return 0;
	if (Number.isNumeric(bonus)) return Number(bonus);
	try {
		const roll = new Roll(bonus, data);
		return roll.isDeterministic ? Roll.safeEval(roll.formula) : 0;
	} catch (error) {
		console.error(error);
		return 0;
	}
}

/* -------------------------------------------- */
/*  Object Helpers                              */
/* -------------------------------------------- */

/**
 * Sort the provided object by its values or by an inner sortKey.
 * @param {object} obj        The object to sort.
 * @param {string} [sortKey]  An inner key upon which to sort.
 * @returns {object}          A copy of the original object that has been sorted.
 */
export function sortObjectEntries(obj, sortKey) {
	let sorted = Object.entries(obj);
	if (sortKey) sorted = sorted.sort((a, b) => a[1][sortKey].localeCompare(b[1][sortKey]));
	else sorted = sorted.sort((a, b) => a[1].localeCompare(b[1]));
	return Object.fromEntries(sorted);
}

/* -------------------------------------------- */

/**
 * Retrieve the indexed data for a Document using its UUID. Will never return a result for embedded documents.
 * @param {string} uuid  The UUID of the Document index to retrieve.
 * @returns {object}     Document's index if one could be found.
 */
export function indexFromUuid(uuid) {
	const parts = uuid.split(".");
	let index;

	// Compendium Documents
	if (parts[0] === "Compendium") {
		const [, scope, packName, id] = parts;
		const pack = game.packs.get(`${scope}.${packName}`);
		index = pack?.index.get(id);
	}

	// World Documents
	else if (parts.length < 3) {
		const [docName, id] = parts;
		const collection = CONFIG[docName].collection.instance;
		index = collection.get(id);
	}

	return index || null;
}

/* -------------------------------------------- */

/**
 * Creates an HTML document link for the provided UUID.
 * @param {string} uuid  UUID for which to produce the link.
 * @returns {string}     Link to the item or empty string if item wasn't found.
 */
export function linkForUuid(uuid) {
	return TextEditor._createContentLink(["", "UUID", uuid]).outerHTML;
}

/* -------------------------------------------- */
/*  Validators                                  */
/* -------------------------------------------- */

/**
 * Ensure the provided string contains only the characters allowed in identifiers.
 * @param {string} identifier
 * @returns {boolean}
 */
function isValidIdentifier(identifier) {
	return /^([a-z0-9_-]+)$/i.test(identifier);
}

export const validators = {
	isValidIdentifier: isValidIdentifier
};

/* -------------------------------------------- */
/*  Handlebars Template Helpers                 */
/* -------------------------------------------- */

/**
 * Define a set of template paths to pre-load. Pre-loaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name
 * (e.g. "break.actor-traits").
 * @returns {Promise}
 */
export async function preloadHandlebarsTemplates() {
	const partials = [
		// Shared Partials
		"systems/break/templates/actors/parts/active-effects.hbs",
		"systems/break/templates/apps/parts/trait-list.hbs",

		// Actor Sheet Partials
		"systems/break/templates/actors/parts/actor-traits.hbs",
		"systems/break/templates/actors/parts/actor-inventory.hbs",
		"systems/break/templates/actors/parts/actor-features.hbs",
		"systems/break/templates/actors/parts/actor-spellbook.hbs",
		"systems/break/templates/actors/parts/actor-warnings.hbs",

		// Item Sheet Partials
		"systems/break/templates/items/parts/item-action.hbs",
		"systems/break/templates/items/parts/item-activation.hbs",
		"systems/break/templates/items/parts/item-advancement.hbs",
		"systems/break/templates/items/parts/item-description.hbs",
		"systems/break/templates/items/parts/item-mountable.hbs",
		"systems/break/templates/items/parts/item-spellcasting.hbs",
		"systems/break/templates/items/parts/item-summary.hbs",

		// Journal Partials
		"systems/break/templates/journal/parts/journal-table.hbs",

		// Advancement Partials
		"systems/break/templates/advancement/parts/advancement-ability-score-control.hbs",
		"systems/break/templates/advancement/parts/advancement-controls.hbs",
		"systems/break/templates/advancement/parts/advancement-spell-config.hbs"
	];

	const paths = {};
	for (const path of partials) {
		paths[path] = path;
		paths[`break.${path.split("/").pop().replace(".hbs", "")}`] = path;
	}

	return loadTemplates(paths);
}

/* -------------------------------------------- */

/**
 * A helper that fetch the appropriate item context from root and adds it to the first block parameter.
 * @param {object} context  Current evaluation context.
 * @param {object} options  Handlebars options.
 * @returns {string}
 */
function itemContext(context, options) {
	if (arguments.length !== 2) throw new Error("#break-itemContext requires exactly one argument");
	if (foundry.utils.getType(context) === "function") context = context.call(this);

	const ctx = options.data.root.itemContext?.[context.id];
	if (!ctx) {
		const inverse = options.inverse(this);
		if (inverse) return options.inverse(this);
	}

	return options.fn(context, { data: options.data, blockParams: [ctx] });
}

/* -------------------------------------------- */

/**
 * Register custom Handlebars helpers used by 5e.
 */
export function registerHandlebarsHelpers() {
	Handlebars.registerHelper({
		getProperty: foundry.utils.getProperty,
		"break-linkForUuid": linkForUuid,
		"break-itemContext": itemContext
	});
}

/* -------------------------------------------- */
/*  Config Pre-Localization                     */
/* -------------------------------------------- */

/**
 * Storage for pre-localization configuration.
 * @type {object}
 * @private
 */
const _preLocalizationRegistrations = {};

/**
 * Mark the provided config key to be pre-localized during the init stage.
 * @param {string} configKeyPath          Key path within `CONFIG.BREAK` to localize.
 * @param {object} [options={}]
 * @param {string} [options.key]          If each entry in the config enum is an object,
 *                                        localize and sort using this property.
 * @param {string[]} [options.keys=[]]    Array of localization keys. First key listed will be used for sorting
 *                                        if multiple are provided.
 * @param {boolean} [options.sort=false]  Sort this config enum, using the key if set.
 */
export function preLocalize(configKeyPath, { key, keys = [], sort = false } = {}) {
	if (key) keys.unshift(key);
	_preLocalizationRegistrations[configKeyPath] = { keys, sort };
}

/* -------------------------------------------- */

/**
 * Execute previously defined pre-localization tasks on the provided config object.
 * @param {object} config  The `CONFIG.BREAK` object to localize and sort. *Will be mutated.*
 */
export function performPreLocalization(config) {
	for (const [keyPath, settings] of Object.entries(_preLocalizationRegistrations)) {
		const target = foundry.utils.getProperty(config, keyPath);
		_localizeObject(target, settings.keys);
		if (settings.sort)
			foundry.utils.setProperty(config, keyPath, sortObjectEntries(target, settings.keys[0]));
	}
}

/* -------------------------------------------- */

/**
 * Localize the values of a configuration object by translating them in-place.
 * @param {object} obj       The configuration object to localize.
 * @param {string[]} [keys]  List of inner keys that should be localized if this is an object.
 * @private
 */
function _localizeObject(obj, keys) {
	for (const [k, v] of Object.entries(obj)) {
		const type = typeof v;
		if (type === "string") {
			obj[k] = game.i18n.localize(v);
			continue;
		}

		if (type !== "object") {
			console.error(
				new Error(
					`Pre-localized configuration values must be a string or object, ${type} found for "${k}" instead.`
				)
			);
			continue;
		}
		if (!keys?.length) {
			console.error(
				new Error("Localization keys must be provided for pre-localizing when target is an object.")
			);
			continue;
		}

		for (const key of keys) {
			if (!v[key]) continue;
			v[key] = game.i18n.localize(v[key]);
		}
	}
}

/* -------------------------------------------- */
/*  Migration                                   */
/* -------------------------------------------- */

/**
 * Synchronize the spells for all Actors in some collection with source data from an Item compendium pack.
 * @param {CompendiumCollection} actorPack      An Actor compendium pack which will be updated
 * @param {CompendiumCollection} spellsPack     An Item compendium pack which provides source data for spells
 * @returns {Promise<void>}
 */
//   export async function synchronizeActorSpells(actorPack, spellsPack) {

//     // Load all actors and spells
//     const actors = await actorPack.getDocuments();
//     const spells = await spellsPack.getDocuments();
//     const spellsMap = spells.reduce((obj, item) => {
//       obj[item.name] = item;
//       return obj;
//     }, {});

//     // Unlock the pack
//     await actorPack.configure({locked: false});

//     // Iterate over actors
//     SceneNavigation.displayProgressBar({label: "Synchronizing Spell Data", pct: 0});
//     for ( const [i, actor] of actors.entries() ) {
//       const {toDelete, toCreate} = _synchronizeActorSpells(actor, spellsMap);
//       if ( toDelete.length ) await actor.deleteEmbeddedDocuments("Item", toDelete);
//       if ( toCreate.length ) await actor.createEmbeddedDocuments("Item", toCreate, {keepId: true});
//       console.debug(`${actor.name} | Synchronized ${toCreate.length} spells`);
//       SceneNavigation.displayProgressBar({label: actor.name, pct: ((i / actors.length) * 100).toFixed(0)});
//     }

//     // Re-lock the pack
//     await actorPack.configure({locked: true});
//     SceneNavigation.displayProgressBar({label: "Synchronizing Spell Data", pct: 100});
//   }

/* -------------------------------------------- */

/**
 * A helper function to synchronize spell data for a specific Actor.
 * @param {Actor5e} actor
 * @param {Object<string,Item5e>} spellsMap
 * @returns {{toDelete: string[], toCreate: object[]}}
 * @private
 */
// function _synchronizeActorSpells(actor, spellsMap) {
// 	const spells = actor.itemTypes.spell;
// 	const toDelete = [];
// 	const toCreate = [];
// 	if (!spells.length) return { toDelete, toCreate };

// 	for (const spell of spells) {
// 		const source = spellsMap[spell.name];
// 		if (!source) {
// 			console.warn(`${actor.name} | ${spell.name} | Does not exist in spells compendium pack`);
// 			continue;
// 		}

// 		// Combine source data with the preparation and uses data from the actor
// 		const spellData = source.toObject();
// 		const { preparation, uses, save } = spell.toObject().system;
// 		Object.assign(spellData.system, { preparation, uses });
// 		spellData.system.save.dc = save.dc;
// 		foundry.utils.setProperty(spellData, "flags.core.sourceId", source.uuid);

// 		// Record spells to be deleted and created
// 		toDelete.push(spell.id);
// 		toCreate.push(spellData);
// 	}
// 	return { toDelete, toCreate };
// }
