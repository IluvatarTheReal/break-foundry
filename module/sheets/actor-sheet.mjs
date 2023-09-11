import { BREAK } from "../helpers/config.mjs";
import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";

class D20Roll extends Roll {
	constructor(formula, data, options) {
		super(formula, data, options);
		if (!this.options.configured) this.configureModifiers();
	}

	/* -------------------------------------------- */

	/**
	 * Create a D20Roll from a standard Roll instance.
	 * @param {Roll} roll
	 * @returns {D20Roll}
	 */
	static fromRoll(roll) {
		const newRoll = new this(roll.formula, roll.data, roll.options);
		Object.assign(newRoll, roll);
		return newRoll;
	}

	/* -------------------------------------------- */

	/**
	 * Advantage mode of a 5e d20 roll
	 * @enum {number}
	 */
	static ADV_MODE = {
		NORMAL: 0,
		ADVANTAGE: 1,
		DISADVANTAGE: -1
	};

	/* -------------------------------------------- */

	/**
	 * A convenience reference for whether this D20Roll has advantage
	 * @type {boolean}
	 */
	get hasAdvantage() {
		return this.options.advantageMode === D20Roll.ADV_MODE.ADVANTAGE;
	}

	/* -------------------------------------------- */

	/**
	 * A convenience reference for whether this D20Roll has disadvantage
	 * @type {boolean}
	 */
	get hasDisadvantage() {
		return this.options.advantageMode === D20Roll.ADV_MODE.DISADVANTAGE;
	}

	/* -------------------------------------------- */

	/* -------------------------------------------- */
	/*  D20 Roll Methods                            */
	/* -------------------------------------------- */

	/**
	 * Apply optional modifiers which customize the behavior of the d20term
	 * @private
	 */
	configureModifiers() {
		const d20 = this.terms[0];
		d20.modifiers = [];

		// Handle Advantage or Disadvantage
		if (this.hasAdvantage) {
			d20.number = this.options.elvenAccuracy ? 3 : 2;
			d20.modifiers.push("kh");
			d20.options.advantage = true;
		} else if (this.hasDisadvantage) {
			d20.number = 2;
			d20.modifiers.push("kl");
			d20.options.disadvantage = true;
		} else d20.number = 1;

		// Re-compile the underlying formula
		this._formula = this.constructor.getFormula(this.terms);

		// Mark configuration as complete
		this.options.configured = true;
	}

	/* -------------------------------------------- */

	/** @inheritdoc */
	async toMessage(messageData = {}, options = {}) {
		// Evaluate the roll now so we have the results available to determine whether reliable talent came into play
		if (!this._evaluated) await this.evaluate({ async: true });

		// Add appropriate advantage mode message flavor and dnd5e roll flags
		messageData.flavor = messageData.flavor || this.options.flavor;
		if (this.hasAdvantage) messageData.flavor += ` (${game.i18n.localize("BREAK.Edge")})`;
		else if (this.hasDisadvantage) messageData.flavor += ` (${game.i18n.localize("BREAK.Snag")})`;

		// Record the preferred rollMode
		options.rollMode = options.rollMode ?? this.options.rollMode;
		return super.toMessage(messageData, options);
	}

	/* -------------------------------------------- */
	/*  Configuration Dialog                        */
	/* -------------------------------------------- */

	/**
	 * Create a Dialog prompt used to configure evaluation of an existing D20Roll instance.
	 * @param {object} data                     Dialog configuration data
	 * @param {string} [data.title]             The title of the shown dialog window
	 * @param {number} [data.defaultRollMode]   The roll mode that the roll mode select element should default to
	 * @param {string} [data.template]          A custom path to an HTML template to use instead of the default
	 * @param {object} options                  Additional Dialog customization options
	 * @returns {Promise<D20Roll|null>}         A resulting D20Roll object constructed with the dialog, or null if the
	 *                                          dialog was closed
	 */
	async configureDialog({ title, defaultRollMode, template } = {}, options = {}) {
		// Render the Dialog inner HTML
		const content = await renderTemplate(template ?? this.constructor.EVALUATION_TEMPLATE, {
			defaultRollMode,
			rollModes: CONFIG.Dice.rollModes
		});

		let defaultButton = "normal";

		// Create the Dialog window and await submission of the form
		return new Promise((resolve) => {
			new Dialog(
				{
					title,
					content,
					buttons: {
						advantage: {
							label: game.i18n.localize("BREAK.Edge"),
							callback: (html) => resolve(this._onDialogSubmit(html, D20Roll.ADV_MODE.ADVANTAGE))
						},
						normal: {
							label: game.i18n.localize("BREAK.Normal"),
							callback: (html) => resolve(this._onDialogSubmit(html, D20Roll.ADV_MODE.NORMAL))
						},
						disadvantage: {
							label: game.i18n.localize("BREAK.Snag"),
							callback: (html) => resolve(this._onDialogSubmit(html, D20Roll.ADV_MODE.DISADVANTAGE))
						}
					},
					default: defaultButton,
					close: () => resolve(null)
				},
				options
			).render(true);
		});
	}

	/* -------------------------------------------- */

	/**
	 * Handle submission of the Roll evaluation configuration Dialog
	 * @param {jQuery} html            The submitted dialog content
	 * @param {number} advantageMode   The chosen advantage mode
	 * @returns {D20Roll}              This damage roll.
	 * @private
	 */
	_onDialogSubmit(html, advantageMode) {
		const form = html[0].querySelector("form");

		// Append a situational bonus term
		if (form.bonus.value) {
			const bonus = new Roll(form.bonus.value, this.data);
			if (!(bonus.terms[0] instanceof OperatorTerm))
				this.terms.push(new OperatorTerm({ operator: "+" }));
			this.terms = this.terms.concat(bonus.terms);
		}

		// Customize the modifier
		if (form.ability?.value) {
			const abl = this.data.abilities[form.ability.value];
			this.terms = this.terms.flatMap((t) => {
				if (t.term === "@mod") return new NumericTerm({ number: abl.mod });
				if (t.term === "@abilityCheckBonus") {
					const bonus = abl.bonuses?.check;
					if (bonus) return new Roll(bonus, this.data).terms;
					return new NumericTerm({ number: 0 });
				}
				return t;
			});
			this.options.flavor += ` (${BREAK.aptitudes[form.ability.value]?.label ?? ""})`;
		}

		// Apply advantage or disadvantage
		this.options.advantageMode = advantageMode;
		this.options.rollMode = form.rollMode.value;
		this.configureModifiers();
		return this;
	}
}

export class BreakActor extends Actor {
	/**
	 * Roll a generic aptitude test.
	 * Prompt the user for input on which variety of roll they want to do.
	 * @param {string} aptitudeKey    The ability id (e.g. "str")
	 * @param {object} options      Options which configure how ability tests or saving throws are rolled
	 */
	rollAbility(aptitudeKey, options = {}) {
		const label = CONFIG.DND5E.abilities[abilityId]?.label ?? "";
		new Dialog({
			title: `${game.i18n.format("DND5E.AbilityPromptTitle", { ability: label })}: ${this.name}`,
			content: `<p>${game.i18n.format("DND5E.AbilityPromptText", { ability: label })}</p>`,
			buttons: {
				test: {
					label: game.i18n.localize("DND5E.ActionAbil"),
					callback: () => this.rollAbilityTest(abilityId, options)
				},
				save: {
					label: game.i18n.localize("DND5E.ActionSave"),
					callback: () => this.rollAbilitySave(abilityId, options)
				}
			}
		}).render(true);
	}

	/* -------------------------------------------- */

	/**
	 * Roll an Ability Test
	 * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
	 * @param {string} abilityId    The ability ID (e.g. "str")
	 * @param {object} options      Options which configure how ability tests are rolled
	 * @returns {Promise<D20Roll>}  A Promise which resolves to the created Roll instance
	 */
	async rollAbilityTest(abilityId, options = {}) {
		const label = CONFIG.DND5E.abilities[abilityId]?.label ?? "";
		const abl = this.system.abilities[abilityId];
		const globalBonuses = this.system.bonuses?.abilities ?? {};
		const parts = [];
		const data = this.getRollData();

		// Add ability modifier
		parts.push("@mod");
		data.mod = abl?.mod ?? 0;

		// Include proficiency bonus
		if (abl?.checkProf.hasProficiency) {
			parts.push("@prof");
			data.prof = abl.checkProf.term;
		}

		// Add ability-specific check bonus
		if (abl?.bonuses?.check) {
			const checkBonusKey = `${abilityId}CheckBonus`;
			parts.push(`@${checkBonusKey}`);
			data[checkBonusKey] = Roll.replaceFormulaData(abl.bonuses.check, data);
		}

		// Add global actor bonus
		if (globalBonuses.check) {
			parts.push("@checkBonus");
			data.checkBonus = Roll.replaceFormulaData(globalBonuses.check, data);
		}

		// Roll and return
		const flavor = game.i18n.format("DND5E.AbilityPromptTitle", { ability: label });
		const rollData = foundry.utils.mergeObject(
			{
				data,
				title: `${flavor}: ${this.name}`,
				flavor,
				halflingLucky: this.getFlag("dnd5e", "halflingLucky"),
				messageData: {
					speaker: options.speaker || ChatMessage.getSpeaker({ actor: this }),
					"flags.dnd5e.roll": { type: "ability", abilityId }
				}
			},
			options
		);
		rollData.parts = parts.concat(options.parts ?? []);

		/**
		 * A hook event that fires before an ability test is rolled for an Actor.
		 * @function dnd5e.preRollAbilityTest
		 * @memberof hookEvents
		 * @param {Actor5e} actor                Actor for which the ability test is being rolled.
		 * @param {D20RollConfiguration} config  Configuration data for the pending roll.
		 * @param {string} abilityId             ID of the ability being rolled as defined in `DND5E.abilities`.
		 * @returns {boolean}                    Explicitly return `false` to prevent ability test from being rolled.
		 */
		if (Hooks.call("dnd5e.preRollAbilityTest", this, rollData, abilityId) === false) return;

		const roll = await d20Roll(rollData);

		/**
		 * A hook event that fires after an ability test has been rolled for an Actor.
		 * @function dnd5e.rollAbilityTest
		 * @memberof hookEvents
		 * @param {Actor5e} actor     Actor for which the ability test has been rolled.
		 * @param {D20Roll} roll      The resulting roll.
		 * @param {string} abilityId  ID of the ability that was rolled as defined in `DND5E.abilities`.
		 */
		if (roll) Hooks.callAll("dnd5e.rollAbilityTest", this, roll, abilityId);

		return roll;
	}

	/* -------------------------------------------- */
}

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BreakActorSheet extends ActorSheet {
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["break", "sheet", "actor"],
			template: "systems/break/templates/actors/actor-sheet.hbs",
			width: 600,
			height: 600,
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
		});
	}

	/** @override */
	get template() {
		// For when we diverse between full and limited sheet access
		// if( !game.user.isGM && this.actor.limited) return "systems/break/templates/actors/limited-sheet.html"
		return `systems/break/templates/actors/actor-${this.actor.type}-sheet.hbs`;
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = super.getData();
		console.log(context);

		// Use a safe clone of the actor data for further operations.
		const actorData = this.actor.toObject(false);

		// Add the actor's data to context.data for easier access, as well as flags.
		context.system = actorData.system;
		// context.system = this.actor.system;
		context.flags = actorData.flags;
		// context.items = Array.from(this.actor.items);
		// context.aptitudes = foundry.utils.deepClone(this.actor.system.aptitudes);
		// context.labels = context.isCharacter = this.actor.type === "character";
		// context.isNPC = this.actor.type === "npc";
		// context.isMonster = this.actor.type === "monster";
		// context.config = CONFIG.BREAK;

		// Prepare character data and items.
		if (actorData.type == "character") {
			this._prepareItems(context);
			this._prepareCharacterData(context);
			this._prepareHearts(context);
		}

		// Prepare NPC data and items.
		if (actorData.type == "npc") {
			this._prepareItems(context);
		}

		// Add roll data for TinyMCE editors.
		context.rollData = context.actor.getRollData();

		// Prepare active effects
		context.effects = prepareActiveEffectCategories(this.actor.effects);

		return context;
	}

	/**
	 * Organize and classify Items for Character sheets.
	 *
	 * @param {Object} actorData The actor to prepare.
	 *
	 * @return {undefined}
	 */
	_prepareCharacterData(context) {
		// Handle ability scores.
		for (let [k, v] of Object.entries(context.system.aptitudes)) {
			v.label = game.i18n.localize(CONFIG.BREAK.aptitudes[k]) ?? k;
		}
	}

	_prepareHearts(context) {
		const hearts = new Array(context.system.combatValues.hearts.max)
			.fill(undefined)
			.map((_h, idx) => idx < context.system.combatValues.hearts.value);
		context.hearts = [...hearts];
	}

	/**
	 * Organize and classify Items for Character sheets.
	 *
	 * @param {Object} actorData The actor to prepare.
	 *
	 * @return {undefined}
	 */
	_prepareItems(context) {
		// Initialize containers.
		// const gear = [];
		// const features = [];
		// const spells = {
		//   0: [],
		//   1: [],
		//   2: [],
		//   3: [],
		//   4: [],
		//   5: [],
		//   6: [],
		//   7: [],
		//   8: [],
		//   9: []
		// };
		// // Iterate through items, allocating to containers
		// for (let i of context.items) {
		//   i.img = i.img || DEFAULT_TOKEN;
		//   // Append to gear.
		//   if (i.type === 'item') {
		//     gear.push(i);
		//   }
		//   // Append to features.
		//   else if (i.type === 'feature') {
		//     features.push(i);
		//   }
		//   // Append to spells.
		//   else if (i.type === 'spell') {
		//     if (i.system.spellLevel != undefined) {
		//       spells[i.system.spellLevel].push(i);
		//     }
		//   }
		// }
		// // Assign and return
		// context.gear = gear;
		// context.features = features;
		// context.spells = spells;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Render the item sheet for viewing/editing prior to the editable check.
		html.find(".item-edit").click((ev) => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Add Inventory Item
		html.find(".item-create").click(this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.find(".item-delete").click((ev) => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// Active Effect managemen t0
		html.find(".effect-control").click((ev) => onManageActiveEffect(ev, this.actor));
		// Rollable abilities.
		html.find(".rollable").click(this._onRoll.bind(this));

		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev);
			html.find("li.item").each((i, li) => {
				if (li.classList.contains("inventory-header")) return;
				li.setAttribute("draggable", true);
				li.addEventListener("dragstart", handler, false);
			});
		}
	}

	/**
	 * @inheritdoc
	 * @param {object} [options]
	 * @param {boolean} [options.deterministic] Whether to force deterministic values for data properties that could be
	 *                                          either a die term or a flat term.
	 */
	getRollData({ deterministic = false } = {}) {
		if (!this.actor) return null;
		const actorRollData = this.actor.getRollData({ deterministic });
		const rollData = {
			...actorRollData,
			item: this.toObject().system
		};
		return rollData;
	}

	async rollAptitude(aptitudeKey) {
		const label = BREAK.aptitudes[aptitudeKey];
		const apt = this.system.aptitudes[aptitudeKey];
		const parts = [];
		const data = this.getRollData();
		parts.push("@mod");
		data.mod = apt?.mod ?? 0;
		const flavour = game.i18n.format("BREAK.AptitudePromptTitle", { aptitude: label });
		const roll = await D20Roll(formula, data, { flavour, rollMode });
		await roll.evaluate({ async: true });
		if (roll)
			await roll.toMessage({
				speaker: options.speaker || ChatMessage.getSpeaker({ actor: this }),
				"flags.break.roll": { type: "aptitude", aptitudeKey }
			});
		return roll;
	}

	/**
	 * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
	 * @param {Event} event   The originating click event
	 * @private
	 */
	async _onItemCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;
		// Get the type of item to create.
		const type = header.dataset.type;
		// Grab any data associated with this control.
		const data = duplicate(header.dataset);
		// Initialize a default name.
		const name = `New ${type.capitalize()}`;
		// Prepare the item object.
		const itemData = {
			name: name,
			type: type,
			system: data
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.system["type"];

		// Finally, create the item!
		return await Item.create(itemData, { parent: this.actor });
	}

	/**
	 * Handle rolling an Aptitude test.
	 * @param {Event} event      The originating click event.
	 * @private
	 */
	_onAptitudeRoll(event) {
		event.preventDefault();
		let aptitude = event.currentTarget.parentElement.dataset.aptitude;
		this.actor.rollAptitude(aptitude, { event: event });
	}
	/**
	 * Handle clickable rolls.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		// Handle item rolls.
		if (dataset.rollType) {
			if (dataset.rollType == "item") {
				const itemId = element.closest(".item").dataset.itemId;
				const item = this.actor.items.get(itemId);
				if (item) return item.roll();
			}
		}

		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
			let label = dataset.label ? `[aptitude] ${dataset.label}: ${dataset.target}` : "";
			let roll = new Roll(dataset.roll, this.actor.getRollData());
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get("core", "rollMode")
			});
			return roll;
		}
	}
}
