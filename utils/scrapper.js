const puppeteer = require('puppeteer');

module.exports = async function findCard(searchString) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    var newSearchString = "";
    for(var i=0; i<searchString.length; i++) {
        if(searchString[i] == ' ') {
            newSearchString += '%20';
        } else {
            newSearchString += searchString[i];
        }
    }
    url = 'https://ygoprodeck.com/card-database/?&name=' + newSearchString + '&num=24&offset=0';
    await page.goto(url);

    await new Promise(r => setTimeout(r, 500));

    const cards = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#api-area-results .item-area'), (e) => ({
            name: e.querySelector('.item-name h1').innerText,
            description: e.querySelector('.item-ability p').innerText,
            imagePath: e.querySelector('.item-img img').getAttribute('data-src')
        }))
    )
    var res = null;
    for (let i = 0; i < cards.length; i++) {
        if(cards[i].name == searchString) {
            res = cards[i];
        }
    }
    
    if(res==null) {
        res = cards[0];
    }

    await browser.close();
    return res;
}