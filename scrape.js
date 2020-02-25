const request = require('request')
const cheerio = require('cheerio')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csvWriter=createCsvWriter({
    path:'Top50-scrape.csv',
    header:[
        {id:'r',title:'Rank'},
        {id:'c',title:'Company Name'},
        {id:'o',title:'Orgnization Name'},
        {id:'l',title:'Location'},
        {id:'d',title:'Description'}
    ]

})

request('https://www.wealthprofessional.ca/special-reports/top-50/top-50-advisors-2018/253632',
    (error, response, html) => {
        if (!error && response.statusCode == 200) {

            const $ = cheerio.load(html)


            $(".article-detail-list__item").each((i, el) => {

                const listItem = $(el)
                    .find('h4')
                    .text()
                    .trim()

                const rank =
                    listItem.slice(0, listItem.indexOf(','));

                const link = $(el)
                    .find(".article-detail-list__item__img")
                    .find('a')
                    .attr('href')
                var fullLink = "https://www.wealthprofessional.ca".concat(link)
                request(`${fullLink}`,
                    (error, response, html) => {
                        if (!error && response.statusCode == 200) {
                            const $ = cheerio.load(html)

                            const compName =
                                $('.wrapper--detail__body')
                                    .find('strong')
                                    .text()
                                    .split('\n')[0]
                                   

                            var orgName 
                            orgName = $('.wrapper--detail__body')
                            .find('strong')
                            .text()
                            // .replace (/\s\s+/g,"")
                            // .replace (/\s\s/,"")
                            .split('\n')[1]

                         if (rank == "2 Rob Tetrault") {
                             orgName = $('.wrapper--detail__body')
                            .text()
                            .split('\n')[2]
                             //.trim()
                           }
                         
                            var location
                            var genDescrip
                            if (orgName == undefined) {
                                location =
                                    $('.wrapper--detail__body')
                                        .text()
                                        .split('\n')[2]
                                     
                            }
                            else
                                location =
                                    $('.wrapper--detail__body')
                                        .text()
                                        .split('\n')[3]
                                      


                            genDescrip =
                                $('.wrapper--detail__body')
                                    .text()
                                    .replace(`${compName}`, '')
                                    .replace(`${orgName}`, '')
                                    .replace(`${location}`, '')
                                    .trim();
const data=[
        {r:`${rank}`,
        c:`${compName}`,
        o:`${orgName}`,
        l:`${location}`,
        d:`${genDescrip}`}

]
csvWriter.writeRecords(data)


                        }
                    })

            })


        }


    })