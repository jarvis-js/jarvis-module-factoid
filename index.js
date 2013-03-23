/*global module*/

module.exports = function(jarvis, module) {
	var factoids = {};

	jarvis.recall('factoids', function(data) {
		if (data) {
			factoids = data;
		}
	});

	module.addAction(module.createCommand({
		name: 'add-factoid',
		match: 'factoid :key is :value',
		func: function(message, key, value) {
			factoids[key] = value;
			jarvis.remember('factoids', factoids, function() {
				jarvis.reply(message, 'Saved ' + key + ' as ' + value);
			});
		}
	}));

	module.addAction(module.createCommand({
		name: 'del-factoid',
		match: [
			'delete factoid :key',
			'remove factoid :key'
		],
		func: function(message, key) {
			if (factoids[key]) {
				delete factoids[key];
				jarvis.remember('factoids', factoids, function() {
					jarvis.reply(message, 'Deleted factoid ' + key);
				});
			}
			else {
				jarvis.reply(message, 'Cannot delete ' + key + ': doesn\'t exist');
			}
		}
	}));

	var prefix = '!';
	if (module.config.prefix && module.config.prefix.length > 0) {
		prefix = module.config.prefix;
	}
	prefix = prefix.replace(/[-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	var regexp = new RegExp('^(?:' + prefix + '){1}([^ ]+)$', 'ig');
	module.addAction(module.createTrigger({
		name: 'get-factoid',
		match: regexp,
		func: function(message, key) {
			if (factoids[key]) {
				jarvis.say(message, factoids[key]);
			}
		}
	}));

};
