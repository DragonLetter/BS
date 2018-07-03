'use strict';
var models = require('../models');
var Sequelize = require("sequelize");
var fabric = require("../fabric");
var ByteBuffer=require("bytebuffer");
exports.getLatestBlock = function (req, res, next) { var args=req.swagger.params;
    /**
     * 获取最新区块的区块基本信息
     * 
     *
     **/
    var channel=args.channel.value;
    fabric.queryHeight(req,channel,function(err,result){
        var blockInfo=result.result;
        console.log(blockInfo);
var blk={  blockNum:blockInfo.height.toInt(),
    
  datahash:toHexString(blockInfo.currentBlockHash.buffer),  
  prehash:toHexString(blockInfo.previousBlockHash.buffer),
  channelname:channel,
  txcount:0
};

res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify(blk));
    });
}

exports.getBlocks = function (req, res, next) { 
    var args=req.swagger.params;
    /**
     * get the blocks of blockchain
     * 
     *
     **/
    var channel=args.channel.value;
    var blockId=args.blockId.value;
    //var blkHash= ByteBuffer.fromHex(args.blockHash.value);
   
    fabric.queryBlock(req,channel,blockId, function(err,result){
        var blockInfo=result.result;
        console.log(blockInfo);
var blk={  blockNum:blockInfo.header.number.toInt(),
    
  datahash:blockInfo.header.data_hash,  
  prehash:blockInfo.header.previous_hash,
  channelname:channel,
  txcount:blockInfo.data.data.legnth
};
res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify(blk));

    });
      
}
function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }
exports.getTransactions = function (req, res, next) { var args=req.swagger.params;
    /**
     * get the transactions of blockchain
     * 
     *
     **/
    var channel=args.channel.value;
    var blkHash=args.blockHash.value;
    fabric.queryBlock(req,channel,blkHash, function(err,result){
        var blockInfo=result.result;
        var datahash=toHexString(blockInfo.currentBlockHash.buffer);
        var prehash=toHexString(blockInfo.previousBlockHash.buffer);
        var txList=blockInfo.data.data;
        var list=[];
        for(var i=0;i<txList.length;i++){
            var tx=txList[i];
            var data = {};
            data.id = 1;
            data.blockid = datahash;
            data.txhash = tx.hash;
            data.prehash = prehash;
            data.createAt = "2017-12-19T09:05:47.984Z";
            data.channelname = channel;
            list.push(data);
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(list));
    });
  
}
exports.getAllChannels = function (req, res, next) { 
    var args=req.swagger.params;
    fabric.getAllChannels(req,function(err,result){
        if(err){
            res.end(err);
            return;
        }
        
        res.setHeader('Content-Type', 'application/json');
        var list=[];
        for (var i=0;i<result.result.length;i++){
            list.push(result.result[i].channel_id);
        }
        res.end(JSON.stringify(list));
    });
}