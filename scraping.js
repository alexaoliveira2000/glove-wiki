const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const { Matrix } = require('ml-matrix');

let load = async function () {
    let response = await axios.get('https://pt.wikipedia.org/wiki/Portugal');
    const $ = cheerio.load(response.data);
    const pageTitle = $('#firstHeading').text();
    console.log(pageTitle);
}

let readGloVeFile = async function (filePath) {
    let data = await fs.readFile(filePath, 'utf8');
    const lines = data.split('\n').map(line => line.split(" "));
    //console.log(lines[0]);
    let glove = {}
    for (const line of lines) {
        const key = line.shift()
        glove[key] = line.map(value => parseFloat(value));
    }
    //console.log(glove["the"]);
    return glove;
}

let getWordSimilarity = function (glove, word1, word2) {
    // Create matrix representations of your word vectors
    //console.log(glove[word1])
    const vectorWord1 = new Matrix([glove[word1]]);
    const vectorWord2 = new Matrix([glove[word2]]);

    // Calculate the dot product of the vectors
    const dotProduct = vectorWord1.mmul(vectorWord2.transpose()).get(0, 0);

    // Calculate the magnitudes of the vectors
    const magnitude1 = vectorWord1.norm();
    const magnitude2 = vectorWord2.norm();

    // Calculate the cosine similarity
    const similarity = dotProduct / (magnitude1 * magnitude2);

    console.log(`The similarity between the vectors is: ${similarity}`);

    return similarity;
}

let test = async function () {
    let glove = await readGloVeFile("C:\\Users\\alexandre.oliveira\\OneDrive - Introsys SA\\Desktop\\glove.6B.50d.txt");
    let similarity1 = getWordSimilarity(glove, "dog", "cat")
    let similarity2 = getWordSimilarity(glove, "mountain", "brain")
}

//load()
//readGloVeFile("C:\\Users\\alexandre.oliveira\\OneDrive - Introsys SA\\Desktop\\glove.6B.50d.txt")
test()