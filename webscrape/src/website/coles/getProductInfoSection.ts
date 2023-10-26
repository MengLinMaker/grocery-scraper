import * as Cheerio from 'cheerio'
import { scrapeStatic } from '../../request/scrapeStatic'
import { ProductInfoReport } from '../ProductInfoReport'
import { getProductInfoPage } from './getProductInfoPage'
import { getNumFromString } from '../../dataCleaning/getNumFromString'
import { wait } from '../../request/wait'

export const getProductInfoSection = async (url: string, _cookie?: string) => {
  const report = new ProductInfoReport()

  let pageLimit = Infinity
  for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber++) {
    let jsonData = ''
    while (jsonData == '') {
      try {
        const html = await scrapeStatic(url + `?sortBy=unitPriceAscending&page=${pageNumber}`)
        const $ = Cheerio.load(html)

        if (pageLimit == Infinity) {
          const paginationHtml = $('nav.coles-targeting-PaginationPaginationRoot').toString()
          const $$ = Cheerio.load(paginationHtml)
          const newPageLimit = getNumFromString($$('span').text())[1]
          if (newPageLimit) pageLimit = newPageLimit
        }

        jsonData = $('#__NEXT_DATA__').text()
      } catch {
        wait(15000)
      }
    }
    report.recordProductInfoPage(getProductInfoPage, jsonData)

    const numProducts = report.get().productInfo.length
    console.debug(
      `Page ${pageNumber}/${pageLimit} - ${url.split('/').slice(-1)[0]} - ${numProducts} products`,
    )
  }
  return report
}
