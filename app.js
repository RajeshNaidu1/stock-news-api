const express= require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs= require("ejs");
const https= require("https");
const { title } = require("process");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let posts=[]
let lists=[]
let blogs=[]
const homeContent="Head Lines";


app.get("/",function(req,res){
    const userAgent = req.get('user-agent');
    const options = {
    host: 'newsapi.org',
    path: '/v2/everything?q=stocks&apiKey=82f6f99824c54a9ab28398e1f8f066f6',
    headers: {
      'User-Agent': userAgent
    }
  }
  posts=[]
    https.get(options,function(response){
        let dataComplete;
        response.on("data",function(data){
            if(!dataComplete){
                dataComplete = data
            }
            else{
                dataComplete+=data
            }})
        response.on('end',function(){
            const newsData = JSON.parse(dataComplete) 
            for(let i=0;i<10;i++){
                let post=({
                    headLines:newsData.articles[i].title,
                    content: newsData.articles[i].content,
                    image: newsData.articles[i].urlToImage,
                    url:newsData.articles[i].url
                })
                posts.push(post);
                }
                // console.log(posts);   
            res.render("home",{homeContent:homeContent,posts:posts,companyData:companyData,companyStockData:companyStockData,blogs:blogs})
        })
    })
})

app.post("/home",function(req,res){
    const company= req.body.company
    res.redirect("/company/"+company);
})
let companyStockData=[]
let companyData=[]
app.get("/company/:companyName",function(req,res){
    const companyTitle1= req.params.companyName;
    const companyTitle=companyTitle1.toUpperCase();
    const url1=`https://financialmodelingprep.com/api/v3/profile/${companyTitle}?apikey=313e00f0dc324a6ef23cdfd241b68b3a`
    const url2=`https://financialmodelingprep.com/api/v3/quote/${companyTitle}?apikey=313e00f0dc324a6ef23cdfd241b68b3a`
    https.get(url1,function(resp){
        resp.on("data",function(data){
            const stockData= JSON.parse(data);
            https.get(url2,function(response){
                response.on("data",function(data){
                        const stockData1= JSON.parse(data);
                                companyStockData=({
                                    open:stockData1[0].open,
                                    changesPercentage:stockData1[0].changesPercentage,
                                    change:stockData1[0].change,
                                    dayLow:stockData1[0].dayLow,
                                    dayHigh:stockData1[0].dayHigh,
                                    volume:stockData1[0].volume,
                                    prevClose:stockData1[0].previousClose
                                })
                                // console.log(companyStockData)
                                companyData=({
                                    symbol:stockData[0].symbol,
                                    price:stockData[0].price,
                                    description:stockData[0].description,
                                    exchange:stockData[0].exchange,
                                    isin:stockData[0].isin,
                                    phone:stockData[0].phone,
                                    imageCom:stockData[0].image,
                                    comName:stockData[0].companyName
                                })
                                res.render("company",{companyData:companyData,companyStockData:companyStockData})
                })
                })
        })
    })
    
})
app.get("/news/:title",function(req,res){
    const title=req.params.title;
    posts.forEach(function(post){
    if(post.headLines === title){
        res.render("news",{title:post.headLines,content:post.content,image:post.image,url:post.url})
    }
    })
})

app.get("/compose",function(req,res){
    res.render("compose");
})
app.post("/compose",function(req,res){
    const blog={
        title:req.body.BlogTitle,
        body:req.body.BlogBody,
        file:req.body.image
    }
    blogs.push(blog)
    res.redirect("/")
})
app.get("/pins",function(req,res){
    res.render("pins");
})
app.listen(3000,function(){
    console.log("Server Created");
});
