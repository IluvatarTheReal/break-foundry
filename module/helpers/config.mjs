// import { preLocalize } from "../utils.mjs";

// export const BREAK = {};

// /**
//  * The set of Ability Scores used within the sytem.
//  * @type {Object}
//  */
// BREAK.aptitudes = {
// 	might: { label: "BREAK.AptitudeMight", abbreviation: "BREAK.AptitudeMightAbbr" },
// 	deft: { label: "BREAK.AptitudeDeft", abbreviation: "BREAK.AptitudeDeftAbbr" },
// 	grit: { label: "BREAK.AptitudeGrit", abbreviation: "BREAK.AptitudeGritAbbr" },
// 	insight: { label: "BREAK.AptitudeInsight", abbreviation: "BREAK.AptitudeInsightAbbr" },
// 	aura: { label: "BREAK.AptitudeAura", abbreviation: "BREAK.AptitudeAuraAbbr" }
// };
// // preLocalize("aptitudes", { keys: ["label", "abbreviation"] });
// // for updating for changes between versions patchConfig("aptitudes", "label", {})

// BREAK.currencies = {
// 	stones: {
// 		label: "BREAK.CurrencyStones",
// 		abbreviation: "BREAK.CurrencyAbbrStones",
// 		conversion: 10
// 	},
// 	coins: {
// 		label: "BREAK.CurrencyCoins",
// 		abbreviation: "BREAK.CurrencyAbbrCoins",
// 		conversion: 1
// 	},
// 	gems: {
// 		label: "BREAK.CurrencyGems",
// 		abbreviation: "BREAK.CurrencyAbbrGems",
// 		conversion: 0.01
// 	}
// };
// // preLocalize("aptitudes", { keys: ["label", "abbreviation"] });

export const BREAK = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
BREAK.aptitudes = {
	might: "BREAK.AptitudeMight",
	deft: "BREAK.AptitudeDeft",
	grit: "BREAK.AptitudeGrit",
	insight: "BREAK.AptitudeInsight",
	aura: "BREAK.AptitudeAura"
};

BREAK.aptitudeAbbreviations = {
	might: "BREAK.AptitudeMightAbbr",
	deft: "BREAK.AptitudeDeftAbbr",
	grit: "BREAK.AptitudeGritAbbr",
	insight: "BREAK.AptitudeInsightAbbr",
	aura: "BREAK.AptitudeAuraAbbr"
};