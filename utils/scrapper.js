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

    await new Promise(r => setTimeout(r, 5000));

    const cards = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#api-area-results .item-area'), (e) => ({
            name: e.querySelector('.item-name h1').innerText,
            description: e.querySelector('.item-ability p').innerText,
            imagePath: e.querySelector('.item-img img').src
        }))
    )

    var res = null;
    if(cards.length != 0) {
        res = cards[0];
    }

    await browser.close();
    return res;
}