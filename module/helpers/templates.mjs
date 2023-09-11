/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([
		// Actor partials.
		"systems/break/templates/actors/parts/actor-features.hbs",
		"systems/break/templates/actors/parts/actor-items.hbs",
		"systems/break/templates/actors/parts/actor-effects.hbs"
	]);
};
