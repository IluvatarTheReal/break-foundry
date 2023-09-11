import * as advancement from "./documents/advancement/_module.mjs";
import { preLocalize } from "./utils.mjs";

// Namespace Configuration Values
const BREAK = {};

// ASCII Artwork
// BREAK.ASCII = `_______________________________
// ______      ______ _____ _____
// |  _  \\___  |  _  \\  ___|  ___|
// | | | ( _ ) | | | |___ \\| |__
// | | | / _ \\/\\ | | |   \\ \\  __|
// | |/ / (_>  < |/ //\\__/ / |___
// |___/ \\___/\\/___/ \\____/\\____/
// _______________________________`;

/**
 * Configuration data for aptitudes.
 *
 * @typedef {object} AptitudeConfiguration
 * @property {string} label                               Localized label.
 * @property {string} abbreviation                        Localized abbreviation.
 * @property {Object<string, number|string>}  [defaults]  Default values for this aptitude based on actor type.
 *                                                        If a string is used, the system will attempt to fetch.
 *                                                        the value of the specified aptitude.
 */

/**
 * The set of Aptitude Scores used within the system.
 * @enum {AptitudeConfiguration}
 */
BREAK.aptitudes = {
	might: {
		label: "BREAK.AptitudeMight",
		abbreviation: "BREAK.AptitudeMightAbbr"
	},
	deft: {
		label: "BREAK.AptitudeDeft",
		abbreviation: "BREAK.AptitudeDeftAbbr"
	},
	grit: {
		label: "BREAK.AptitudeGrit",
		abbreviation: "BREAK.AptitudeGritAbbr"
	},
	insight: {
		label: "BREAK.AptitudeInsight",
		abbreviation: "BREAK.AptitudeInsightAbbr"
	},
	aura: {
		label: "BREAK.AptitudeAura",
		abbreviation: "BREAK.AptitudeAuraAbbr"
	}
};
preLocalize("aptitudes", { keys: ["label", "abbreviation"] });
patchConfig("aptitudes", "label", { since: 2.2, until: 2.4 });

Object.defineProperty(BREAK, "aptitudeAbbreviations", {
	get() {
		foundry.utils.logCompatibilityWarning(
			"The `aptitudeAbbreviations` configuration object has been merged with `aptitudes`.",
			{ since: "BREAK 2.2", until: "BREAK 2.4" }
		);
		return Object.fromEntries(Object.entries(BREAK.aptitudes).map(([k, v]) => [k, v.abbreviation]));
	}
});

// /**
//  * Configure which aptitude score is used as the default modifier for initiative rolls.
//  * @type {string}
//  */
// BREAK.initiativeAptitude = "dex";

// /**
//  * Configure which aptitude score is used when calculating hit points per level.
//  * @type {string}
//  */
// BREAK.hitPointsAptitude = "con";

/* -------------------------------------------- */

// /**
//  * Configuration data for skills.
//  *
//  * @typedef {object} SkillConfiguration
//  * @property {string} label    Localized label.
//  * @property {string} aptitude  Key for the default aptitude used by this skill.
//  */

// /**
//  * The set of skill which can be trained with their default aptitude scores.
//  * @enum {SkillConfiguration}
//  */
// BREAK.skills = {
// 	acr: { label: "BREAK.SkillAcr", aptitude: "dex" },
// 	ani: { label: "BREAK.SkillAni", aptitude: "wis" },
// 	arc: { label: "BREAK.SkillArc", aptitude: "int" },
// 	ath: { label: "BREAK.SkillAth", aptitude: "str" },
// 	dec: { label: "BREAK.SkillDec", aptitude: "cha" },
// 	his: { label: "BREAK.SkillHis", aptitude: "int" },
// 	ins: { label: "BREAK.SkillIns", aptitude: "wis" },
// 	itm: { label: "BREAK.SkillItm", aptitude: "cha" },
// 	inv: { label: "BREAK.SkillInv", aptitude: "int" },
// 	med: { label: "BREAK.SkillMed", aptitude: "wis" },
// 	nat: { label: "BREAK.SkillNat", aptitude: "int" },
// 	prc: { label: "BREAK.SkillPrc", aptitude: "wis" },
// 	prf: { label: "BREAK.SkillPrf", aptitude: "cha" },
// 	per: { label: "BREAK.SkillPer", aptitude: "cha" },
// 	rel: { label: "BREAK.SkillRel", aptitude: "int" },
// 	slt: { label: "BREAK.SkillSlt", aptitude: "dex" },
// 	ste: { label: "BREAK.SkillSte", aptitude: "dex" },
// 	sur: { label: "BREAK.SkillSur", aptitude: "wis" }
// };
// preLocalize("skills", { key: "label", sort: true });

/* -------------------------------------------- */
/**
 * General weapon categories.
 * @enum {string}
 */
BREAK.weaponProficiencies = {
	sim: "BREAK.WeaponSimpleProficiency",
	mar: "BREAK.WeaponMartialProficiency"
};
preLocalize("weaponProficiencies");

/**
 * A mapping between `BREAK.weaponTypes` and `BREAK.weaponProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
BREAK.weaponProficienciesMap = {
	simpleM: "sim",
	simpleR: "sim",
	martialM: "mar",
	martialR: "mar"
};

/**
 * The basic weapon types in 5e. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
BREAK.weaponIds = {
	battleaxe: "I0WocDSuNpGJayPb",
	blowgun: "wNWK6yJMHG9ANqQV",
	club: "nfIRTECQIG81CvM4",
	dagger: "0E565kQUBmndJ1a2",
	dart: "3rCO8MTIdPGSW6IJ",
	flail: "UrH3sMdnUDckIHJ6",
	glaive: "rOG1OM2ihgPjOvFW",
	greataxe: "1Lxk6kmoRhG8qQ0u",
	greatclub: "QRCsxkCwWNwswL9o",
	greatsword: "xMkP8BmFzElcsMaR",
	halberd: "DMejWAc8r8YvDPP1",
	handaxe: "eO7Fbv5WBk5zvGOc",
	handcrossbow: "qaSro7kFhxD6INbZ",
	heavycrossbow: "RmP0mYRn2J7K26rX",
	javelin: "DWLMnODrnHn8IbAG",
	lance: "RnuxdHUAIgxccVwj",
	lightcrossbow: "ddWvQRLmnnIS0eLF",
	lighthammer: "XVK6TOL4sGItssAE",
	longbow: "3cymOVja8jXbzrdT",
	longsword: "10ZP2Bu3vnCuYMIB",
	mace: "Ajyq6nGwF7FtLhDQ",
	maul: "DizirD7eqjh8n95A",
	morningstar: "dX8AxCh9o0A9CkT3",
	net: "aEiM49V8vWpWw7rU",
	pike: "tC0kcqZT9HHAO0PD",
	quarterstaff: "g2dWN7PQiMRYWzyk",
	rapier: "Tobce1hexTnDk4sV",
	scimitar: "fbC0Mg1a73wdFbqO",
	shortsword: "osLzOwQdPtrK3rQH",
	sickle: "i4NeNZ30ycwPDHMx",
	spear: "OG4nBBydvmfWYXIk",
	shortbow: "GJv6WkD7D2J6rP6M",
	sling: "3gynWO9sN4OLGMWD",
	trident: "F65ANO66ckP8FDMa",
	warpick: "2YdfjN1PIIrSHZii",
	warhammer: "F0Df164Xv1gWcYt0",
	whip: "QKTyxoO0YDnAsbYe"
};

/* -------------------------------------------- */

/**
 * The basic ammunition types.
 * @enum {string}
 */
BREAK.ammoIds = {
	arrow: "3c7JXOzsv55gqJS5",
	blowgunNeedle: "gBQ8xqTA5f8wP5iu",
	crossbowBolt: "SItCnYBqhzqBoaWG",
	slingBullet: "z9SbsMIBZzuhZOqT"
};

/* -------------------------------------------- */

// /**
//  * The categories into which Tool items can be grouped.
//  *
//  * @enum {string}
//  */
// BREAK.toolTypes = {
// 	art: "BREAK.ToolArtisans",
// 	game: "BREAK.ToolGamingSet",
// 	music: "BREAK.ToolMusicalInstrument"
// };
// preLocalize("toolTypes", { sort: true });

/**
 * Time periods that accept a numeric value.
 * @enum {string}
 */
BREAK.scalarTimePeriods = {
	turn: "BREAK.TimeTurn",
	round: "BREAK.TimeRound",
	minute: "BREAK.TimeMinute",
	hour: "BREAK.TimeHour",
	day: "BREAK.TimeDay",
	month: "BREAK.TimeMonth",
	year: "BREAK.TimeYear"
};
preLocalize("scalarTimePeriods");

/* -------------------------------------------- */

/**
 * Time periods for spells that don't have a defined ending.
 * @enum {string}
 */
BREAK.permanentTimePeriods = {
	disp: "BREAK.TimeDisp",
	dstr: "BREAK.TimeDispTrig",
	perm: "BREAK.TimePerm"
};
preLocalize("permanentTimePeriods");

/* -------------------------------------------- */

/**
 * Time periods that don't accept a numeric value.
 * @enum {string}
 */
BREAK.specialTimePeriods = {
	inst: "BREAK.TimeInst",
	spec: "BREAK.Special"
};
preLocalize("specialTimePeriods");

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
BREAK.timePeriods = {
	...BREAK.specialTimePeriods,
	...BREAK.permanentTimePeriods,
	...BREAK.scalarTimePeriods
};
preLocalize("timePeriods");

/* -------------------------------------------- */

/**
 * Various ways in which an item or aptitude can be activated.
 * @enum {string}
 */
BREAK.aptitudeActivationTypes = {
	action: "BREAK.Action",
	bonus: "BREAK.BonusAction",
	reaction: "BREAK.Reaction",
	minute: BREAK.timePeriods.minute,
	hour: BREAK.timePeriods.hour,
	day: BREAK.timePeriods.day,
	special: BREAK.timePeriods.spec,
	legendary: "BREAK.LegendaryActionLabel",
	mythic: "BREAK.MythicActionLabel",
	lair: "BREAK.LairActionLabel",
	crew: "BREAK.VehicleCrewAction"
};
preLocalize("aptitudeActivationTypes");

/* -------------------------------------------- */

/**
 * Different things that an aptitude can consume upon use.
 * @enum {string}
 */
BREAK.aptitudeConsumptionTypes = {
	ammo: "BREAK.ConsumeAmmunition",
	attribute: "BREAK.ConsumeAttribute",
	hitDice: "BREAK.ConsumeHitDice",
	material: "BREAK.ConsumeMaterial",
	charges: "BREAK.ConsumeCharges"
};
preLocalize("aptitudeConsumptionTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Creature sizes.
 * @enum {string}
 */
BREAK.actorSizes = {
	tiny: "BREAK.SizeTiny",
	sm: "BREAK.SizeSmall",
	med: "BREAK.SizeMedium",
	lg: "BREAK.SizeLarge",
	huge: "BREAK.SizeHuge",
	grg: "BREAK.SizeGargantuan"
};
preLocalize("actorSizes");

/**
 * Default token image size for the values of `BREAK.actorSizes`.
 * @enum {number}
 */
BREAK.tokenSizes = {
	tiny: 0.5,
	sm: 1,
	med: 1,
	lg: 2,
	huge: 3,
	grg: 4
};

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
BREAK.tokenHPColors = {
	damage: 0xff0000,
	healing: 0x00ff00,
	temp: 0x66ccff,
	tempmax: 0x440066,
	negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Default types of creatures.
 * *Note: Not pre-localized to allow for easy fetching of pluralized forms.*
 * @enum {string}
 */
BREAK.creatureTypes = {
	aberration: "BREAK.CreatureAberration",
	beast: "BREAK.CreatureBeast",
	celestial: "BREAK.CreatureCelestial",
	construct: "BREAK.CreatureConstruct",
	dragon: "BREAK.CreatureDragon",
	elemental: "BREAK.CreatureElemental",
	fey: "BREAK.CreatureFey",
	fiend: "BREAK.CreatureFiend",
	giant: "BREAK.CreatureGiant",
	humanoid: "BREAK.CreatureHumanoid",
	monstrosity: "BREAK.CreatureMonstrosity",
	ooze: "BREAK.CreatureOoze",
	plant: "BREAK.CreaturePlant",
	undead: "BREAK.CreatureUndead"
};

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
BREAK.itemActionTypes = {
	mwak: "BREAK.ActionMWAK",
	rwak: "BREAK.ActionRWAK",
	msak: "BREAK.ActionMSAK",
	rsak: "BREAK.ActionRSAK",
	save: "BREAK.ActionSave",
	heal: "BREAK.ActionHeal",
	abil: "BREAK.ActionAbil",
	util: "BREAK.ActionUtil",
	other: "BREAK.ActionOther"
};
preLocalize("itemActionTypes");

/* -------------------------------------------- */

/**
 * Different ways in which item capacity can be limited.
 * @enum {string}
 */
BREAK.itemCapacityTypes = {
	items: "BREAK.ItemContainerCapacityItems",
	weight: "BREAK.ItemContainerCapacityWeight"
};
preLocalize("itemCapacityTypes", { sort: true });

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {string}
 */
BREAK.itemRarity = {
	common: "BREAK.ItemRarityCommon",
	uncommon: "BREAK.ItemRarityUncommon",
	rare: "BREAK.ItemRarityRare",
	veryRare: "BREAK.ItemRarityVeryRare",
	legendary: "BREAK.ItemRarityLegendary",
	artifact: "BREAK.ItemRarityArtifact"
};
preLocalize("itemRarity");

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use aptitude.
 * @enum {string}
 */
BREAK.limitedUsePeriods = {
	sr: "BREAK.ShortRest",
	lr: "BREAK.LongRest",
	day: "BREAK.Day",
	charges: "BREAK.Charges"
};
preLocalize("limitedUsePeriods");

/* -------------------------------------------- */

/**
 * Specific equipment types that modify base AC.
 * @enum {string}
 */
BREAK.armorTypes = {
	light: "BREAK.EquipmentLight",
	medium: "BREAK.EquipmentMedium",
	heavy: "BREAK.EquipmentHeavy",
	natural: "BREAK.EquipmentNatural",
	shield: "BREAK.EquipmentShield"
};
preLocalize("armorTypes");

/* -------------------------------------------- */

/**
 * Equipment types that aren't armor.
 * @enum {string}
 */
BREAK.miscEquipmentTypes = {
	clothing: "BREAK.EquipmentClothing",
	trinket: "BREAK.EquipmentTrinket",
	vehicle: "BREAK.EquipmentVehicle"
};
preLocalize("miscEquipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character.
 * @enum {string}
 */
BREAK.equipmentTypes = {
	...BREAK.miscEquipmentTypes,
	...BREAK.armorTypes
};
preLocalize("equipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
BREAK.vehicleTypes = {
	air: "BREAK.VehicleTypeAir",
	land: "BREAK.VehicleTypeLand",
	space: "BREAK.VehicleTypeSpace",
	water: "BREAK.VehicleTypeWater"
};
preLocalize("vehicleTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have.
 * @type {object}
 */
BREAK.armorProficiencies = {
	lgt: BREAK.equipmentTypes.light,
	med: BREAK.equipmentTypes.medium,
	hvy: BREAK.equipmentTypes.heavy,
	shl: "BREAK.EquipmentShieldProficiency"
};
preLocalize("armorProficiencies");

/**
 * A mapping between `BREAK.equipmentTypes` and `BREAK.armorProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
BREAK.armorProficienciesMap = {
	natural: true,
	clothing: true,
	light: "lgt",
	medium: "med",
	heavy: "hvy",
	shield: "shl"
};

/**
 * The basic armor types in 5e. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
BREAK.armorIds = {
	breastplate: "SK2HATQ4abKUlV8i",
	chainmail: "rLMflzmxpe8JGTOA",
	chainshirt: "p2zChy24ZJdVqMSH",
	halfplate: "vsgmACFYINloIdPm",
	hide: "n1V07puo0RQxPGuF",
	leather: "WwdpHLXGX5r8uZu5",
	padded: "GtKV1b5uqFQqpEni",
	plate: "OjkIqlW2UpgFcjZa",
	ringmail: "nsXZejlmgalj4he9",
	scalemail: "XmnlF5fgIO3tg6TG",
	splint: "cKpJmsJmU8YaiuqG",
	studded: "TIV3B1vbrVHIhQAm"
};

/**
 * The basic shield in 5e.
 * @enum {string}
 */
BREAK.shieldIds = {
	shield: "sSs3hSzkKBMNBgTs"
};

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 */
BREAK.armorClasses = {
	flat: {
		label: "BREAK.ArmorClassFlat",
		formula: "@attributes.ac.flat"
	},
	natural: {
		label: "BREAK.ArmorClassNatural",
		formula: "@attributes.ac.flat"
	},
	default: {
		label: "BREAK.ArmorClassEquipment",
		formula: "@attributes.ac.armor + @attributes.ac.dex"
	},
	mage: {
		label: "BREAK.ArmorClassMage",
		formula: "13 + @aptitudes.dex.mod"
	},
	draconic: {
		label: "BREAK.ArmorClassDraconic",
		formula: "13 + @aptitudes.dex.mod"
	},
	unarmoredMonk: {
		label: "BREAK.ArmorClassUnarmoredMonk",
		formula: "10 + @aptitudes.dex.mod + @aptitudes.wis.mod"
	},
	unarmoredBarb: {
		label: "BREAK.ArmorClassUnarmoredBarbarian",
		formula: "10 + @aptitudes.dex.mod + @aptitudes.con.mod"
	},
	custom: {
		label: "BREAK.ArmorClassCustom"
	}
};
preLocalize("armorClasses", { key: "label" });

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {string}
 */
BREAK.consumableTypes = {
	ammo: "BREAK.ConsumableAmmo",
	potion: "BREAK.ConsumablePotion",
	poison: "BREAK.ConsumablePoison",
	food: "BREAK.ConsumableFood",
	scroll: "BREAK.ConsumableScroll",
	wand: "BREAK.ConsumableWand",
	rod: "BREAK.ConsumableRod",
	trinket: "BREAK.ConsumableTrinket"
};
preLocalize("consumableTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of containers.
 * @enum {string}
 */
BREAK.containerTypes = {
	backpack: "H8YCd689ezlD26aT",
	barrel: "7Yqbqg5EtVW16wfT",
	basket: "Wv7HzD6dv1P0q78N",
	boltcase: "eJtPBiZtr2pp6ynt",
	bottle: "HZp69hhyNZUUCipF",
	bucket: "mQVYcHmMSoCUnBnM",
	case: "5mIeX824uMklU3xq",
	chest: "2YbuclKfhDL0bU4u",
	flask: "lHS63sC6bypENNlR",
	jug: "0ZBWwjFz3nIAXMLW",
	pot: "M8xM8BLK4tpUayEE",
	pitcher: "nXWdGtzi8DXDLLsL",
	pouch: "9bWTRRDym06PzSAf",
	quiver: "4MtQKPn9qMWCFjDA",
	sack: "CNdDj8dsXVpRVpXt",
	saddlebags: "TmfaFUSZJAotndn9",
	tankard: "uw6fINSmZ2j2o57A",
	vial: "meJEfX3gZgtMX4x2"
};

/* -------------------------------------------- */

/**
 * Configuration data for spellcasting foci.
 *
 * @typedef {object} SpellcastingFocusConfiguration
 * @property {string} label                    Localized label for this category.
 * @property {Object<string, string>} itemIds  Item IDs or UUIDs.
 */

/**
 * Type of spellcasting foci.
 * @enum {SpellcastingFocusConfiguration}
 */
BREAK.focusTypes = {
	arcane: {
		label: "BREAK.Focus.Arcane",
		itemIds: {
			crystal: "uXOT4fYbgPY8DGdd",
			orb: "tH5Rn0JVRG1zdmPa",
			rod: "OojyyGfh91iViuMF",
			staff: "BeKIrNIvNHRPQ4t5",
			wand: "KA2P6I48iOWlnboO"
		}
	},
	druidic: {
		label: "BREAK.Focus.Druidic",
		itemIds: {
			mistletoe: "xDK9GQd2iqOGH8Sd",
			totem: "PGL6aaM0wE5h0VN5",
			woodenstaff: "FF1ktpb2YSiyv896",
			yewwand: "t5yP0d7YaKwuKKiH"
		}
	},
	holy: {
		label: "BREAK.Focus.Holy",
		itemIds: {
			amulet: "paqlMjggWkBIAeCe",
			emblem: "laVqttkGMW4B9654",
			reliquary: "gP1URGq3kVIIFHJ7"
		}
	}
};

/* -------------------------------------------- */

/**
 * Configuration data for an item with the "feature" type.
 *
 * @typedef {object} FeatureTypeConfiguration
 * @property {string} label                       Localized label for this type.
 * @property {Object<string, string>} [subtypes]  Enum containing localized labels for subtypes.
 */

/**
 * Types of "features" items.
 * @enum {FeatureTypeConfiguration}
 */
BREAK.featureTypes = {
	background: {
		label: "BREAK.Feature.Background"
	},
	class: {
		label: "BREAK.Feature.Class",
		subtypes: {
			arcaneShot: "BREAK.ClassFeature.ArcaneShot",
			artificerInfusion: "BREAK.ClassFeature.ArtificerInfusion",
			channelDivinity: "BREAK.ClassFeature.ChannelDivinity",
			defensiveTactic: "BREAK.ClassFeature.DefensiveTactic",
			eldritchInvocation: "BREAK.ClassFeature.EldritchInvocation",
			elementalDiscipline: "BREAK.ClassFeature.ElementalDiscipline",
			fightingStyle: "BREAK.ClassFeature.FightingStyle",
			huntersPrey: "BREAK.ClassFeature.HuntersPrey",
			ki: "BREAK.ClassFeature.Ki",
			maneuver: "BREAK.ClassFeature.Maneuver",
			metamagic: "BREAK.ClassFeature.Metamagic",
			multiattack: "BREAK.ClassFeature.Multiattack",
			pact: "BREAK.ClassFeature.PactBoon",
			psionicPower: "BREAK.ClassFeature.PsionicPower",
			rune: "BREAK.ClassFeature.Rune",
			superiorHuntersDefense: "BREAK.ClassFeature.SuperiorHuntersDefense"
		}
	},
	monster: {
		label: "BREAK.Feature.Monster"
	},
	race: {
		label: "BREAK.Feature.Race"
	},
	feat: {
		label: "BREAK.Feature.Feat"
	}
};
preLocalize("featureTypes", { key: "label" });
preLocalize("featureTypes.class.subtypes", { sort: true });

/* -------------------------------------------- */

/**
 * @typedef {object} CurrencyConfiguration
 * @property {string} label         Localized label for the currency.
 * @property {string} abbreviation  Localized abbreviation for the currency.
 * @property {number} conversion    Number by which this currency should be multiplied to arrive at a standard value.
 */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * The conversion number defines how many of that currency are equal to one GP.
 * @enum {CurrencyConfiguration}
 */
BREAK.currencies = {
	pp: {
		label: "BREAK.CurrencyPP",
		abbreviation: "BREAK.CurrencyAbbrPP",
		conversion: 0.1
	},
	gp: {
		label: "BREAK.CurrencyGP",
		abbreviation: "BREAK.CurrencyAbbrGP",
		conversion: 1
	},
	ep: {
		label: "BREAK.CurrencyEP",
		abbreviation: "BREAK.CurrencyAbbrEP",
		conversion: 2
	},
	sp: {
		label: "BREAK.CurrencySP",
		abbreviation: "BREAK.CurrencyAbbrSP",
		conversion: 10
	},
	cp: {
		label: "BREAK.CurrencyCP",
		abbreviation: "BREAK.CurrencyAbbrCP",
		conversion: 100
	}
};
preLocalize("currencies", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */
/*  Damage Types                                */
/* -------------------------------------------- */

/**
 * Types of damage that are considered physical.
 * @enum {string}
 */
BREAK.physicalDamageTypes = {
	bludgeoning: "BREAK.DamageBludgeoning",
	piercing: "BREAK.DamagePiercing",
	slashing: "BREAK.DamageSlashing"
};
preLocalize("physicalDamageTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of damage the can be caused by aptitudes.
 * @enum {string}
 */
BREAK.damageTypes = {
	...BREAK.physicalDamageTypes,
	acid: "BREAK.DamageAcid",
	cold: "BREAK.DamageCold",
	fire: "BREAK.DamageFire",
	force: "BREAK.DamageForce",
	lightning: "BREAK.DamageLightning",
	necrotic: "BREAK.DamageNecrotic",
	poison: "BREAK.DamagePoison",
	psychic: "BREAK.DamagePsychic",
	radiant: "BREAK.DamageRadiant",
	thunder: "BREAK.DamageThunder"
};
preLocalize("damageTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of damage to which an actor can possess resistance, immunity, or vulneraptitude.
 * @enum {string}
 * @deprecated
 */
BREAK.damageResistanceTypes = {
	...BREAK.damageTypes,
	physical: "BREAK.DamagePhysical"
};
preLocalize("damageResistanceTypes", { sort: true });

/* -------------------------------------------- */
/*  Movement                                    */
/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
BREAK.movementTypes = {
	burrow: "BREAK.MovementBurrow",
	climb: "BREAK.MovementClimb",
	fly: "BREAK.MovementFly",
	swim: "BREAK.MovementSwim",
	walk: "BREAK.MovementWalk"
};
preLocalize("movementTypes", { sort: true });

/* -------------------------------------------- */
/*  Measurement                                 */
/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
BREAK.movementUnits = {
	ft: "BREAK.DistFt",
	mi: "BREAK.DistMi",
	m: "BREAK.DistM",
	km: "BREAK.DistKm"
};
preLocalize("movementUnits");

/* -------------------------------------------- */

/**
 * The types of range that are used for measuring actions and effects.
 * @enum {string}
 */
BREAK.rangeTypes = {
	self: "BREAK.DistSelf",
	touch: "BREAK.DistTouch",
	spec: "BREAK.Special",
	any: "BREAK.DistAny"
};
preLocalize("rangeTypes");

/* -------------------------------------------- */

/**
 * The valid units of measure for the range of an action or effect. A combination of `BREAK.movementUnits` and
 * `BREAK.rangeUnits`.
 * @enum {string}
 */
BREAK.distanceUnits = {
	...BREAK.movementUnits,
	...BREAK.rangeTypes
};
preLocalize("distanceUnits");

/* -------------------------------------------- */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @enum {{ imperial: number, metric: number }}
 */
BREAK.encumbrance = {
	currencyPerWeight: {
		imperial: 50,
		metric: 110
	},
	strMultiplier: {
		imperial: 15,
		metric: 6.8
	},
	vehicleWeightMultiplier: {
		imperial: 2000, // 2000 lbs in an imperial ton
		metric: 1000 // 1000 kg in a metric ton
	}
};

/**
 * The set of possible sensory perception types which an Actor may have.
 * @enum {string}
 */
BREAK.senses = {
	blindsight: "BREAK.SenseBlindsight",
	darkvision: "BREAK.SenseDarkvision",
	tremorsense: "BREAK.SenseTremorsense",
	truesight: "BREAK.SenseTruesight"
};
preLocalize("senses", { sort: true });

/* -------------------------------------------- */
/*  Weapon Details                              */
// /* -------------------------------------------- */

// TODO: Reimplement weapon types
// /**
//  * The set of types which a weapon item can take.
//  * @enum {string}
//  */
// BREAK.weaponTypes = {
// 	simpleM: "BREAK.WeaponSimpleM",
// 	simpleR: "BREAK.WeaponSimpleR",
// 	martialM: "BREAK.WeaponMartialM",
// 	martialR: "BREAK.WeaponMartialR",
// 	natural: "BREAK.WeaponNatural",
// 	improv: "BREAK.WeaponImprov",
// 	siege: "BREAK.WeaponSiege"
// };
// preLocalize("weaponTypes");

/* -------------------------------------------- */

// /**
//  * A subset of weapon properties that determine the physical characteristics of the weapon.
//  * These properties are used for determining physical resistance bypasses.
//  * @enum {string}
//  */
// BREAK.physicalWeaponProperties = {
// 	ada: "BREAK.WeaponPropertiesAda",
// 	mgc: "BREAK.WeaponPropertiesMgc",
// 	sil: "BREAK.WeaponPropertiesSil"
// };
// preLocalize("physicalWeaponProperties", { sort: true });

// /* -------------------------------------------- */

// /**
//  * The set of weapon property flags which can exist on a weapon.
//  * @enum {string}
//  */
// BREAK.weaponProperties = {
// 	...BREAK.physicalWeaponProperties,
// 	amm: "BREAK.WeaponPropertiesAmm",
// 	fin: "BREAK.WeaponPropertiesFin",
// 	fir: "BREAK.WeaponPropertiesFir",
// 	foc: "BREAK.WeaponPropertiesFoc",
// 	hvy: "BREAK.WeaponPropertiesHvy",
// 	lgt: "BREAK.WeaponPropertiesLgt",
// 	lod: "BREAK.WeaponPropertiesLod",
// 	rch: "BREAK.WeaponPropertiesRch",
// 	rel: "BREAK.WeaponPropertiesRel",
// 	ret: "BREAK.WeaponPropertiesRet",
// 	spc: "BREAK.WeaponPropertiesSpc",
// 	thr: "BREAK.WeaponPropertiesThr",
// 	two: "BREAK.WeaponPropertiesTwo",
// 	ver: "BREAK.WeaponPropertiesVer"
// };
// preLocalize("weaponProperties", { sort: true });

// /* -------------------------------------------- */

// /**
//  * Compendium packs used for localized items.
//  * @enum {string}
//  */
// BREAK.sourcePacks = {
// 	ITEMS: "break.items"
// };

/* -------------------------------------------- */

/**
 * Weapon and armor item proficiency levels.
 * @enum {string}
 */
BREAK.weaponAndArmorProficiencyLevels = {
	0: "BREAK.NotProficient",
	1: "BREAK.Proficient"
};
preLocalize("weaponAndArmorProficiencyLevels");

/* -------------------------------------------- */

// /**
//  * The amount of cover provided by an object. In cases where multiple pieces
//  * of cover are in play, we take the highest value.
//  * @enum {string}
//  */
// BREAK.cover = {
//   0: "BREAK.None",
//   .5: "BREAK.CoverHalf",
//   .75: "BREAK.CoverThreeQuarters",
//   1: "BREAK.CoverTotal"
// };
// preLocalize("cover");

/* -------------------------------------------- */

// TODO: Reimplement trackable properties
// /**
//  * A selection of actor attributes that can be tracked on token resource bars.
//  * @type {string[]}
//  * @deprecated since v10
//  */
// BREAK.trackableAttributes = [
//   "attributes.ac.value", "attributes.init.bonus", "attributes.movement", "attributes.senses", "attributes.spelldc",
//   "attributes.spellLevel", "details.cr", "details.spellLevel", "details.xp.value", "skills.*.passive",
//   "aptitudes.*.value"
// ];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
BREAK.consumableResources = [
	// Configured during init.
];

/* -------------------------------------------- */

// /**
//  * Conditions that can affect an actor.
//  * @enum {string}
//  */
// BREAK.conditionTypes = {
//   blinded: "BREAK.ConBlinded",
//   charmed: "BREAK.ConCharmed",
//   deafened: "BREAK.ConDeafened",
//   diseased: "BREAK.ConDiseased",
//   exhaustion: "BREAK.ConExhaustion",
//   frightened: "BREAK.ConFrightened",
//   grappled: "BREAK.ConGrappled",
//   incapacitated: "BREAK.ConIncapacitated",
//   invisible: "BREAK.ConInvisible",
//   paralyzed: "BREAK.ConParalyzed",
//   petrified: "BREAK.ConPetrified",
//   poisoned: "BREAK.ConPoisoned",
//   prone: "BREAK.ConProne",
//   restrained: "BREAK.ConRestrained",
//   stunned: "BREAK.ConStunned",
//   unconscious: "BREAK.ConUnconscious"
// };
// preLocalize("conditionTypes", { sort: true });

// TODO: Reimplement languages for BREAK!!
/**
 * Languages a character can learn.
 * @enum {string}
 */
// BREAK.languages = {
//   common: "BREAK.LanguagesCommon",
//   aarakocra: "BREAK.LanguagesAarakocra",
//   abyssal: "BREAK.LanguagesAbyssal",
//   aquan: "BREAK.LanguagesAquan",
//   auran: "BREAK.LanguagesAuran",
//   celestial: "BREAK.LanguagesCelestial",
//   deep: "BREAK.LanguagesDeepSpeech",
//   draconic: "BREAK.LanguagesDraconic",
//   druidic: "BREAK.LanguagesDruidic",
//   dwarvish: "BREAK.LanguagesDwarvish",
//   elvish: "BREAK.LanguagesElvish",
//   giant: "BREAK.LanguagesGiant",
//   gith: "BREAK.LanguagesGith",
//   gnomish: "BREAK.LanguagesGnomish",
//   goblin: "BREAK.LanguagesGoblin",
//   gnoll: "BREAK.LanguagesGnoll",
//   halfling: "BREAK.LanguagesHalfling",
//   ignan: "BREAK.LanguagesIgnan",
//   infernal: "BREAK.LanguagesInfernal",
//   orc: "BREAK.LanguagesOrc",
//   primordial: "BREAK.LanguagesPrimordial",
//   sylvan: "BREAK.LanguagesSylvan",
//   terran: "BREAK.LanguagesTerran",
//   cant: "BREAK.LanguagesThievesCant",
//   undercommon: "BREAK.LanguagesUndercommon"
// };
// preLocalize("languages", { sort: true });

// /**
//  * Maximum allowed character level.
//  * @type {number}
//  */
// BREAK.maxLevel = 20;

// /**
//  * Maximum aptitude score value allowed by default.
//  * @type {number}
//  */
// BREAK.maxAptitudeScore = 20;

// /**
//  * XP required to achieve each character level.
//  * @type {number[]}
//  */
// BREAK.CHARACTER_EXP_LEVELS = [
//   0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
//   120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
// ];

// /**
//  * XP granted for each challenge rating.
//  * @type {number[]}
//  */
// BREAK.CR_EXP_LEVELS = [
//   10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
//   20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
// ];

/**
 * @typedef {object} CharacterFlagConfig
 * @property {string} name
 * @property {string} hint
 * @property {string} section
 * @property {typeof boolean|string|number} type
 * @property {string} placeholder
 * @property {string[]} [aptitudes]
 * @property {Object<string, string>} [choices]
 * @property {string[]} [skills]
 */

/* -------------------------------------------- */

/**
 * Trait configuration information.
 *
 * @typedef {object} TraitConfiguration
 * @property {string} label               Localization key for the trait name.
 * @property {string} [actorKeyPath]      If the trait doesn't directly map to an entry as `traits.[key]`, where is
 *                                        this trait's data stored on the actor?
 * @property {string} [configKey]         If the list of trait options doesn't match the name of the trait, where can
 *                                        the options be found within `CONFIG.BREAK`?
 * @property {string} [labelKey]          If config is an enum of objects, where can the label be found?
 * @property {object} [subtypes]          Configuration for traits that take some sort of base item.
 * @property {string} [subtypes.keyPath]  Path to subtype value on base items, should match a category key.
 * @property {string[]} [subtypes.ids]    Key for base item ID objects within `CONFIG.BREAK`.
 * @property {object} [children]          Mapping of category key to an object defining its children.
 * @property {boolean} [sortCategories]   Whether top-level categories should be sorted.
 */

/**
 * Configurable traits on actors.
 * @enum {TraitConfiguration}
 */
BREAK.traits = {
	saves: {
		label: "BREAK.ClassSaves",
		configKey: "aptitudes",
		labelKey: "label"
	},
	skills: {
		label: "BREAK.TraitSkillProf",
		labelKey: "label"
	},
	languages: {
		label: "BREAK.Languages"
	},
	di: {
		label: "BREAK.DamImm",
		configKey: "damageTypes"
	},
	dr: {
		label: "BREAK.DamRes",
		configKey: "damageTypes"
	},
	dv: {
		label: "BREAK.DamVuln",
		configKey: "damageTypes"
	},
	ci: {
		label: "BREAK.ConImm",
		configKey: "conditionTypes"
	},
	weapon: {
		label: "BREAK.TraitWeaponProf",
		actorKeyPath: "traits.weaponProf",
		configKey: "weaponProficiencies",
		subtypes: { keyPath: "weaponType", ids: ["weaponIds"] }
	},
	armor: {
		label: "BREAK.TraitArmorProf",
		actorKeyPath: "traits.armorProf",
		configKey: "armorProficiencies",
		subtypes: { keyPath: "armor.type", ids: ["armorIds", "shieldIds"] }
	},
	tool: {
		label: "BREAK.TraitToolProf",
		actorKeyPath: "tools",
		configKey: "toolProficiencies",
		subtypes: { keyPath: "toolType", ids: ["toolIds"] },
		children: { vehicle: "vehicleTypes" },
		sortCategories: true
	}
};
preLocalize("traits", { key: "label" });

/* -------------------------------------------- */

// /**
//  * Special character flags.
//  * @enum {CharacterFlagConfig}
//  */
// BREAK.characterFlags = {
//   diamondSoul: {
//     name: "BREAK.FlagsDiamondSoul",
//     hint: "BREAK.FlagsDiamondSoulHint",
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   elvenAccuracy: {
//     name: "BREAK.FlagsElvenAccuracy",
//     hint: "BREAK.FlagsElvenAccuracyHint",
//     section: "BREAK.RacialTraits",
//     aptitudes: ["dex", "int", "wis", "cha"],
//     type: Boolean
//   },
//   halflingLucky: {
//     name: "BREAK.FlagsHalflingLucky",
//     hint: "BREAK.FlagsHalflingLuckyHint",
//     section: "BREAK.RacialTraits",
//     type: Boolean
//   },
//   initiativeAdv: {
//     name: "BREAK.FlagsInitiativeAdv",
//     hint: "BREAK.FlagsInitiativeAdvHint",
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   initiativeAlert: {
//     name: "BREAK.FlagsAlert",
//     hint: "BREAK.FlagsAlertHint",
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   jackOfAllTrades: {
//     name: "BREAK.FlagsJOAT",
//     hint: "BREAK.FlagsJOATHint",
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   observantFeat: {
//     name: "BREAK.FlagsObservant",
//     hint: "BREAK.FlagsObservantHint",
//     skills: ["prc", "inv"],
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   tavernBrawlerFeat: {
//     name: "BREAK.FlagsTavernBrawler",
//     hint: "BREAK.FlagsTavernBrawlerHint",
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   powerfulBuild: {
//     name: "BREAK.FlagsPowerfulBuild",
//     hint: "BREAK.FlagsPowerfulBuildHint",
//     section: "BREAK.RacialTraits",
//     type: Boolean
//   },
//   reliableTalent: {
//     name: "BREAK.FlagsReliableTalent",
//     hint: "BREAK.FlagsReliableTalentHint",
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   remarkableAthlete: {
//     name: "BREAK.FlagsRemarkableAthlete",
//     hint: "BREAK.FlagsRemarkableAthleteHint",
//     aptitudes: ["str", "dex", "con"],
//     section: "BREAK.Feats",
//     type: Boolean
//   },
//   weaponCriticalThreshold: {
//     name: "BREAK.FlagsWeaponCritThreshold",
//     hint: "BREAK.FlagsWeaponCritThresholdHint",
//     section: "BREAK.Feats",
//     type: Number,
//     placeholder: 20
//   },
//   spellCriticalThreshold: {
//     name: "BREAK.FlagsSpellCritThreshold",
//     hint: "BREAK.FlagsSpellCritThresholdHint",
//     section: "BREAK.Feats",
//     type: Number,
//     placeholder: 20
//   },
//   meleeCriticalDamageDice: {
//     name: "BREAK.FlagsMeleeCriticalDice",
//     hint: "BREAK.FlagsMeleeCriticalDiceHint",
//     section: "BREAK.Feats",
//     type: Number,
//     placeholder: 0
//   }
// };
// preLocalize("characterFlags", { keys: ["name", "hint", "section"] });

// /**
//  * Flags allowed on actors. Any flags not in the list may be deleted during a migration.
//  * @type {string[]}
//  */
// BREAK.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(BREAK.characterFlags));

/* -------------------------------------------- */

// /**
//  * Advancement types that can be added to items.
//  * @enum {*}
//  */
// BREAK.advancementTypes = {
//   AptitudeScoreImprovement: advancement.AptitudeScoreImprovementAdvancement,
//   HitPoints: advancement.HitPointsAdvancement,
//   ItemChoice: advancement.ItemChoiceAdvancement,
//   ItemGrant: advancement.ItemGrantAdvancement,
//   ScaleValue: advancement.ScaleValueAdvancement
// };

/* -------------------------------------------- */

// /**
//  * Patch an existing config enum to allow conversion from string values to object values without
//  * breaking existing modules that are expecting strings.
//  * @param {string} key          Key within BREAK that has been replaced with an enum of objects.
//  * @param {string} fallbackKey  Key within the new config object from which to get the fallback value.
//  * @param {object} [options]    Additional options passed through to logCompatibilityWarning.
//  */
// function patchConfig(key, fallbackKey, options) {
//   /** @override */
//   function toString() {
//     const message = `The value of CONFIG.BREAK.${key} has been changed to an object.`
//       +` The former value can be acccessed from .${fallbackKey}.`;
//     foundry.utils.logCompatibilityWarning(message, options);
//     return this[fallbackKey];
//   }

//   Object.values(BREAK[key]).forEach(o => o.toString = toString);
// }

/* -------------------------------------------- */

export default BREAK;
