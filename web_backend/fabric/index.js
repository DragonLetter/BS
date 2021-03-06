'use strict';

var hfc = require('fabric-client');
var util = require('util');
var path = require('path');
var sdkUtils = require('fabric-client/lib/utils')
var fs = require('fs');
var options = require(path.join(__dirname, '..', 'config', 'fabric.json'));
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

var fabric = {};

fabric.invoke = function (req, functionName, args, callback) {
    Logger.info("fabric.invoke");

    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    var chaincodeid = option.chaincode_id;
    var peer = null;
    var channel = {};
    var client = null;
    var targets = [];
    var tx_id = null;

    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");

        client = new hfc();
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        channel = client.newChannel(option.channel_id);
        let peertlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(peertlsCertPath);
        peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        //因为启用了TLS，所以上面的代码就是指定Peer的TLS的CA证书 
        channel.addPeer(peer);
        //接下来连接Orderer的时候也启用了TLS，也是同样的处理方法 
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.orderer_tls_cacerts)
        let odata = fs.readFileSync(tlsCertPath);
        let caroots = Buffer.from(odata).toString();
        var orderer = client.newOrderer(option.orderer_url, {
            'pem': caroots,
            'ssl-target-name-override': option.orderer_server
        });

        channel.addOrderer(orderer);
        targets.push(peer);
        return;
    }).then(() => {
        tx_id = client.newTransactionID();
        Logger.debug("Assigning transaction_id:" + tx_id._transaction_id);

        var request = {
            targets: targets,
            chaincodeId: chaincodeid,
            fcn: functionName,
            args: args,
            chainId: option.channel_id,
            txId: tx_id
        };
        Logger.debug("fabric req:" + JSON.stringify(request));
        return channel.sendTransactionProposal(request);
    }).then((results) => {
        var proposalResponses = results[0];
        var proposal = results[1];
        var header = results[2];
        let isProposalGood = false;
        if (proposalResponses && proposalResponses[0].response &&
            proposalResponses[0].response.status === 200) {
            isProposalGood = true;
            Logger.debug("transaction proposal was good");
        } else {
            Logger.info("transaction proposal was bad");
        }
        if (isProposalGood) {
            // console.log(util.format( 
            //     'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s', 
            //     proposalResponses[0].response.status, proposalResponses[0].response.message, 
            //     proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature)); 
            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal,
                header: header
            };
            // set the transaction listener and set a timeout of 30sec 
            // if the transaction did not get committed within the timeout period, 
            // fail the test 
            var transactionID = tx_id.getTransactionID();
            var eventPromises = [];

            // let eh = client.newEventHub();
            let eh = channel.newChannelEventHub(peer);

            //接下来设置EventHub，用于监听Transaction是否成功写入，这里也是启用了TLS 
            // let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
            // let data = fs.readFileSync(tlsCertPath);
            // let grpcOpts = {
            //     pem: Buffer.from(data).toString(),
            //     'ssl-target-name-override': option.server_hostname
            // }
            // eh.setPeerAddr(option.event_url, grpcOpts);
            // eh.connect();

            let txPromise = new Promise((resolve, reject) => {
                let handle = setTimeout(() => {
                    eh.unregisterTxEvent(transactionID);
                    eh.disconnect();
                    reject();
                }, 30000);
                //向EventHub注册事件的处理办法 
                eh.registerTxEvent(transactionID, (tx, code) => {
                    clearTimeout(handle);
                    // eh.unregisterTxEvent(transactionID);
                    // eh.disconnect();

                    if (code !== 'VALID') {
                        Logger.debug("The transaction was invalid, code:" + code);
                        reject();
                    } else {
                        Logger.debug("The transaction has been committed on peer:" + eh.getPeerAddr());
                        //res.end('The transaction has been committed on peer ' + eh._ep._endpoint.addr);
                        resolve();
                    }
                }, (err) => {
                    //this is the callback if something goes wrong with the event registration or processing
                    reject(new Error('There was a problem with the eventhub ::'+err));
                },
                    {disconnect: true} //disconnect when complete
                );
                eh.connect();
            });
            eventPromises.push(txPromise);
            var sendPromise = channel.sendTransaction(request);
            return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                Logger.debug("event promise all complete and testing complete");
                return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call 
            }).catch((err) => {
                Logger.error("Failed to send transaction and get notifications within the timeout period.");
                return 'Failed to send transaction and get notifications within the timeout period.';
            });
        } else {
            Logger.error("Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...");
            return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
        }
    }, (err) => {
        Logger.error("Failed to send proposal due to error: " + err.stack ? err.stack : err);
        return 'Failed to send proposal due to error: ' + err.stack ? err.stack : err;
    }).then((response) => {
        if (response.status === 'SUCCESS') {
            Logger.debug("Successfully sent transaction to the orderer.");
            let resp = { "result": "Successfully sent transaction to the orderer.", "txId": tx_id.getTransactionID() }
            callback(null, resp);
        } else {
            Logger.error("Failed to order the transaction. Error code:" + response.status);
            return 'Failed to order the transaction. Error code: ' + response.status;
        }
    }, (err) => {
        Logger.error("Failed to send transaction due to error:" + err.stack ? err.stack : err);
        return 'Failed to send transaction due to error: ' + err.stack ? err.stack : err;
    });
}
fabric.invoke2cc = function (req, functionName, args, callback) {
    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    //    var chaincodeid = "mylc";
    var chaincodeid = "bcs";
    var peer = null;
    var channel = {};
    var client = null;
    var targets = [];
    var tx_id = null;

    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");

        client = new hfc();
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        channel = client.newChannel(option.channel_id);
        let peertlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(peertlsCertPath);
        peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        //因为启用了TLS，所以上面的代码就是指定Peer的TLS的CA证书 
        channel.addPeer(peer);
        //接下来连接Orderer的时候也启用了TLS，也是同样的处理方法 
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.orderer_tls_cacerts)
        let odata = fs.readFileSync(tlsCertPath);
        let caroots = Buffer.from(odata).toString();
        var orderer = client.newOrderer(option.orderer_url, {
            'pem': caroots,
            'ssl-target-name-override': option.orderer_server
        });

        channel.addOrderer(orderer);
        targets.push(peer);
        return;
    }).then(() => {
        tx_id = client.newTransactionID();
        Logger.debug("Assigning transaction_id:" + tx_id._transaction_id);

        var request = {
            targets: targets,
            chaincodeId: chaincodeid,
            fcn: functionName,
            args: args,
            chainId: option.channel_id,
            txId: tx_id
        };
        Logger.debug("fabric req:" + JSON.stringify(request));
        return channel.sendTransactionProposal(request);
    }).then((results) => {
        var proposalResponses = results[0];
        var proposal = results[1];
        var header = results[2];
        let isProposalGood = false;
        if (proposalResponses && proposalResponses[0].response &&
            proposalResponses[0].response.status === 200) {
            isProposalGood = true;
            Logger.debug("transaction proposal was good");
        } else {
            Logger.info("transaction proposal was bad");
        }
        if (isProposalGood) {
            // console.log(util.format( 
            //     'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s', 
            //     proposalResponses[0].response.status, proposalResponses[0].response.message, 
            //     proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature)); 
            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal,
                header: header
            };
            // set the transaction listener and set a timeout of 30sec 
            // if the transaction did not get committed within the timeout period, 
            // fail the test 
            var transactionID = tx_id.getTransactionID();
            var eventPromises = [];

            // let eh = client.newEventHub();
            let eh = channel.newChannelEventHub(peer);

            //接下来设置EventHub，用于监听Transaction是否成功写入，这里也是启用了TLS 
            let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
            let data = fs.readFileSync(tlsCertPath);
            let grpcOpts = {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
            eh.setPeerAddr(option.event_url, grpcOpts);
            eh.connect();

            let txPromise = new Promise((resolve, reject) => {
                let handle = setTimeout(() => {
                    eh.unregisterTxEvent(transactionID);
                    eh.disconnect();
                    reject();
                }, 30000);
                //向EventHub注册事件的处理办法 
                eh.registerTxEvent(transactionID, (tx, code) => {
                    clearTimeout(handle);
                    // eh.unregisterTxEvent(transactionID);
                    // eh.disconnect();

                    if (code !== 'VALID') {
                        Logger.debug("The transaction was invalid, code:" + code);
                        reject();
                    } else {
                        Logger.debug("The transaction has been committed on peer:" + eh.getPeerAddr());
                        //res.end('The transaction has been committed on peer ' + eh._ep._endpoint.addr);
                        resolve();
                    }
                }, (err) => {
                    //this is the callback if something goes wrong with the event registration or processing
                    reject(new Error('There was a problem with the eventhub ::'+err));
                },
                    {disconnect: true} //disconnect when complete
                );
                eh.connect();
            });
            eventPromises.push(txPromise);
            var sendPromise = channel.sendTransaction(request);
            return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                Logger.debug("event promise all complete and testing complete");
                return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call 
            }).catch((err) => {
                Logger.error("Failed to send transaction and get notifications within the timeout period.");
                return 'Failed to send transaction and get notifications within the timeout period.';
            });
        } else {
            Logger.error("Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...");
            return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
        }
    }, (err) => {
        Logger.error("Failed to send proposal due to error: " + err.stack ? err.stack : err);
        return 'Failed to send proposal due to error: ' + err.stack ? err.stack : err;
    }).then((response) => {
        if (response.status === 'SUCCESS') {
            Logger.debug("Successfully sent transaction to the orderer.");
            let resp = { "result": "Successfully sent transaction to the orderer.", "txId": tx_id.getTransactionID() }
            callback(null, resp);
        } else {
            Logger.error("Failed to order the transaction. Error code:" + response.status);
            return 'Failed to order the transaction. Error code: ' + response.status;
        }
    }, (err) => {
        Logger.error("Failed to send transaction due to error:" + err.stack ? err.stack : err);
        return 'Failed to send transaction due to error: ' + err.stack ? err.stack : err;
    });
}

fabric.query = function (req, functionName, args, callback) {
    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    var chaincodeid = option.chaincode_id;
    var channel = {};
    var client = null;
    var channel_id = option.channel_id;
    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");
        client = new hfc();
        // var pkFolder= path.join(__dirname, '..', 'config/crypto', option.privateKeyFolder)
        // var certPath= path.join(__dirname, '..', 'config/crypto', option.signedCert)
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            //cryptoContent: { privateKey: getKeyFilesInDir(pkFolder)[0], signedCert: certPath }
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        channel = client.newChannel(channel_id);
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(tlsCertPath);
        let peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        peer.setName("peer0");
        //因为启用了TLS，所以上面的代码就是指定TLS的CA证书 
        channel.addPeer(peer);
        return;
    }).then(() => {
        Logger.debug("Make query");
        var transaction_id = client.newTransactionID();
        Logger.debug("Assigning transaction_id: " + transaction_id._transaction_id);
        //构造查询request参数 
        const request = {
            chaincodeId: chaincodeid,
            txId: transaction_id,
            fcn: functionName,
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) => {
        Logger.debug("returned from query");
        if (!query_responses.length) {
            Logger.debug("No payloads were returned from query");
        } else {
            Logger.debug("Query result count = " + query_responses.length)
        }
        if (query_responses[0] instanceof Error) {
            Logger.error("error from query = " + query_responses[0]);
        }
        Logger.debug("Response is " + query_responses[0].toString());//打印返回的结果 
        callback(null, { "result": query_responses[0].toString() });
    }).catch((err) => {
        Logger.error("Caught Error" + err);
        callback(err, null);
    });
}
fabric.query2cc = function (req, functionName, args, callback) {
    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    var chaincodeid = "bcs";
    var channel = {};
    var client = null;
    var channel_id = option.channel_id;
    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");
        client = new hfc();
        // var pkFolder= path.join(__dirname, '..', 'config/crypto', option.privateKeyFolder)
        // var certPath= path.join(__dirname, '..', 'config/crypto', option.signedCert)
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            //cryptoContent: { privateKey: getKeyFilesInDir(pkFolder)[0], signedCert: certPath }
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        channel = client.newChannel(channel_id);
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(tlsCertPath);
        let peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        peer.setName("peer0");
        //因为启用了TLS，所以上面的代码就是指定TLS的CA证书 
        channel.addPeer(peer);
        return;
    }).then(() => {
        Logger.debug("Make query");
        var transaction_id = client.newTransactionID();
        Logger.debug("Assigning transaction_id: " + transaction_id._transaction_id);
        //构造查询request参数 
        const request = {
            chaincodeId: chaincodeid,
            txId: transaction_id,
            fcn: functionName,
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) => {
        Logger.debug("returned from query");
        if (!query_responses.length) {
            Logger.debug("No payloads were returned from query");
        } else {
            Logger.debug("Query result count = " + query_responses.length)
        }
        if (query_responses[0] instanceof Error) {
            Logger.error("error from query = " + query_responses[0]);
        }
        Logger.debug("Response is " + query_responses[0].toString());//打印返回的结果 
        callback(null, { "result": query_responses[0].toString() });
    }).catch((err) => {
        Logger.error("Caught Error" + err);
        callback(err, null);
    });
}

fabric.queryHeight = function (req, channel, callback) {
    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    var client = null;
    var channel_id = channel;
    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");
        client = new hfc();
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            //cryptoContent: { privateKey: getKeyFilesInDir(pkFolder)[0], signedCert: certPath }
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        channel = client.newChannel(channel_id);
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(tlsCertPath);
        let peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        peer.setName("peer0");
        //因为启用了TLS，所以上面的代码就是指定TLS的CA证书 
        channel.addPeer(peer);
        return channel.queryInfo();
    }).then((blockchainInfo) => {

        if (blockchainInfo == undefined) {
            Logger.error("error from query chain height");
        }
        Logger.debug("Response is " + query_responses[0].toString());//打印返回的结果 
        callback(null, { "result": blockchainInfo });
    }).catch((err) => {
        Logger.error("Caught Error" + err);
        callback(err, null);
    });
}

fabric.queryBlock = function (req, channel, blockId, callback) {
    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    var client = null;
    var channel_id = channel;
    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");
        client = new hfc();
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            //cryptoContent: { privateKey: getKeyFilesInDir(pkFolder)[0], signedCert: certPath }
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        channel = client.newChannel(channel_id);
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(tlsCertPath);
        let peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        peer.setName("peer0");
        //因为启用了TLS，所以上面的代码就是指定TLS的CA证书 
        channel.addPeer(peer);
        return channel.queryBlock(blockId);
    }).then((block) => {

        if (block == undefined) {
            Logger.error("error from query chain height");
        }
        Logger.debug("Response is " + query_responses[0].toString());//打印返回的结果 
        callback(null, { "result": block });
    }).catch((err) => {
        Logger.error("Caught Error", err);
        callback(err, null);
    });
}

fabric.queryTx = function (req, channel, txId, callback) {
    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    var client = null;
    var channel_id = channel;
    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");
        client = new hfc();
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            //cryptoContent: { privateKey: getKeyFilesInDir(pkFolder)[0], signedCert: certPath }
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        channel = client.newChannel(channel_id);
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(tlsCertPath);
        let peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        peer.setName("peer0");
        //因为启用了TLS，所以上面的代码就是指定TLS的CA证书 
        channel.addPeer(peer);
        return channel.queryTransaction(txId);
    }).then((processedTransaction) => {

        if (processedTransaction == undefined) {
            Logger.error("error from query chain height");
        }
        Logger.debug("Response is " + query_responses[0].toString());//打印返回的结果 
        callback(null, { "result": processedTransaction });
    }).catch((err) => {
        Logger.error("Caught Error" + err);
        callback(err, null);
    });
}

fabric.getAllChannels = function (req, callback) {
    var session = req.session;
    var username = session.username;
    var option = options[username];
    if (option == undefined) { option = options["B1Admin"]; }
    var client = null;

    Promise.resolve().then(() => {
        Logger.debug("Load privateKey and signedCert");
        client = new hfc();
        var createUserOpt = {
            username: option.user_id,
            mspid: option.msp_id,
            //cryptoContent: { privateKey: getKeyFilesInDir(pkFolder)[0], signedCert: certPath }
            cryptoContent: { privateKeyPEM: option.privateKey, signedCertPEM: option.cert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/tmp/fabric-client-stateStore/"
        }).then((store) => {
            client.setStateStore(store)
            return client.createUser(createUserOpt)
        })
    }).then((user) => {
        let tlsCertPath = path.join(__dirname, '..', 'config/crypto', option.peer_tls_cacerts)
        let data = fs.readFileSync(tlsCertPath);
        let peer = client.newPeer(option.peer_url,
            {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': option.server_hostname
            }
        );
        peer.setName("peer0");
        //因为启用了TLS，所以上面的代码就是指定TLS的CA证书 
        var channels = client.queryChannels(peer);

        return channels;
    }).then((ChannelQueryResponse) => {

        if (ChannelQueryResponse == undefined) {
            Logger.error("error from query chain height");
        }
        Logger.debug("Response is " + query_responses[0].toString());//打印返回的结果 
        callback(null, { "result": ChannelQueryResponse.channels });
    }).catch((err) => {
        Logger.error("Caught Error" + err);
        callback(err, null);
    });
}

module.exports = fabric;