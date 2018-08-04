$.qparam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                    .exec(window.location.search);

  return (results !== null) ? results[1] || 0 : false;
}

function shortName(kyc,address) {
  if(typeof kyc[address]=="undefined") {
    if(address==$.qparam('a')) { return "<span class='second'>this account</span>"; }
    return address.substr(0,10)+"...";
  } else {
    if(address==$.qparam('a')) { return "<span class='second'>"+kyc[address].short_name+"</span>"; }
    return kyc[address].short_name;
  }
}

function app(kyc) {

  document.app={};
  document.app.provider=ethers.providers.getDefaultProvider("homestead");

  var provider = ethers.providers.getDefaultProvider();

  $('#account').html(shortName(kyc,$.qparam('a')));
  if((typeof kyc[$.qparam('a')]!="undefined")&&(typeof kyc[$.qparam('a')].description!="undefined")) {
      $('#description').html(kyc[$.qparam('a')].description);
  }
  provider.getBalance($.qparam('a')).then(function(balance) {
    $('#balance').html((ethers.utils.formatEther(balance).toString()*1).toFixed(4));
  });
  //0xa050b90B0C60900E304774Eb39220dFB2C5fFf0F
  //0x61bdd888b3bd3f8466a4fb2e16435e917cd458a0
  $.getJSON("http://api.etherscan.io/api?module=account&action=txlist&address="+$.qparam('a')+"&startblock=6000000&endblock=99999999&sort=asc&apikey=YourApiKeyToken",function(results) {

    results=results.result;

    var cleaned=[];
    function nextResult() {
      if(results.length>0) {
          x= results.pop();
          x.value =ethers.utils.formatEther(x.value);
          x.timestamp=x.timeStamp;
          x.to_friendly=shortName(kyc,x.to);
          x.from_friendly=shortName(kyc,x.from);
          if(window.localStorage.getItem("b_"+x.blockNumber)==null) {
            $.getJSON("https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&ts="+x.timestamp+"&extraParams=corrently",function(info) {
              console.log(info);
                window.localStorage.setItem("b_"+x.blockNumber,info.ETH.EUR);
                x.eur=x.value*info.ETH.EUR;
                cleaned.push(x);
                nextResult();
            });
          } else {
            x.eur=x.value*window.localStorage.getItem("b_"+x.blockNumber);
            x.rate=window.localStorage.getItem("b_"+x.blockNumber);
            cleaned.push(x);
            nextResult();
          }
        } else {
          console.log(cleaned);
          for(var i=0;i<cleaned.length;i++) {
              $('#ledgerIt').append("<tr><td title='Block:"+cleaned[i].blockNumber+"'>"+new Date(cleaned[i].timestamp*1000).toLocaleString()+"</td><td title='"+cleaned[i].from+"'><a href='./ledger_otc.html?a="+cleaned[i].from+"'>"+cleaned[i].from_friendly+"</a></td><td title='"+cleaned[i].to+"'><a href='./ledger_otc.html?a="+cleaned[i].to+"'>"+cleaned[i].to_friendly+"</a></td><td align='right'>"+(cleaned[i].value*1).toFixed(4)+"</td><td align='right'>"+cleaned[i].eur.toFixed(2)+"</td></tr>");
          }
        }
    }
    nextResult();


  });

  $.getJSON("http://api.etherscan.io/api?module=account&action=txlistinternal&address="+$.qparam('a')+"&startblock=6000000&endblock=99999999&sort=asc&apikey=YourApiKeyToken",function(results) {
    results=results.result;

    var cleaned=[];
    function nextResult() {
      if(results.length>0) {
          x= results.pop();
          x.value =ethers.utils.formatEther(x.value);
          x.timestamp=x.timeStamp;
          x.to_friendly=shortName(kyc,x.to);
          x.from_friendly=shortName(kyc,x.from);
          if(window.localStorage.getItem("b_"+x.blockNumber)==null) {
            $.getJSON("https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&ts="+x.timestamp+"&extraParams=corrently",function(info) {
                window.localStorage.setItem("b_"+x.blockNumber,info.ETH.EUR);
                x.eur=x.value*info.ETH.EUR;
                cleaned.push(x);
                nextResult();
            });
          } else {
            x.eur=x.value*window.localStorage.getItem("b_"+x.blockNumber);
            x.rate=window.localStorage.getItem("b_"+x.blockNumber);
            cleaned.push(x);
            nextResult();
          }
        } else {
          console.log(cleaned);
          for(var i=0;i<cleaned.length;i++) {
              $('#ledgerIn').append("<tr><td title='Block:"+cleaned[i].blockNumber+"'>"+new Date(cleaned[i].timestamp*1000).toLocaleString()+"</td><td title='"+cleaned[i].from+"'><a href='./ledger_otc.html?a="+cleaned[i].from+"'>"+cleaned[i].from_friendly+"</a></td><td title='"+cleaned[i].to+"'><a href='./ledger_otc.html?a="+cleaned[i].to+"'>"+cleaned[i].to_friendly+"</a></td><td align='right'>"+(cleaned[i].value*1).toFixed(4)+"</td><td align='right'>"+cleaned[i].eur.toFixed(2)+"</td></tr>");
          }
        }
    }
    nextResult();

  });

}
$(document).ready(function() {
  $.getJSON("./data/kyc.json",function(kyc) {
        app(kyc);
  })

})
