var StromDAOBO = require("stromdao-businessobject");
var node = new StromDAOBO.Node({external_id:"nodex",testMode:true});
var fs = require("fs");

console.log("Signing build as:",node.wallet.address);
var ethers = require('ethers');

var provider = ethers.providers.getDefaultProvider();

provider.getBlockNumber().then(function(blockNumber) {
    var build_info={};
    build_info.blockNumber=blockNumber;
    build_info.signature=node.sign(blockNumber);
    build_info.publisher=node.wallet.address;
    fs.writeFileSync("./static/html/includes/build_info.json",JSON.stringify(build_info));
});
