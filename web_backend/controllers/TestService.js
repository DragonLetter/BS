'use strict';
var fabric=require("../fabric")

exports.transfer = function (req, res, next) { var args=req.swagger.params;
  
    var accountA=args.accountA.value;
    var accountB=args.accountB.value;
    var amount=args.amount.value;
    var fabricArgs=[accountA,accountB,amount];
    fabric.invoke(req,"invoke",fabricArgs,function(err,resp){
        if(!err)
        {
        console.log(resp.result);
        res.end(resp.result);
        }
        else{
            console.log(err);
        }
    });
}

exports.getAccountBalance = function (req, res, next) { var args=req.swagger.params;

var account= args.account.value;

fabric.query(req,"query",[account],function(err,resp){
    if(!err)
    {
    console.log(resp.result);
    res.end(resp.result);
    }
});

}

