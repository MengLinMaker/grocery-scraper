import { GetProductLinks } from "../interface";



/* This function is not unit testable */
/* istanbul ignore next */
export const getAldiProductLinks:GetProductLinks = async() => {
  const productLinks = [
    'https://www.aldi.com.au/en/groceries/freezer/',
    'https://www.aldi.com.au/en/groceries/super-savers/',
    'https://www.aldi.com.au/en/groceries/pantry/olive-oil/',
    'https://www.aldi.com.au/en/groceries/price-reductions/',
    'https://www.aldi.com.au/en/groceries/fresh-produce/dairy-eggs/'
  ]
  return productLinks
}