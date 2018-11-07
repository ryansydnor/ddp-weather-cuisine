const googleTrends = require('google-trends-api');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const restaurants = require('fs').readFileSync('restaurants.txt', 'utf-8').split('\n')

const startDate1 = '2017-01-02';
const endDate1 = '2017-05-31';
const startDate2 = '2017-06-01';
const endDate2 = '2018-01-02';
const dates = [];

for(var i=0; i<365; i++){
    const date = new Date(startDate1);
    date.setDate(date.getDate() + i);
    dates.push(date);
}

const result = restaurants.reduce((acc, cur) => {
    acc[cur] = [];
    return acc;
}, {})

async function pull(){

    for (const keyword of Object.keys(result)) {
        console.log(keyword)
        if(keyword) {
            try{
                const firstHalf = await googleTrends.interestOverTime({
                    keyword,
                    startTime: new Date(startDate1),
                    endTime: new Date(endDate1),
                    category: 71,
                    geo: 'US-NY-501'
                });
                const data = JSON.parse(firstHalf).default.timelineData;
                
                const secondHalf = await googleTrends.interestOverTime({
                    keyword,
                    startTime: new Date(startDate2),
                    endTime: new Date(endDate2),
                    category: 71,
                    geo: 'US-NY-501'
                });
                const fullData = data.concat(JSON.parse(secondHalf).default.timelineData);
                const resultData = fullData.map((x) => {
                    return x.value[0]
                })
                result[keyword] = resultData; 
                await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](1500)
            } catch(e) {
                console.log("Error!!")
                console.log(e);
            }
        }
    }

    result['date'] = dates;

    const csv = []
    for(let i=0; i<365; i++) {
        const row = [];
        for (const column of Object.keys(result)) {
            row.push(result[column][i])
        }
        csv.push(row)
    }


    const csvWriter = createCsvWriter({
        header: Object.keys(result),
        path: 'result.csv'
    });
    csvWriter.writeRecords(csv);
}


pull();
