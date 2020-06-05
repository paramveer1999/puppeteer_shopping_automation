
let puppeteer=require("puppeteer");
let fs=require("fs");
let file=process.argv[2];
let text=process.argv[3];
(async function(){
    let data=await fs.promises.readFile(file,"utf-8");
    let links=JSON.parse(data);
    link1=links.link1;
    link2=links.link2;
    link3=links.link3;
    link4=links.link4;

    let browser=await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximized","--disable-notifications"],
        slowMo:80
    });
    console.log("Working!")
    console.log("          ");
    let numberofPages=await browser.pages();
    let tab=numberofPages[0];
    await tab.goto(link1,{
        waitUntil:"networkidle2"
    })
    await tab.waitForSelector("#inputValEnter");
    await tab.type("#inputValEnter",text);
    await tab.waitForSelector(".searchTextSpan");
    await tab.click(".searchTextSpan");
    

    await tab.waitForSelector(".lfloat.product-price")
    
    let listPrice=await tab.$$(".lfloat.product-price");
    //console.log(listPrice.length);
    let price1=await tab.evaluate(function(q){
        return q.getAttribute("data-price");
    },listPrice[0]);
    console.log("₹"+Number(price1)+" Snapdeal");
    console.log("*********************************")
    
   
    //////AMAZON
    let newTab=await browser.newPage();
    await newTab.goto(link2,{
        waitUntil:"networkidle2"
    })
    await newTab.waitForSelector("#twotabsearchtextbox");
    await newTab.type("#twotabsearchtextbox",text);
    await newTab.waitForSelector(".nav-search-submit-text");
    await Promise.all([newTab.waitForNavigation({
        waitUntil : "networkidle0"
    }), newTab.click(".nav-search-submit-text")])
    
    await newTab.waitForSelector(".a-price-whole");
    let listPrice1=await newTab.$$(".a-price-whole");

    //console.log("---------------------------")
    
    let p=await  (await listPrice1[0].getProperty('innerText')).jsonValue();
    console.log("₹"+Number(p)+" Amazon");
    console.log("*********************************")

    //flipkart
    let newTab1=await browser.newPage();
    await newTab1.goto(link3,{
        waitUntil:"networkidle2"
    })
    await newTab1.waitForSelector("._39M2dM.JB4AMj");
    // await newTab1.type("._39M2dM.JB4AMj","p");

    await newTab1.waitForSelector("._2AkmmA._29YdH8");
    await newTab1.click("._2AkmmA._29YdH8");
    await newTab1.waitForSelector(".LM6RPg");
    await newTab1.type(".LM6RPg",text);
    await newTab1.waitForSelector(".vh79eN");
    await newTab1.click(".vh79eN");
    //price
    await newTab1.waitForSelector("._1vC4OE");
    let listPrice2=await newTab1.$$("._1vC4OE");
    let pr=await  (await listPrice2[0].getProperty('innerText')).jsonValue();
    let a=Number(pr.slice(1));
    if (await newTab1.$("._3aV9Tq") !== null){
        a=0;
        console.log("Not Deliverable:"+ " Flipkart")
    }else{
    console.log("₹"+a+" Flipkart");
    }

    console.log("*********************************")
    
    
//*************************************** */

    ///paytm

    // let newTab2=await browser.newPage();
    // await newTab2.goto(link4,{
    //     waitUntil:"networkidle2"

    // })
    // // 
    // await newTab2.waitForSelector("._3HxD input");
    // await newTab2.type("._3HxD input","samsung j7 prime back cover");
    // await newTab2.keyboard.press('Enter');

    // await newTab2.waitForSelector("._1kMS");
    // let paytm=await newTab2.$$("._1kMS");
    // let paytmPrice=await (await paytm[0].getProperty('innerText')).jsonValue();

    // let x=Buffer.from(paytmPrice);
    // let y=Number(x.slice(2,6));
    
    // console.log("₹"+y+" PAYTM");



    // await newTab2.close();
    function delay(time){
        return new Promise(function(resolve){
            setTimeout(resolve,time)
        });
    }

    await delay(3000);
    await newTab1.close();
    await delay(3000);
    await newTab.close();
    await delay(3000);
    await tab.close();
    console.log("    ");

    
    if(a!=0){
    if((a<=p&&a<=price1)){
        console.log("Lowest price is at Flipkart.You should buy from it Thank You!!" );
    }
    }else{
        
    }

    
    if(a!=0){
     if(p<=a&&p<=price1){
        console.log("Lowest price is at Amazon.You should buy from it Thank You!!" );
    }}
    else{
        if(p<=price1){
            console.log("Lowest price is at Amazon.You should buy from it Thank You!!");
        }}
    
    if(a!=0){

    if(price1<=a&&price1<=p){
        console.log("Lowest price is at Snapdeal.You should buy from it Thank You!!" );}
    }
    else{
        if(price1<=p){
            console.log("Lowest price is at Snapdeal.You should buy from it Thank You!!" );

        }
    }
    






})()