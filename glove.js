const path = require('path');             // to check extension of links
const axios = require('axios');           // to get html from pages
const cheerio = require('cheerio');       // to scrape html links
const fs = require('fs').promises;        // to read GloVe file
const { Matrix } = require('ml-matrix');  // to calculate similarity between words

// get all possible links from a given wiki page
let getLinks = async function (page) {
    let isValidLink = function (link) {
        return link && link.startsWith("/wiki/") && !link.includes(":") && path.extname(link) === '' && link !== "Main_Page";
    }
    let response = await axios.get(page);
    const $ = cheerio.load(response.data);
    let links = []
    $('a').each(function () {
        const href = $(this).attr('href');
        if (isValidLink(href))
            links.push(href.split("/")[2].toLowerCase());
    });
    return links;
}

// read GloVe file in a given path
// returns an object with properties { "word1" : [d1, d2, d3, ...], "word2" : [d1, d2, d3, ...], ... }
let readGloVeFile = async function (filePath) {
    let data = await fs.readFile(filePath, 'utf8');
    const lines = data.split('\n').map(line => line.split(" "));
    let glove = {}
    for (const line of lines) {
        const key = line.shift();
        glove[key] = line.map(value => parseFloat(value));
    }
    return glove;
}

// calculate the similarity (0 to 1) between two word, given a GloVe model
let getWordSimilarity = function (glove, word1, word2) {
    dimensionsWord1 = glove[word1];
    dimensionsWord2 = glove[word2];

    if(!dimensionsWord1 || !dimensionsWord2)
        return 0;

    const vectorWord1 = new Matrix([dimensionsWord1]);
    const vectorWord2 = new Matrix([dimensionsWord2]);

    const dotProduct = vectorWord1.mmul(vectorWord2.transpose()).get(0, 0);

    const magnitude1 = vectorWord1.norm();
    const magnitude2 = vectorWord2.norm();

    const similarity = dotProduct / (magnitude1 * magnitude2);

    return similarity;
}

// try to travel from the given source page to destination page, with a limit of pages
// returns the path
let play = async function (sourcePage, destinationPage) {
    let glove = await readGloVeFile("C:\\Users\\Alex\\Desktop\\glove-wiki\\glove.6B.50d.txt");
    let pagesPath = [sourcePage];
    let limit = 100;
    while (sourcePage != destinationPage && pagesPath.length < limit) {
        let pageLink = "https://en.wikipedia.org/wiki/" + sourcePage
        console.log("Requesting page: " + pageLink);
        let links = await getLinks(pageLink);
        sourcePage = links[0];
        let highestSimilarity = 0;
        for (const link of links) {
            if (pagesPath.includes(link))
                continue
            let similarity = getWordSimilarity(glove, link, destinationPage);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                sourcePage = link;
            }
        }
        pagesPath.push(sourcePage);
        console.log(sourcePage + " is the best page with a similarity of " + highestSimilarity);
        console.log();
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log(pagesPath)
}

play("portugal", "universe")
