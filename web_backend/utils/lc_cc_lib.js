//-------------------------------------------------------------------
// Letter of Credit Chaincode Library
//-------------------------------------------------------------------

module.exports = function (enrollObj, g_options, fcw, logger) {
	var lc_chaincode = {};

	// Chaincode -------------------------------------------------------------------------------

	//check if chaincode exists
	lc_chaincode.check_if_already_instantiated = function (options, cb) {
		console.log('');
		logger.info('Checking for chaincode...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['selftest']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null || isNaN(resp.parsed)) {	 //if nothing is here, no chaincode
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};

	//check chaincode version
	lc_chaincode.check_version = function (options, cb) {
		console.log('');
		logger.info('Checking chaincode and ui compatibility...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['marbles_ui']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null) {							//if nothing is here, no chaincode
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};


	// Marbles -------------------------------------------------------------------------------

	//create a marble
	lc_chaincode.create_a_lc = function (options, cb) {
		console.log('');
		logger.info('申请人保存信用证开证申请');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'saveLCApplication',
			cc_args: [
				"{'ApplyCorp':{'No':'DragonLedger','Name':'Lixiaohu','Domain':'org1.example.com'},'Currency':'RMB','Amount':'12345.67','IsApproved':'false','IssueBank':{'No':'ICBC','Name':'ICBC Bank','Domain':'org1.example.com'}}",
				"{'Document':{'FileName':'lixiaohucontract','FileUri':'c:qwerty','FileHash':'56d34dad234bbdabcb3213','FileSignature':'lixiaohussignature','Uploader':'lihuichi'},'ContractNo':'201708092123','Purchaser':{'No':'DragonLedger','Name':'Lixiaohu','Domain':'org1.example.com'},'Vendor':{'No':'Apachebet','Name':'ApachebeX','Domain':'org1.example.com'},'Amount':'12345.67','Commodity':'XBox360','ContractTemplateNo':'1','ContractInstanceNo':'1'}",
				"{'No':'ICBC','Name':'ICBC Bank','Domain':'org1.example.com'}",
				"{'No':'BOC','Name':'Bank of China','Domain':'org1.example.com'}",
				"{'No':'ICBC','Name':'ICBC Bank','Domain':'org1.example.com'}",
				"{'No':'Apachebet','Name':'ApacheX','Domain':'org1.example.com'}",
				"[{'FileName':'','FileUri':'','FileHash':'','FileSignature':'','Uploader':''}]",
				"{'No':'DragonLedger','Name':'Lixiaohu','Domain':'org1.example.com'}",
				"CNY",
				"12345.67",
				"20170810",
				"20171231",
				"180"
			],
			peer_tls_opts: g_options.peer_tls_opts,
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];			//pass marble id back
				cb(err, resp);
			}
		});
	};

	//get list of marbles
	lc_chaincode.get_marble_list = function (options, cb) {
		console.log('');
		logger.info('Fetching marble index list...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'compelte_marble_index',
			cc_args: [' ']
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	//get marble
	lc_chaincode.get_marble = function (options, cb) {
		logger.info('fetching marble ' + options.marble_id + ' list...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'read',
			cc_args: [options.args.marble_id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	//set marble owner
	lc_chaincode.set_marble_owner = function (options, cb) {
		console.log('');
		logger.info('Setting marble owner...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'set_owner',
			cc_args: [
				options.args.marble_id,
				options.args.owner_id,
				options.args.auth_company
			],
			peer_tls_opts: g_options.peer_tls_opts,
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	//delete marble
	lc_chaincode.delete_marble = function (options, cb) {
		console.log('');
		logger.info('Deleting a marble...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'delete_marble',
			cc_args: [options.args.marble_id, options.args.auth_company],
			peer_tls_opts: g_options.peer_tls_opts,
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	//get history for key
	lc_chaincode.get_history = function (options, cb) {
		logger.info('Getting history for...', options.args);

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'getHistory',
			cc_args: [options.args.id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	//get multiple marbles/owners by start and stop ids
	lc_chaincode.get_multiple_keys = function (options, cb) {
		logger.info('Getting marbles between ids', options.args);

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'getMarblesByRange',
			cc_args: [options.args.start_id, options.args.stop_id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};


	// Owners -------------------------------------------------------------------------------

	//register a owner/user
	lc_chaincode.register_owner = function (options, cb) {
		console.log('');
		logger.info('Creating a marble owner...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'init_owner',
			cc_args: [
				'o' + leftPad(Date.now() + randStr(5), 19),
				options.args.marble_owner,
				options.args.owners_company
			],
			peer_tls_opts: g_options.peer_tls_opts,
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];				//pass owner id back
				cb(err, resp);
			}
		});
	};

	//get a owner/user
	lc_chaincode.get_owner = function (options, cb) {
		var full_username = build_owner_name(options.args.marble_owner, options.args.owners_company);
		console.log('');
		logger.info('Fetching owner ' + full_username + ' list...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: [full_username]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	//get the owner list
	lc_chaincode.get_owner_list = function (options, cb) {
		console.log('');
		logger.info('Fetching owner index list...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['_ownerindex']
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	// disable a marble owner
	lc_chaincode.disable_owner = function (options, cb) {
		console.log('');
		logger.info('Disabling a marble owner...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'disable_owner',
			cc_args: [
				options.args.owner_id,
				options.args.auth_company
			],
			peer_tls_opts: g_options.peer_tls_opts,
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];				//pass owner id back
				cb(err, resp);
			}
		});
	};

	//build full name
	lc_chaincode.build_owner_name = function (username, company) {
		return build_owner_name(username, company);
	};


	// All ---------------------------------------------------------------------------------

	//build full name
	lc_chaincode.read_everything = function (options, cb) {
		console.log('');
		logger.info('Fetching EVERYTHING...');

		var opts = {
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'read_everything',
			cc_args: ['']
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	// get block height
	lc_chaincode.channel_stats = function (options, cb) {
		//logger.info('Fetching block height...');
		fcw.query_channel(enrollObj, null, cb);
	};


	// Other -------------------------------------------------------------------------------

	// Format Owner's Actual Key Name
	function build_owner_name(username, company) {
		return username.toLowerCase() + '.' + company;
	}

	// random string of x length
	function randStr(length) {
		var text = '';
		var possible = 'abcdefghijkmnpqrstuvwxyz0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
		for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

	// left pad string with "0"s
	function leftPad(str, length) {
		for (var i = str.length; i < length; i++) str = '0' + String(str);
		return str;
	}

	return lc_chaincode;
};

